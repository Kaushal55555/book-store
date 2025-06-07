// controllers/cartController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add to cart
const addToCart = async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    // Check if book exists and has enough stock
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        bookId,
      },
    });

    if (existingCartItem) {
      // Update quantity if item exists
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
      return res.status(200).json(updatedCartItem);
    }

    // Create new cart item
    const cartItem = await prisma.cart.create({
      data: {
        userId,
        bookId,
        quantity,
      },
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// Get cart items
const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        book: true, // Include book details
      },
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    // Check if quantity is valid
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cartItem = await prisma.cart.update({
      where: { id: parseInt(id) },
      data: { quantity },
    });

    res.status(200).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.cart.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    await prisma.cart.deleteMany({
      where: { userId: parseInt(userId) },
    });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
