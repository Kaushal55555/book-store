const express = require("express");

const router = express.Router();
const authController = require("../controller/authController");
const booksController = require("../controller/booksController");
const cartController = require("../controller/cartController");
const orderController = require("../controller/orderController");
const userController = require("../controller/userController");
const reviewController = require("../controller/reviewControllers");
const dashboardController = require("../controller/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

// auth routes
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

// admin books management routes
router.post("/books/add", booksController.addBook);
router.get("/books", booksController.getBooks);
router.get("/books/:id", booksController.getBook);
router.put("/books/edit/:id", booksController.updateBook);
router.delete("/books/delete/:id", booksController.deleteBook);
router.patch("/books/stock/:id", booksController.updateStock);

router.post("/cart", cartController.addToCart);
router.get("/cart/:userId", cartController.getCart);
router.put("/cart/:id", cartController.updateCartItem);
router.delete("/cart/:id", cartController.removeFromCart);
router.delete("/cart/clear/:userId", cartController.clearCart);

// Place a new order
router.post("/orders", orderController.placeOrder);
router.get("/getOrders", orderController.getAllOrders);

// Get user's orders
router.get("/orders/user/:userId", orderController.getUserOrders);

// Get order details
router.get("/orders/:orderId", orderController.getOrderDetails);

// Cancel order
router.put("/orders/:orderId/cancel", orderController.cancelOrder);

router.put("/orders/:orderId/status", orderController.updateOrderStatus);

router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware, userController.updateUserProfile);
router.put("/change-password", authMiddleware, userController.changePassword);

router.post("/reviews", reviewController.addReview);

// GET /reviews - Get all reviews for a book with pagination
router.get("/reviews/:id", reviewController.getReviews);

// GET /reviews/:id - Get a specific review by ID
// router.get("/reviews/:id", reviewController.getReview); 

// PATCH /reviews/:id - Update a review
router.patch("/reviews/:id", reviewController.updateReview);

// DELETE /reviews/:id - Delete a review
router.delete("/reviews/:id", reviewController.deleteReview);

// GET /reviews/average/:bookId - Get average rating for a book
router.get("/reviews/average/:bookId", reviewController.getAverageRating);

// ===== DASHBOARD ROUTES =====
// These routes should be protected and accessible only to admins

// Dashboard main statistics
router.get(
  "/dashboard/stats",
  authMiddleware,
  dashboardController.getDashboardStats
);

// Specific dashboard sections
router.get(
  "/dashboard/orders",
  authMiddleware,
  dashboardController.getOrderStats
);
router.get(
  "/dashboard/books",
  authMiddleware,
  dashboardController.getBookStats
);
router.get(
  "/dashboard/users",
  authMiddleware,
  dashboardController.getUserStats
);
router.get(
  "/dashboard/revenue",
  authMiddleware,
  dashboardController.getRevenueStats
);
router.get(
  "/dashboard/low-stock",
  authMiddleware,
  dashboardController.getLowStockBooks
);
router.get(
  "/dashboard/recent-orders",
  authMiddleware,
  dashboardController.getRecentOrders
);
router.get(
  "/dashboard/top-selling",
  authMiddleware,
  dashboardController.getTopSellingBooks
);
router.get(
  "/dashboard/recent-reviews",
  authMiddleware,
  dashboardController.getRecentReviews
);

module.exports = router;
