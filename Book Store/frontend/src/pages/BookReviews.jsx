import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, ThumbsUp, MessageCircle, AlertCircle, User } from "lucide-react";

const BookReviews = ({ bookId }) => {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch reviews on component mount or when bookId/page changes
  useEffect(() => {
    fetchReviews();
  }, [bookId, pagination.page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8808/reviews/${bookId}`, {
        params: {
          bookId,
          page: pagination.page,
          limit: 5,
          sort: "desc",
        },
      });

      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setUserReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (userReview.rating === 0) {
      setSubmitError("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

  
      

      await axios.post("http://localhost:8808/reviews", {
        userId,
        bookId: parseInt(bookId),
        rating: userReview.rating,
        comment: userReview.comment,
      });

      // Reset form and show success message
      setUserReview({ rating: 0, comment: "" });
      setSubmitSuccess(true);
      setShowReviewForm(false);

      // Refresh reviews list after a short delay
      setTimeout(() => {
        fetchReviews();
        setSubmitSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error submitting review:", err);

      if (err.response && err.response.data && err.response.data.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Failed to submit review. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={index < rating ? "currentColor" : "none"}
        />
      ));
  };

  const renderRatingInput = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-6 w-6 cursor-pointer ${
            index < (hoverRating || userReview.rating)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
          fill={
            index < (hoverRating || userReview.rating) ? "currentColor" : "none"
          }
          onClick={() => handleRatingClick(index + 1)}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ));
  };

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" />
            Reviews
            {pagination.total > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({pagination.total})
              </span>
            )}
          </h2>

          {!showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Success message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start">
            <ThumbsUp className="h-5 w-5 mr-2 mt-0.5" />
            <p>
              Your review has been submitted successfully! Thank you for your
              feedback.
            </p>
          </div>
        )}

        {/* Review form */}
        {showReviewForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Write Your Review</h3>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setUserReview({ rating: 0, comment: "" });
                  setSubmitError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {renderRatingInput()}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review (Optional)
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  value={userReview.comment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts about this book..."
                ></textarea>
              </div>

              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Submitting...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Reviews list */}
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            <AlertCircle className="h-5 w-5 inline mr-2" />
            {error}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-lg">
            <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">
              No reviews yet. Be the first to review this book!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-6 last:border-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.user?.username || "Anonymous User"}
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:text-gray-400 disabled:bg-gray-100"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-full ${
                        pagination.page === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:text-gray-400 disabled:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookReviews;
