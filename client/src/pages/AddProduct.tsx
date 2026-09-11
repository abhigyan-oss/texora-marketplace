import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PackagePlus,
  Save,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { API_URL } from "../config/api";


const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "Cotton",
    material: "",
    color: "",
    price: "",
    minimumOrder: "",
    stock: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.material.trim()) {
      newErrors.material = "Material is required";
    }

    if (!formData.color.trim()) {
      newErrors.color = "Color is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (
      !formData.minimumOrder ||
      Number(formData.minimumOrder) <= 0
    ) {
      newErrors.minimumOrder =
        "Please enter a valid minimum order quantity";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock = "Please enter valid stock";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("texora-token");

      if (!token) {
        throw new Error(
          "Authorization token not found. Please login again."
        );
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        material: formData.material.trim(),
        color: formData.color.trim(),
        price: Number(formData.price),
        minimumOrder: Number(formData.minimumOrder),
        stock: Number(formData.stock),

        images: formData.image.trim()
          ? [formData.image.trim()]
          : [
              "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17",
            ],
      };

      console.log("Creating product:", productData);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      console.log(
        "Product created successfully:",
        data
      );

      navigate("/supplier/dashboard");

    } catch (error) {
      console.error("Create product error:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <Link
          to="/supplier/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mt-6">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <PackagePlus size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Add New Fabric
              </h1>

              <p className="mt-1 text-slate-500">
                Create a new product listing for your marketplace catalog.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >

            {submitError && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                <AlertTriangle size={18} />
                {submitError}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">

              {/* Product Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Fabric Name *
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Organic Cotton"
                  className={inputClass}
                />

                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Cotton</option>
                  <option>Linen</option>
                  <option>Denim</option>
                  <option>Silk</option>
                  <option>Polyester</option>
                  <option>Wool</option>
                </select>
              </div>

              {/* Material */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Material *
                </label>

                <input
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g. 100% Organic Cotton"
                  className={inputClass}
                />

                {errors.material && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.material}
                  </p>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Color *
                </label>

                <input
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g. White"
                  className={inputClass}
                />

                {errors.color && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.color}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price per Meter (₹) *
                </label>

                <input
                  name="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="250"
                  className={inputClass}
                />

                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Minimum Order */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Minimum Order Quantity *
                </label>

                <input
                  name="minimumOrder"
                  type="number"
                  min="1"
                  value={formData.minimumOrder}
                  onChange={handleChange}
                  placeholder="50"
                  className={inputClass}
                />

                {errors.minimumOrder && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.minimumOrder}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Available Stock *
                </label>

                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="5000"
                  className={inputClass}
                />

                {errors.stock && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.stock}
                  </p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Fabric Image URL
                </label>

                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your fabric, quality, texture and ideal usage..."
                  className={inputClass}
                />

                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">

              <Link
                to="/supplier/dashboard"
                className="flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Add Product
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
