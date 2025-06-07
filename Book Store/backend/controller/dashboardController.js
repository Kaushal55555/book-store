const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Changed from export const to module.exports format
// This makes all exports use the CommonJS style consistently

module.exports = {
  getDashboardStats: async (req, res) => {
    try {
      // Get counts
      const [
        totalUsers,
        totalBooks,
        totalOrders,
        totalRevenue,
        lowStockBooks,
        recentOrders,
        topSellingBooks,
        recentReviews,
      ] = await Promise.all([
        // Total users count
        prisma.user.count(),

        // Total books count
        prisma.book.count(),

        // Total orders count
        prisma.order.count(),

        // Total revenue
        prisma.order.aggregate({
          where: {
            status: "COMPLETED",
          },
          _sum: {
            totalPrice: true,
          },
        }),

        // Low stock books (less than 5 items)
        prisma.book.findMany({
          where: {
            stock: {
              lt: 5,
            },
          },
          select: {
            id: true,
            title: true,
            author: true,
            stock: true,
          },
          orderBy: {
            stock: "asc",
          },
          take: 10,
        }),

        // Recent orders
        prisma.order.findMany({
          take: 5,
          orderBy: {
            orderDate: "desc",
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
            items: {
              include: {
                book: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        }),

        // Top selling books
        prisma.orderItem
          .groupBy({
            by: ["bookId"],
            _sum: {
              quantity: true,
            },
            orderBy: {
              _sum: {
                quantity: "desc",
              },
            },
            take: 5,
          })
          .then(async (results) => {
            const bookIds = results.map((item) => item.bookId);
            const books = await prisma.book.findMany({
              where: {
                id: {
                  in: bookIds,
                },
              },
            });

            // Combine the results
            return results.map((item) => {
              const book = books.find((b) => b.id === item.bookId);
              return {
                ...book,
                totalSold: item._sum.quantity,
              };
            });
          }),

        // Recent reviews
        prisma.review.findMany({
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
            book: {
              select: {
                title: true,
              },
            },
          },
        }),
      ]);

      // Return the dashboard data
      return res.status(200).json({
        stats: {
          totalUsers,
          totalBooks,
          totalOrders,
          totalRevenue: totalRevenue._sum.totalPrice || 0,
        },
        lowStockBooks,
        recentOrders,
        topSellingBooks,
        recentReviews,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching dashboard statistics" });
    }
  },

  getOrderStats: async (req, res) => {
    try {
      // Get the date range (default to last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      // Fetch order statistics by status
      const ordersByStatus = await prisma.order.groupBy({
        by: ["status"],
        _count: true,
      });

      // Fetch orders by date (last 30 days)
      const ordersByDate = await prisma.order.groupBy({
        by: ["orderDate"],
        _count: true,
        where: {
          orderDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          orderDate: "asc",
        },
      });

      // Format the date for frontend display
      const formattedOrdersByDate = ordersByDate.map((item) => ({
        date: item.orderDate.toISOString().split("T")[0],
        count: item._count,
      }));

      return res.status(200).json({
        ordersByStatus,
        ordersByDate: formattedOrdersByDate,
      });
    } catch (error) {
      console.error("Order stats error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching order statistics" });
    }
  },

  getBookStats: async (req, res) => {
    try {
      // Get book statistics by genre
      const booksByGenre = await prisma.book.groupBy({
        by: ["genre"],
        _count: {
          genre: true,
        },
        orderBy: {
          _count: {
            genre: "desc",
          },
        },
      });

      // Get book stock distribution
      const stockDistribution = {
        outOfStock: await prisma.book.count({ where: { stock: 0 } }),
        lowStock: await prisma.book.count({
          where: { stock: { gt: 0, lte: 5 } },
        }),
        adequateStock: await prisma.book.count({
          where: { stock: { gt: 5, lte: 20 } },
        }),
        highStock: await prisma.book.count({ where: { stock: { gt: 20 } } }),
      };

      return res.status(200).json({
        booksByGenre: booksByGenre.map((item) => ({
          genre: item.genre,
          count: item._count.genre,
        })),
        stockDistribution,
      });
    } catch (error) {
      console.error("Book stats error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching book statistics" });
    }
  },

  getUserStats: async (req, res) => {
    try {
      // Get new users by month (last 6 months)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const usersByMonth = await prisma.user.groupBy({
        by: ["createdAt"],
        _count: {
          _all: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Get users by role
      const usersByRole = await prisma.user.groupBy({
        by: ["role"],
        _count: {
          _all: true,
        },
      });

      // Top users by order count
      const topUsersByOrders = await prisma.order
        .groupBy({
          by: ["userId"],
          _count: {
            _all: true,
          },
          orderBy: {
            _count: {
              userId: "desc",
            },
          },
          take: 10,
        })
        .then(async (results) => {
          const userIds = results.map((item) => item.userId);
          const users = await prisma.user.findMany({
            where: {
              id: {
                in: userIds,
              },
            },
            select: {
              id: true,
              username: true,
              email: true,
            },
          });

          // Combine the results
          return results.map((item) => {
            const user = users.find((u) => u.id === item.userId);
            return {
              ...user,
              orderCount: item._count._all,
            };
          });
        });

      return res.status(200).json({
        usersByMonth,
        usersByRole,
        topUsersByOrders,
      });
    } catch (error) {
      console.error("User stats error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching user statistics" });
    }
  },

  getRevenueStats: async (req, res) => {
    try {
      // Get revenue by month (last 12 months)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);

      // We'll need to aggregate by month manually since Prisma doesn't support date functions directly
      const orders = await prisma.order.findMany({
        where: {
          orderDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
        select: {
          orderDate: true,
          totalPrice: true,
        },
      });

      // Group by month
      const revenueByMonth = {};
      orders.forEach((order) => {
        const monthYear = `${order.orderDate.getFullYear()}-${
          order.orderDate.getMonth() + 1
        }`;
        if (!revenueByMonth[monthYear]) {
          revenueByMonth[monthYear] = 0;
        }
        revenueByMonth[monthYear] += Number(order.totalPrice);
      });

      // Convert to array for frontend
      const revenueData = Object.entries(revenueByMonth).map(
        ([monthYear, amount]) => ({
          month: monthYear,
          revenue: amount,
        })
      );

      // Sort by month
      revenueData.sort((a, b) => a.month.localeCompare(b.month));

      // Get revenue by payment method
      const revenueByPayment = await prisma.payment.groupBy({
        by: ["method"],
        where: {
          status: "SUCCESS",
        },
        _sum: {
          paidAmount: true,
        },
      });

      return res.status(200).json({
        revenueByMonth: revenueData,
        revenueByPayment,
      });
    } catch (error) {
      console.error("Revenue stats error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching revenue statistics" });
    }
  },

  getLowStockBooks: async (req, res) => {
    try {
      const lowStockBooks = await prisma.book.findMany({
        where: {
          stock: {
            lt: 5,
          },
        },
        select: {
          id: true,
          title: true,
          author: true,
          stock: true,
          price: true,
          imageUrl: true,
        },
        orderBy: {
          stock: "asc",
        },
      });

      return res.status(200).json(lowStockBooks);
    } catch (error) {
      console.error("Low stock books error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching low stock books" });
    }
  },

  getRecentOrders: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;

      const recentOrders = await prisma.order.findMany({
        take: limit,
        orderBy: {
          orderDate: "desc",
        },
        include: {
          user: {
            select: {
              username: true,
              email: true,
            },
          },
          items: {
            include: {
              book: {
                select: {
                  title: true,
                  imageUrl: true,
                },
              },
            },
          },
          payment: true,
        },
      });

      return res.status(200).json(recentOrders);
    } catch (error) {
      console.error("Recent orders error:", error);
      return res.status(500).json({ message: "Error fetching recent orders" });
    }
  },

  getTopSellingBooks: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;

      const topSellingItems = await prisma.orderItem.groupBy({
        by: ["bookId"],
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: limit,
      });

      if (topSellingItems.length === 0) {
        return res.status(200).json([]);
      }

      const bookIds = topSellingItems.map((item) => item.bookId);

      const books = await prisma.book.findMany({
        where: {
          id: {
            in: bookIds,
          },
        },
        select: {
          id: true,
          title: true,
          author: true,
          price: true,
          imageUrl: true,
          stock: true,
        },
      });

      const topSellingBooks = topSellingItems.map((item) => {
        const book = books.find((b) => b.id === item.bookId);
        return {
          ...book,
          totalSold: item._sum.quantity,
        };
      });

      return res.status(200).json(topSellingBooks);
    } catch (error) {
      console.error("Top selling books error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching top selling books" });
    }
  },

  getRecentReviews: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;

      const recentReviews = await prisma.review.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          book: {
            select: {
              title: true,
              author: true,
              imageUrl: true,
            },
          },
        },
      });

      return res.status(200).json(recentReviews);
    } catch (error) {
      console.error("Recent reviews error:", error);
      return res.status(500).json({ message: "Error fetching recent reviews" });
    }
  },
};
