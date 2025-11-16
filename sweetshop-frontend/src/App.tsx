import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Admin from "./pages/Admin";
import Navbar from "./components/UI/Navbar";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <Admin />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
