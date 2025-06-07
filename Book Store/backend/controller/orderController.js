// controllers/orderController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Place a new order
const placeOrder = async (req, res) => {
  const { userId, shippingDetails, paymentMethod, totalPrice } = req.body;

  try {
    // 1. Check if user has items in cart
    const cartItems = await prisma.cart.findMany({
      where: { userId: parseInt(userId) },
      include: { book: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    // 2. Check if all items are in stock
    for (const item of cartItems) {
      if (item.book.stock < item.quantity) {
        return res.status(400).json({
          error: `"${item.book.title}" has only ${item.book.stock} copies available`,
        });
      }
    }

    // 3. Calculate order total
    const calculatedTotal = cartItems.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );

    // 4. Create the order in a transaction
    const order = await prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          userId: parseInt(userId),
          totalPrice: calculatedTotal,
          status: "PENDING",
          // You can add shipping address details here if needed
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        cartItems.map((item) =>
          prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              bookId: item.bookId,
              quantity: item.quantity,
              price: item.book.price,
            },
          })
        )
      );

      // Update book stock
      await Promise.all(
        cartItems.map((item) =>
          prisma.book.update({
            where: { id: item.bookId },
            data: {
              stock: { decrement: item.quantity },
            },
          })
        )
      );

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod.toUpperCase(),
          status: paymentMethod === "COD" ? "PENDING" : "SUCCESS",
          paidAmount: calculatedTotal,
        },
      });

      // Clear user's cart
      await prisma.cart.deleteMany({
        where: { userId: parseInt(userId) },
      });

      return newOrder;
    });

    // 5. Return success response
    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        items: {
          include: {
            book: true,
          },
        },
        payment: true,
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: {
          include: {
            book: true,
          },
        },
        payment: true,
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if order can be cancelled (only PENDING orders)
    if (order.status !== "PENDING") {
      return res
        .status(400)
        .json({ error: "Only pending orders can be cancelled" });
    }

    // Cancel the order in a transaction
    await prisma.$transaction(async (prisma) => {
      // Update order status
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: "CANCELED" },
      });

      // Update payment status if exists
      if (order.payment) {
        await prisma.payment.update({
          where: { orderId: parseInt(orderId) },
          data: { status: "FAILED" },
        });
      }

      // Restore book stock
      await Promise.all(
        order.items.map((item) =>
          prisma.book.update({
            where: { id: item.bookId },
            data: {
              stock: { increment: item.quantity },
            },
          })
        )
      );
    });

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        items: {
          include: {
            book: true,
          },
        },
        payment: true,
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ["PENDING", "COMPLETED", "CANCELED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Handle status transition
    await prisma.$transaction(async (prisma) => {
      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: status },
      });

      // If changing to CANCELED, restore stock
      if (status === "CANCELED" && order.status !== "CANCELED") {
        // Restore book stock
        await Promise.all(
          order.items.map((item) =>
            prisma.book.update({
              where: { id: item.bookId },
              data: {
                stock: { increment: item.quantity },
              },
            })
          )
        );

        // Update payment status if exists
        if (order.payment) {
          await prisma.payment.update({
            where: { orderId: parseInt(orderId) },
            data: { status: "FAILED" },
          });
        }
      }

      // If changing to COMPLETED and payment method is COD, update payment status
      if (
        status === "COMPLETED" &&
        order.payment?.method === "COD" &&
        order.payment?.status === "PENDING"
      ) {
        await prisma.payment.update({
          where: { orderId: parseInt(orderId) },
          data: { status: "SUCCESS" },
        });
      }
    });

    res.status(200).json({
      message: `Order status updated to ${status} successfully`,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
};
