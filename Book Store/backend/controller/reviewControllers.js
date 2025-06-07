const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add a review
const addReview = async (req, res) => {
  const { userId, bookId, rating, comment } = req.body;

  if (!userId || !bookId || !rating) {
    return res
      .status(400)
      .json({ error: "User ID, Book ID, and rating are required!" });
  }

  try {
    // Check if the user already reviewed this book
    const existingReview = await prisma.review.findFirst({
      where: { userId, bookId },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this book." });
    }

    // Create a new review
    const review = await prisma.review.create({
      data: {
        userId,
        bookId,
        rating: parseInt(rating),
        comment,
      },
    });

    return res.status(201).json({
      message: "Review added successfully!",
      review,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add review" });
  }
};

const getReviews = async (req, res) => {
  const { bookId, page = 1, limit = 10, sort = "desc" } = req.query;

  if (!bookId) {
    return res.status(400).json({ error: "Book ID is required!" });
  }

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch reviews for the book
    const reviews = await prisma.review.findMany({
      where: { bookId: parseInt(bookId) },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
      include: {
        user: { select: { username: true } }, // Include username of reviewer
      },
    });

    // Get total count
    const totalReviews = await prisma.review.count({
      where: { bookId: parseInt(bookId) },
    });

    return res.status(200).json({
      reviews,
      pagination: {
        total: totalReviews,
        page: parseInt(page),
        pages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const getReview = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { username: true } },
        book: { select: { title: true } },
      },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json({ review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch review" });
  }
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        rating: rating ? parseInt(rating) : review.rating,
        comment: comment || review.comment,
      },
    });

    return res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update review" });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete review" });
  }
};

const getAverageRating = async (req, res) => {
  const { bookId } = req.params;

  try {
    const result = await prisma.review.aggregate({
      where: { bookId: parseInt(bookId) },
      _avg: { rating: true },
    });

    return res.status(200).json({
      bookId: parseInt(bookId),
      averageRating: result._avg.rating || 0,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to calculate average rating" });
  }
};

module.exports = {
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  getAverageRating,
};
