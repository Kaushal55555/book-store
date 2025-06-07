// EditBookModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import useToast from "../components/ToastManager";

const EditBookModal = ({ book, onClose, onSuccess }) => {
  const { show } = useToast();
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
    price: book.price,
    stock: book.stock,
    description: book.description || "",
    imageUrl: book.imageUrl || "",
    isbn: book.isbn,
  });

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
      await axios.put(`http://localhost:8808/books/edit/${book.id}`, formData);
      show({
        message: "Book updated successfully!",
        type: "success",
        duration: 3000,
      });
      onSuccess();
    } catch (err) {
      show({
        message: err.response?.data?.error || "Failed to update book",
        type: "error",
        duration: 3000,
      });
    }
  };

  const inputClasses =
    "w-full px-5 py-3.5 text-base bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white border-0";
  const labelClasses = "block text-base font-medium text-gray-700 mb-2";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Book</h2>
            <p className="text-gray-500 mt-1">Update book information</p>
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
          {/* Same form fields as AddBookModal but with pre-filled values */}
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>Genre *</label>
              <select
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                className={`${inputClasses} appearance-none`}
                required
              >
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
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Price *</label>
              <div className="relative">
                <span className="absolute left-5 top-3.5 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={`${inputClasses} pl-10`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`${inputClasses} resize-none`}
                rows="4"
              />
            </div>
          </div>

          <div className="col-span-full flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
