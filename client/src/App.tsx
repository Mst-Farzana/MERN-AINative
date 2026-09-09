import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import About from "./pages/About";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; // নতুন লগইন পেজ ইম্পোর্ট
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Settings from "./pages/Settings";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token"),
  );

  const syncApiToken = () => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete axios.defaults.headers.common.Authorization;
  };

  useEffect(() => {
    const syncAuthentication = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      syncApiToken();
    };

    syncApiToken();
    window.addEventListener("auth-change", syncAuthentication);
    return () => window.removeEventListener("auth-change", syncAuthentication);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Route: Login Page */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />

        {/* 2. Protected Routes: Layout & Dashboard Pages */}
        <Route
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* 3. Fallback: যদি কেউ ভুল URL দেয় */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
