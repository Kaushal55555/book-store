import React, { useState } from "react";
import { Edit2, Trash2, BookOpen } from "lucide-react";
import EditBookModal from "./EditBookModal";

const BookTable = ({
  books,
  loading,
  onDelete,
  onEdit,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const [editingBook, setEditingBook] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-8 py-5 text-gray-600 font-semibold text-base bg-gray-50/50">
                Book
              </th>
              <th className="text-left px-6 py-5 text-gray-600 font-semibold text-base bg-gray-50/50">
                Author
              </th>
              <th className="text-left px-6 py-5 text-gray-600 font-semibold text-base bg-gray-50/50">
                Genre
              </th>
              <th className="text-left px-6 py-5 text-gray-600 font-semibold text-base bg-gray-50/50">
                Price
              </th>
              <th className="text-left px-6 py-5 text-gray-600 font-semibold text-base bg-gray-50/50">
                Stock
              </th>
              <th className="text-right px-8 py-5 text-gray-600 font-semibold text-base bg-gray-50/50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="flex items-center justify-center gap-3">
                    <BookOpen className="h-6 w-6 text-blue-500 animate-pulse" />
                    <span className="text-gray-500">Loading books...</span>
                  </div>
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-500">No books found</span>
                  </div>
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={book.imageUrl || "/api/placeholder/48/48"}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover shadow-sm"
                      />
                      <div>
                        <div className="font-medium text-gray-900 mb-0.5">
                          {book.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ISBN: {book.isbn}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{book.author}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      ${parseFloat(book.price).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        book.stock > 5
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {book.stock > 0
                        ? `${book.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setEditingBook(book)}
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => onDelete(book.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-8 py-6 bg-gray-50/50">
        <div className="text-sm font-medium text-gray-600">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSuccess={() => {
            setEditingBook(null);
            onEdit();
          }}
        />
      )}
    </div>
  );
};

export default BookTable;
