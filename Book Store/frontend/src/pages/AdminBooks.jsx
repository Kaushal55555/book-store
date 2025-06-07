import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, AlertCircle } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BookTable from "../components/BookTable.jsx";
import AddBookModal from "../components/AddBookModal.jsx";
import useToast from "../components/ToastManager";

const AdminBooks = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { show, ToastContainer } = useToast();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8808/books?page=${currentPage}&limit=7${
          searchQuery ? `&title=${searchQuery}` : ""
        }`
      );
      setBooks(response.data.books || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:8808/books/delete/${id}`);
        show({
          message: "Book deleted successfully",
          type: "success",
          duration: 3000,
        });
        fetchBooks();
      } catch (err) {
        show({
          message: "Failed to delete book",
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar isCollapsed={isCollapsed} />
        <ToastContainer />

        <main
          className={`flex-1 overflow-y-auto p-6 ${
            isCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Books Management
              </h1>
              <p className="text-gray-500 mt-1">Manage your book inventory</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Add New Book
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <BookTable
            books={books}
            loading={loading}
            onDelete={handleDelete}
            onEdit={fetchBooks}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

          {/* Add Book Modal */}
          {showAddModal && (
            <AddBookModal
              onClose={() => setShowAddModal(false)}
              onSuccess={() => {
                setShowAddModal(false);
                show({
                  message: "Book added successfully",
                  type: "success",
                  duration: 3000,
                });
                fetchBooks();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminBooks;
