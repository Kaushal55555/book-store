import React from "react";

const BookPreview = () => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-40">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 overflow-hidden transform transition-all duration-300 scale-95 to-scale-100">
        <div className="relative">
          <button
            onClick={() => setSelectedBook(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="p-8">
            <div className="flex gap-8">
              <img
                src={selectedBook.image}
                alt={selectedBook.title}
                className="w-48 h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {selectedBook.title}
                </h3>
                <p className="text-gray-600 mb-4">{selectedBook.author}</p>
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-gray-600">
                    {selectedBook.rating}
                  </span>
                </div>
                <p className="text-gray-700 mb-6">{selectedBook.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedBook.price}
                  </span>
                  <button
                    onClick={handlePurchaseClick}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {isLoggedIn ? "Add to Cart" : "Purchase"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPreview;
