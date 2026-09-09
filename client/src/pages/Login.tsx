import axios, { AxiosError } from "axios";
import { HeartPulse, Lock, Mail, Shield, Truck } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  
  const [role, setRole] = useState<"admin" | "delivery">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
        role,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));

      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Login failed. Please check your credentials or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Professional Medical Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80"
          alt="Medical Professional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Professional Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 to-cyan-900/70 flex flex-col justify-center p-12 text-white">
          <div className="flex items-center gap-3 mb-6">
            <HeartPulse className="w-10 h-10 text-cyan-400" />
            <h2 className="text-3xl font-bold tracking-tight">MediSchedule</h2>
          </div>
          <h3 className="text-4xl font-semibold mb-4 leading-tight">
            Manage your health <br /> with confidence.
          </h3>
          <p className="text-blue-100 text-lg max-w-md">
            Seamlessly book appointments, manage schedules, and connect with healthcare professionals in one secure platform.
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back
            </h1>
            <p className="mt-2 text-slate-600">
              Please enter your details to sign in to your {role === "admin" ? "Admin" : "Delivery"} account.
            </p>
          </div>

          {/* Role Toggle Tabs */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                role === "admin"
                  ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("delivery")}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                role === "delivery"
                  ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <Truck className="w-4 h-4" />
              Delivery
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "admin" ? "admin@business.com" : "delivery@business.com"}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;