import React, { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  X,
  CreditCard,
  Truck,
  ArrowLeft,
  Smartphone,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import useToast from "../components/ToastManager";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show, ToastContainer } = useToast();

  const [orderDetails, setOrderDetails] = useState({
    fullName: "",
    address: "",
    province: "Bagmati Province",
    district: "",
    city: "",
    phone: "",
    paymentMethod: "esewa",
  });

  // Nepal's provinces
  const provinces = [
    "Koshi Province",
    "Madesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ];

  const paymentMethods = [
    { id: "esewa", name: "eSewa", icon: Smartphone },
    { id: "khalti", name: "Khalti", icon: Smartphone },
    { id: "cod", name: "Cash on Delivery", icon: Truck },
  ];

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Get userId from authentication context or localStorage
      const userId = 1; // Replace with actual user ID from auth

      const response = await axios.get(`http://localhost:8808/cart/${userId}`);
      setCart(response.data);
    } catch (err) {
      show({
        message: "Failed to fetch cart",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update quantity with API call
  const updateQuantity = async (cartItemId, delta) => {
    try {
      const item = cart.find((i) => i.id === cartItemId);
      if (!item) return;

      const newQuantity = item.quantity + delta;
      if (newQuantity < 1) {
        removeItem(cartItemId);
        return;
      }

      await axios.put(`http://localhost:8808/cart/${cartItemId}`, {
        quantity: newQuantity,
      });

      // Update local state
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      show({
        message: "Failed to update quantity",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Remove item with API call
  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8808/cart/${cartItemId}`);

      // Update local state
      setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));

      show({
        message: "Item removed from cart",
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      show({
        message: "Failed to remove item",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Calculate totals based on cart data
  const subtotal = cart.reduce((sum, item) => {
    // Check if item has a book property (from API) or direct price
    const price = item.book ? item.book.price : item.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = 100; // Shipping cost in NPR
  const total = subtotal + shipping;

  // Place order with API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      show({
        message: "Your cart is empty",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const userId = 1; // Replace with actual user ID from auth

      const orderData = {
        userId,
        shippingDetails: {
          fullName: orderDetails.fullName,
          address: orderDetails.address,
          province: orderDetails.province,
          district: orderDetails.district,
          city: orderDetails.city,
          phone: orderDetails.phone,
        },
        paymentMethod: orderDetails.paymentMethod,
        totalPrice: total,
      };

      const response = await axios.post(
        "http://localhost:8808/orders",
        orderData
      );

      show({
        message: "Order placed successfully!",
        type: "success",
        duration: 3000,
      });

      // Clear cart from state
      setCart([]);

      // Redirect to order confirmation
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (err) {
      show({
        message: err.response?.data?.error || "Failed to place order",
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
          Continue Shopping
        </Link>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <Link
                      to="/home"
                      className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                    >
                      Start shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6 py-6 border-b">
                        <img
                          src={
                            (item.book ? item.book.imageUrl : item.imageUrl) ||
                            "/api/placeholder/120/180"
                          }
                          alt={item.book ? item.book.title : item.title}
                          className="w-24 h-36 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-lg">
                                {item.book ? item.book.title : item.title}
                              </h3>
                              <p className="text-gray-500">
                                {item.book ? item.book.author : item.author}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="font-medium text-lg">
                              Rs.{" "}
                              {(
                                (item.book ? item.book.price : item.price) *
                                item.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      Rs. {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      Rs. {shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={orderDetails.fullName}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Province
                    </label>
                    <select
                      required
                      value={orderDetails.province}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          province: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {provinces.map((province, index) => (
                        <option key={index} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        required
                        value={orderDetails.district}
                        onChange={(e) =>
                          setOrderDetails((prev) => ({
                            ...prev,
                            district: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter district"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City/Municipality
                      </label>
                      <input
                        type="text"
                        required
                        value={orderDetails.city}
                        onChange={(e) =>
                          setOrderDetails((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Detailed Address
                    </label>
                    <textarea
                      required
                      value={orderDetails.address}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      rows="2"
                      placeholder="Street address, House number, Landmark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderDetails.phone}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="98XXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={orderDetails.paymentMethod === method.id}
                            onChange={(e) =>
                              setOrderDetails((prev) => ({
                                ...prev,
                                paymentMethod: e.target.value,
                              }))
                            }
                          />
                          <method.icon className="h-5 w-5 text-blue-600" />
                          <span>{method.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cart.length === 0}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                  >
                    Place Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
