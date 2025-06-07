import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import useToast from "../components/ToastManager";

const AddBookModal = ({ onClose, onSuccess }) => {
  const { show, ToastContainer } = useToast();

  const initialFormState = {
    title: "",
    author: "",
    genre: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    isbn: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
    "Thriller",
    "Horror",
    "Biography",
    "History",
    "Science",
    "Technology",
    "Business",
    "Self-Help",
    "Children",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8808/books/add", formData);
      show({
        message: "Book added successfully!",
        type: "success",
        duration: 3000,
      });
      onSuccess();
    } catch (err) {
      show({
        message: err.response?.data?.error || "Failed to add book",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputClasses =
    "w-full px-5 py-3.5 text-base bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white border-0";
  const labelClasses = "block text-base font-medium text-gray-700 mb-2";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-40">
      <ToastContainer />
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 overflow-hidden transform transition-all duration-300 scale-95 to-scale-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
              <p className="text-gray-500 mt-1">
                Add a new book to your collection
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className={labelClasses}>Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter book title"
                  className={inputClasses}
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={labelClasses}>Author *</label>
                <input
                  type="text"
                  name="author"
                  required
                  placeholder="Enter author name"
                  className={inputClasses}
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={labelClasses}>Genre *</label>
                <select
                  name="genre"
                  required
                  className={`${inputClasses} appearance-none cursor-pointer`}
                  value={formData.genre}
                  onChange={handleChange}
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>ISBN *</label>
                <input
                  type="text"
                  name="isbn"
                  required
                  placeholder="Enter ISBN number"
                  className={inputClasses}
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className={labelClasses}>Price *</label>
                <div className="relative">
                  <span className="absolute left-5 top-3.5 text-gray-500 text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    className={`${inputClasses} pl-10`}
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  required
                  placeholder="Enter quantity in stock"
                  className={inputClasses}
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={labelClasses}>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://"
                  className={inputClasses}
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className={labelClasses}>Description</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Enter a detailed description of the book"
                  className={`${inputClasses} resize-none`}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="col-span-full flex justify-end items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
