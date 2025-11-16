import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const auth = useContext(AuthContext)!;
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.register({ name, email, password });
      // if backend doesn't auto-login, you may navigate to login
      nav("/");
    } catch {
      // handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
        <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"
          className="w-full p-2 border rounded" />
        <input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"
          className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2 rounded">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
