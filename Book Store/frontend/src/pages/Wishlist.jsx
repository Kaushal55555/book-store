// pages/Wishlist.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowLeft, Heart } from "lucide-react";
import useToast from "../components/ToastManager";

// Helper functions inside the same file
function getWishlistFromStorage() {
  try {
    const data = localStorage.getItem("wishlist");
    if (!data) return [];

    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (err) {
    console.error("Error reading wishlist from storage:", err);
    return [];
  }
}

function saveWishlistToStorage(items) {
  try {
    localStorage.setItem("wishlist", JSON.stringify(items));
    return true;
  } catch (err) {
    console.error("Error saving wishlist to storage:", err);
    return false;
  }
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show, ToastContainer } = useToast();

  // Load wishlist on component mount
  useEffect(() => {
    try {
      setLoading(true);
      const currentWishlist = getWishlistFromStorage();
      console.log("Wishlist component loaded items:", currentWishlist);
      setWishlist(currentWishlist);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      show({
        message: "Failed to load wishlist",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // REMOVED the second useEffect that was saving on state change

  const removeFromWishlist = (bookId) => {
    try {
      console.log("Removing book with ID:", bookId);

      // Get current data from storage first
      const currentWishlist = getWishlistFromStorage();

      // Filter out the item to remove
      const updatedWishlist = currentWishlist.filter(
        (item) => String(item.id) !== String(bookId)
      );

      // First update storage
      saveWishlistToStorage(updatedWishlist);

      // Then update state
      setWishlist(updatedWishlist);

      show({
        message: "Removed from wishlist",
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      show({
        message: "Failed to remove from wishlist",
        type: "error",
        duration: 3000,
      });
    }
  };

  const moveToCart = (book) => {
    try {
      if (book.stock <= 0) {
        show({
          message: "Item is out of stock",
          type: "error",
          duration: 2000,
        });
        return;
      }

      // Get current cart from storage
      let cart = [];
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          cart = JSON.parse(storedCart);
        }
      } catch (e) {
        console.error("Error parsing cart:", e);
        cart = [];
      }

      // Add to cart
      const cartItem = {
        userId: 1,
        bookId: book.id,
        quantity: 1,
        book: book,
      };

      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));

      // Remove from wishlist
      removeFromWishlist(book.id);

      show({
        message: "Item moved to cart",
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error("Error moving to cart:", err);
      show({
        message: "Failed to move item to cart",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />

      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Books
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Wishlist ({wishlist.length})
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Save books you're interested in for later
            </p>
            <Link
              to="/home"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Explore Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative">
                  <img
                    src={book.imageUrl || "/api/placeholder/200/300"}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    {book.genre}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-800">
                      Rs. {book.price}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        book.stock > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {book.stock > 0 ? `In Stock` : "Out of Stock"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => moveToCart(book)}
                      disabled={book.stock === 0}
                      className={`flex items-center justify-center gap-1 py-2 rounded-lg text-sm ${
                        book.stock > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(book.id)}
                      className="flex items-center justify-center gap-1 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
