import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Clock,
  Book,
  Tag,
  Copy,
  AlertCircle,
  Check,
} from "lucide-react";
import BookReviews from "./BookReviews";

const SingleBook = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  // Add new states for average rating and review count
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    fetchBook();
    checkWishlist();
    fetchRatingData(); // Add this new function call
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8808/books/${id}`);
      setBook(response.data.book);
      console.log(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching book:", err);
      setError("Failed to load book details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new function to fetch rating data
  const fetchRatingData = async () => {
    try {
      // Get average rating
      const ratingResponse = await axios.get(
        `http://localhost:8808/reviews/average/${id}`
      );
      setAverageRating(ratingResponse.data.averageRating || 0);

      // Get review count
      const reviewsResponse = await axios.get(`http://localhost:8808/reviews`, {
        params: { bookId: id, limit: 1 }, // We only need the count, not all reviews
      });
      setReviewCount(reviewsResponse.data.pagination?.total || 0);
    } catch (err) {
      console.error("Error fetching rating data:", err);
      // Don't set error state here to avoid blocking the main UI
    }
  };

  const checkWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setInWishlist(wishlist.some((item) => item.id === parseInt(id)));
    } catch (err) {
      console.error("Error checking wishlist:", err);
    }
  };

  const addToCart = async () => {
    try {
      setIsAddingToCart(true);
      // Try to use API if available
      try {
        await axios.post("http://localhost:8808/cart", {
          userId: 1, // Replace with actual user ID from auth
          bookId: book.id,
          quantity: 1,
        });
      } catch (apiError) {
        console.log("API call failed, using localStorage fallback");
        // Fallback to localStorage
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cartItems.find((item) => item.bookId === book.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cartItems.push({
            id: Date.now(),
            bookId: book.id,
            book: book,
            quantity: 1,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));
      }

      showToastMessage("Added to cart", "success");
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToastMessage("Failed to add to cart", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      if (inWishlist) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter((item) => item.id !== book.id);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setInWishlist(false);
        showToastMessage("Removed from wishlist", "info");
      } else {
        // Add to wishlist
        wishlist.push(book);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setInWishlist(true);
        showToastMessage("Added to wishlist", "success");
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      showToastMessage("Failed to update wishlist", "error");
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Helper function to render stars based on the dynamic rating
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className="h-5 w-5 text-yellow-400"
        fill={star <= Math.round(rating) ? "currentColor" : "none"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Book
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Book Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The book you're looking for doesn't seem to exist.
          </p>
          <Link
            to="/books"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-md ${
            toastType === "success"
              ? "bg-green-600 text-white"
              : toastType === "error"
              ? "bg-red-600 text-white"
              : "bg-blue-600 text-white"
          } flex items-center`}
        >
          {toastType === "success" ? (
            <Check className="h-5 w-5 mr-2" />
          ) : toastType === "error" ? (
            <AlertCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {toastMessage}
        </div>
      )}
      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-blue-600 mb-8 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Books
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Book className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Action buttons - mobile view */}
              <div className="mt-6 space-y-3 lg:hidden">
                <button
                  onClick={addToCart}
                  disabled={book.stock === 0 || isAddingToCart}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    book.stock > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isAddingToCart ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    inWishlist
                      ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={inWishlist ? "currentColor" : "none"}
                  />
                  {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-700 mb-4">by {book.author}</p>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <div className="flex">
                    {/* Replace static stars with dynamic stars */}
                    {renderStars(averageRating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {/* Replace static text with dynamic values */}
                    {averageRating.toFixed(1)} ({reviewCount}{" "}
                    {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Added on {new Date(book.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">About the Book</h2>
                <p className="text-gray-700 leading-relaxed">
                  {book.description ||
                    "No description available for this book. This is a placeholder text that would normally contain a summary of the book's content, themes, and other relevant information to help readers decide if they'd like to purchase it."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Tag className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <span className="block text-sm text-gray-500">
                          Genre
                        </span>
                        <span className="font-medium">
                          {book.genre || "Not specified"}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Copy className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <span className="block text-sm text-gray-500">
                          ISBN
                        </span>
                        <span className="font-medium">
                          {book.isbn || "Not available"}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Book className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <span className="block text-sm text-gray-500">
                          Status
                        </span>
                        <span
                          className={`font-medium ${
                            book.stock > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {book.stock > 0
                            ? `In Stock (${book.stock} available)`
                            : "Out of Stock"}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      Rs. {book.price}
                    </span>
                    {book.discount > 0 && (
                      <span className="ml-2 text-sm line-through text-gray-500">
                        Rs. {book.price * 1.2}
                      </span>
                    )}
                  </div>

                  {book.discount > 0 && (
                    <div className="bg-green-100 text-green-700 text-sm font-medium py-1 px-2 rounded mb-4 inline-block">
                      Save 20%
                    </div>
                  )}

                  {/* Action buttons - desktop view */}
                  <div className="hidden lg:flex lg:flex-col lg:space-y-3">
                    <button
                      onClick={addToCart}
                      disabled={book.stock === 0 || isAddingToCart}
                      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                        book.stock > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isAddingToCart ? (
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                      {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <button
                      onClick={toggleWishlist}
                      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                        inWishlist
                          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        className="h-5 w-5"
                        fill={inWishlist ? "currentColor" : "none"}
                      />
                      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add the BookReviews component with the bookId */}
        <BookReviews bookId={id} />
      </div>
    </div>
  );
};

export default SingleBook;
