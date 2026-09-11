import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../config/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save authentication data
      localStorage.setItem(
        "texora-token",
        data.token
      );

      localStorage.setItem(
        "texora-user",
        JSON.stringify(data.user)
      );

      // Redirect based on role
      if (data.user.role === "supplier") {
        navigate("/supplier/dashboard");
      } else {
        navigate("/marketplace");
      }

    } catch (error: any) {
      setError(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

          {/* Logo */}
          <Link
            to="/"
            className="relative z-10 flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              T
            </div>

            <span className="text-2xl font-bold tracking-tight text-white">
              Texora
            </span>
          </Link>

          {/* Main Content */}
          <div className="relative z-10 max-w-lg">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-300">
              <Sparkles size={16} />
              India's modern textile marketplace
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
              The smarter way to source fabrics.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Connect with verified textile suppliers,
              discover premium fabrics, and manage your
              sourcing journey from one intelligent platform.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6">

              <div>
                <p className="text-2xl font-bold text-white">
                  2,000+
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Products
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  500+
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Suppliers
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  20+
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Cities
                </p>
              </div>

            </div>

          </div>

          <p className="relative z-10 text-sm text-slate-500">
            © 2026 Texora Marketplace
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="mb-12 flex items-center justify-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                T
              </div>

              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Texora
              </span>
            </Link>

            {/* Heading */}
            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Welcome back
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                Sign in to Texora
              </h2>

              <p className="mt-3 text-slate-500">
                Enter your details to continue to your marketplace.
              </p>

            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />

                Remember me

              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}

                {!loading && (
                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-600">

              New to Texora?{" "}

              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create an account
              </Link>

            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
