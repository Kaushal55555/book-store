const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add a new book
const addBook = async (req, res) => {
  const { title, author, genre, price, stock, description, imageUrl, isbn } =
    req.body;

  // Check required fields
  if (!title || !author || !price || !stock) {
    return res.status(400).json({ error: "Please fill all required fields!" });
  }

  try {
    const existingBook = await prisma.book.findFirst({
      where: {
        OR: [
          { isbn },
          {
            AND: [{ title }, { author }],
          },
        ],
      },
    });

    if (existingBook) {
      return res.status(400).json({ error: "Book already exists" });
    }

    // Add new book
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        genre,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        imageUrl,
        isbn,
        status: stock > 0 ? "available" : "out_of_stock",
      },
    });

    return res.status(201).json({
      message: "Book added successfully!",
      book: newBook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add book" });
  }
};

// Get all books with filters and pagination
const getBooks = async (req, res) => {
  const {
    title,
    author,
    genre,
    page = 1,
    limit = 10,
    status,
    minPrice,
    maxPrice,
  } = req.query;

  try {
    // Build filters
    const filters = {};
    if (title) filters.title = { contains: title, mode: "insensitive" };
    if (author) filters.author = { contains: author, mode: "insensitive" };
    if (genre) filters.genre = { contains: genre, mode: "insensitive" };
    if (status) filters.status = status;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get books
    const books = await prisma.book.findMany({
      where: filters,
      skip,
      take: parseInt(limit),
      orderBy: { title: "asc" },
    });

    // Get total count
    const total = await prisma.book.count({ where: filters });

    return res.status(200).json({
      books,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Get single book by ID
const getBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({ book });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch book" });
  }
};

// Update book
const updateBook = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Update book
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        ...updates,
        price: updates.price ? parseFloat(updates.price) : undefined,
        stock: updates.stock ? parseInt(updates.stock) : undefined,
        status: updates.stock === 0 ? "out_of_stock" : "available",
      },
    });

    return res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update book" });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete book
    await prisma.book.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete book" });
  }
};

// Update stock
const updateStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        stock: parseInt(stock),
        status: parseInt(stock) > 0 ? "available" : "out_of_stock",
      },
    });

    return res.status(200).json({
      message: "Stock updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update stock" });
  }
};

module.exports = {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  updateStock,
};
