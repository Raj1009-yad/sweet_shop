// src/components/Auth/Login.tsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const auth = useContext(AuthContext)!;
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false); // new
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.login(email, password, admin);
      nav("/");
    } catch {
      // error toast from context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded"
        />
        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} />
          <span>Login as administrator</span>
        </label>

        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2 rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="text-indigo-600">Register</Link>
      </p>
    </div>
  );
}
