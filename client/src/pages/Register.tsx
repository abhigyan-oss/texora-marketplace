import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  ShoppingBag,
  User,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("buyer");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role,
          }),
        }
      );

      const data = await response.json();

      console.log("Registration response:", data);

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "texora-token",
        data.token
      );

      // Save logged-in user
      localStorage.setItem(
        "texora-user",
        JSON.stringify(data.user)
      );

      alert("Registration successful!");

      // Navigate based on role
      if (data.user.role === "buyer") {
        navigate("/onboarding/buyer");
      } else {
        navigate("/onboarding/supplier");
      }

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-bold text-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <ShoppingBag size={20} />
            </div>

            Texora
          </Link>

          <h1 className="mt-8 text-4xl font-bold text-slate-900">
            Join the marketplace
          </h1>

          <p className="mt-3 text-slate-500">
            Create your account and start exploring India's textile marketplace.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >

          {/* Name */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

          </div>

          {/* Email */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

          </div>

          {/* Password */}
          <div className="mb-8">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a secure password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

          </div>

          {/* Role Selection */}
          <div className="mb-8">

            <h3 className="mb-4 text-lg font-bold text-slate-900">
              How will you use Texora?
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              {/* Buyer */}
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  role === "buyer"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <User size={22} />
                </div>

                <h4 className="mt-4 font-bold text-slate-900">
                  I'm a Buyer
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Discover fabrics, compare suppliers and place bulk orders.
                </p>

              </button>

              {/* Supplier */}
              <button
                type="button"
                onClick={() => setRole("supplier")}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  role === "supplier"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Building2 size={22} />
                </div>

                <h4 className="mt-4 font-bold text-slate-900">
                  I'm a Supplier
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  List products, manage inventory and receive customer orders.
                </p>

              </button>

            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading
              ? "Creating Account..."
              : "Continue"}

            {!loading && (
              <ArrowRight size={18} />
            )}

          </button>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Login
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
};

export default Register;