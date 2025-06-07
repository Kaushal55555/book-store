import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AdminBooks from "./pages/AdminBooks";
import AdminOrders from "./pages/AdminOrders";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import SingleOrder from "./pages/SingleOrder";
import AdminSettings from "./pages/AdminSettings";
import SingleBook from "./pages/SingleBook";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />z
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/books/:id" element={<SingleBook />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminBooks" element={<AdminBooks />} />
        <Route path="/adminOrders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<SingleOrder />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
