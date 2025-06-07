import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Star,
  Heart,
  ShoppingCart,
  Loader,
  Search,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useToast from "../components/ToastManager";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [bookRatings, setBookRatings] = useState({}); // Store ratings for all books
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (err) {
      console.error("Error loading wishlist from localStorage:", err);
      return [];
    }
  });
  const { show, ToastContainer } = useToast();
  const navigate = useNavigate();

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      console.log("Wishlist saved to localStorage:", wishlist);
    } catch (err) {
      console.error("Error saving wishlist to localStorage:", err);
    }
  }, [wishlist]); // Added wishlist dependency

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8808/books");
      const booksData = response.data.books || [];
      setBooks(booksData);

      // Extract unique genres
      if (booksData.length) {
        const uniqueGenres = [
          ...new Set(booksData.map((book) => book.genre)),
        ].filter(Boolean);
        setGenres(uniqueGenres);
      }

      // Fetch ratings for all books
      fetchAllBookRatings(booksData);
    } catch (err) {
      show({
        message: "Failed to fetch books",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch ratings for all books
  const fetchAllBookRatings = async (booksData) => {
    try {
      // Create an object to store ratings
      const ratingsData = {};

      // Use Promise.all to fetch all ratings in parallel
      await Promise.all(
        booksData.map(async (book) => {
          try {
            const response = await axios.get(
              `http://localhost:8808/reviews/average/${book.id}`
            );
            ratingsData[book.id] = {
              averageRating: response.data.averageRating || 0,
            };

            // Also get review count for each book
            const reviewsResponse = await axios.get(
              `http://localhost:8808/reviews`,
              {
                params: { bookId: book.id, limit: 1 },
              }
            );
            ratingsData[book.id].reviewCount =
              reviewsResponse.data.pagination?.total || 0;
          } catch (error) {
            console.error(`Error fetching rating for book ${book.id}:`, error);
            ratingsData[book.id] = { averageRating: 0, reviewCount: 0 };
          }
        })
      );

      setBookRatings(ratingsData);
    } catch (error) {
      console.error("Error fetching book ratings:", error);
    }
  };

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      // Replace with your user ID (should come from auth)
      const userId = 1;
      const response = await axios.get(`http://localhost:8808/cart/${userId}`);

      // Calculate total items in cart
      const count = response.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCartCount();
  }, []);

  // Navigate to single book page
  const navigateToBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  // Add to cart in database
  const addToCart = async (e, book) => {
    // Prevent the event from bubbling up to the parent (book card)
    e.stopPropagation();

    try {
      // Replace with your user ID (should come from auth)
      const userId = 1;

      await axios.post("http://localhost:8808/cart", {
        userId,
        bookId: book.id,
        quantity: 1,
      });

      show({
        message: "Added to cart!",
        type: "success",
        duration: 2000,
      });

      // Refresh cart count
      fetchCartCount();
    } catch (err) {
      show({
        message: err.response?.data?.error || "Failed to add to cart",
        type: "error",
        duration: 3000,
      });
    }
  };

  const toggleWishlist = (e, book) => {
    // Prevent the event from bubbling up to the parent (book card)
    e.stopPropagation();

    // Get the current wishlist directly from localStorage to ensure we have the latest data
    let currentWishlist = [];
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        currentWishlist = JSON.parse(storedWishlist);
      }
    } catch (err) {
      console.error("Error reading wishlist from localStorage:", err);
    }

    // Check if the book is already in the wishlist
    const isInWishlist = currentWishlist.some((item) => item.id === book.id);

    let updatedWishlist = [];

    if (isInWishlist) {
      // Remove the book from wishlist
      updatedWishlist = currentWishlist.filter((item) => item.id !== book.id);

      // Update state
      setWishlist(updatedWishlist);

      // Show notification
      show({
        message: "Removed from wishlist",
        type: "info",
        duration: 2000,
      });
    } else {
      // Add the book to wishlist
      updatedWishlist = [...currentWishlist, book];

      // Update state
      setWishlist(updatedWishlist);

      // Show notification
      show({
        message: "Added to wishlist",
        type: "success",
        duration: 2000,
      });
    }

    // Save to localStorage immediately
    try {
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      console.log("Wishlist saved to localStorage:", updatedWishlist);
    } catch (err) {
      console.error("Error saving wishlist to localStorage:", err);
    }
  };

  // Filter books based on search and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === "" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  // Helper function to get rating for a book
  const getBookRating = (bookId) => {
    return bookRatings[bookId] || { averageRating: 0, reviewCount: 0 };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">BookHaven</h1>
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative">
              <Heart className="h-6 w-6 text-gray-600 hover:text-red-500 transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-60  0 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="border-blue-600">
              <Link
                className="border-blue-600 border px-4 py-2 rounded-3xl"
                to="/login"
              >
                Logout
              </Link>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto">
            <div className="relative">
              <select
                className="w-full md:w-48 pl-4 pr-10 py-2 appearance-none rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 bg-white"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Books Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Books</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No books found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const { averageRating, reviewCount } = getBookRating(book.id);

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigateToBook(book.id)}
                >
                  <div className="relative">
                    <img
                      src={book.imageUrl || "/api/placeholder/200/300"}
                      alt={book.title}
                      className="w-full h-60 object-cover rounded-t-xl"
                    />
                    <button
                      onClick={(e) => toggleWishlist(e, book)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white"
                    >
                      <Heart
                        className="h-5 w-5 text-red-500"
                        fill={
                          wishlist.some((item) => item.id === book.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-blue-600 font-medium mb-1">
                      {book.genre}
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1 h-12 overflow-hidden">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">
                        Rs. {book.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star
                          className={`h-4 w-4 ${
                            averageRating > 0
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                        <span className="text-sm text-gray-600">
                          {averageRating > 0
                            ? averageRating.toFixed(1)
                            : "No ratings"}
                          {reviewCount > 0 && ` (${reviewCount})`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => addToCart(e, book)}
                      disabled={!book.stock}
                      className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 
                        ${
                          book.stock
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {book.stock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
