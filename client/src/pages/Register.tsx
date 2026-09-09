import axios, { AxiosError } from "axios";
import { Shield, Truck } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [role, setRole] = useState<"admin" | "delivery">("admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Cannot reach the backend. Start the server and allow this IP in MongoDB Atlas Network Access.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80"
          alt="Office workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-7">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Register your dashboard account
            </p>
          </div>

          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 ${role === "admin" ? "bg-white text-teal-700 shadow-sm" : "text-gray-500"}`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("delivery")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 ${role === "delivery" ? "bg-white text-teal-700 shadow-sm" : "text-gray-500"}`}
            >
              <Truck className="w-4 h-4" /> Delivery Boy
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password (minimum 6 characters)"
              minLength={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              minLength={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 hover:text-teal-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
