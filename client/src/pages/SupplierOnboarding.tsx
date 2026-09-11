import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Phone,
  MapPin,
  Clock,
  Package,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { API_URL } from "../config/api";

interface FormData {
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
  operatingHours: string;
  categories: string;
  fabrics: string;
  moq: string;
}

const initialFormData: FormData = {
  businessName: "",
  businessType: "",
  email: "",
  phone: "",
  address: "",
  operatingHours: "",
  categories: "",
  fabrics: "",
  moq: "",
};

function SupplierOnboarding() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear error while user is typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Trim values before validation
    const cleanedData = {
      businessName: formData.businessName.trim(),
      businessType: formData.businessType.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      operatingHours: formData.operatingHours.trim(),
      categories: formData.categories.trim(),
      fabrics: formData.fabrics.trim(),
      moq: formData.moq.trim(),
    };

    // Required fields
    const requiredFields = [
      cleanedData.businessName,
      cleanedData.businessType,
      cleanedData.email,
      cleanedData.phone,
      cleanedData.address,
      cleanedData.operatingHours,
      cleanedData.categories,
      cleanedData.fabrics,
      cleanedData.moq,
    ];

    const hasEmptyField = requiredFields.some(
      (field) => field.length === 0
    );

    if (hasEmptyField) {
      setError("Please complete all required supplier onboarding fields.");
      return;
    }

    // Validate MOQ
    const moqNumber = Number(cleanedData.moq);

    if (!Number.isFinite(moqNumber) || moqNumber <= 0) {
      setError("Minimum order quantity must be a number greater than 0.");
      return;
    }

    // Validate phone
    const phoneDigits = cleanedData.phone.replace(/\D/g, "");

    if (phoneDigits.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanedData.email)) {
      setError("Please enter a valid business email address.");
      return;
    }

    const token = localStorage.getItem("texora-token");

    if (!token) {
      setError("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const categories = cleanedData.categories
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const fabrics = cleanedData.fabrics
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await fetch(
        `${API_URL}/users/supplier-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessName: cleanedData.businessName,
            businessType: cleanedData.businessType,

            // The backend uses contactPerson for the supplier contact.
            contactPerson: cleanedData.businessName,

            phone: cleanedData.phone,

            address: cleanedData.address,

            // Keep these available for the supplier profile.
            city: cleanedData.address,
            state: "",

            businessHours: cleanedData.operatingHours,

            productCategories: categories,

            fabricTypes: fabrics,

            minimumOrderQuantity: moqNumber,

            additionalInfo: `Business email: ${cleanedData.email}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to save supplier profile."
        );
      }

      // Update stored user data if backend returns it
      if (data.user) {
        localStorage.setItem(
          "texora-user",
          JSON.stringify(data.user)
        );
      }

      // Save onboarding state locally
      localStorage.setItem(
        "texora-supplier-onboarding-complete",
        "true"
      );

      setSuccess(
        "Supplier profile saved successfully! Redirecting..."
      );

      setTimeout(() => {
        navigate("/supplier/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Supplier onboarding error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving your supplier profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
            <Building2 size={30} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Supplier Onboarding
          </h1>

          <p className="mt-2 text-slate-600">
            Tell buyers about your business and textile products.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-medium">
                {success}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Business Information */}
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Business Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic information about your textile business.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Business Name */}
                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Business Name *
                  </label>

                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. ABC Textiles"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label
                    htmlFor="businessType"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Business Type *
                  </label>

                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">
                      Select business type
                    </option>

                    <option value="Manufacturer">
                      Manufacturer
                    </option>

                    <option value="Wholesaler">
                      Wholesaler
                    </option>

                    <option value="Distributor">
                      Distributor
                    </option>

                    <option value="Exporter">
                      Exporter
                    </option>

                    <option value="Trader">
                      Trader
                    </option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Business Email *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone Number *
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Location & Operations
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Business Location *
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-3 text-slate-400"
                    />

                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Guwahati, Assam, India"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Operating Hours */}
                <div>
                  <label
                    htmlFor="operatingHours"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Operating Hours *
                  </label>

                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="operatingHours"
                      name="operatingHours"
                      type="text"
                      value={formData.operatingHours}
                      onChange={handleChange}
                      placeholder="e.g. Mon-Sat, 9 AM - 6 PM"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Products */}
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Products & Supply
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Separate multiple values using commas.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Categories */}
                <div>
                  <label
                    htmlFor="categories"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Product Categories *
                  </label>

                  <input
                    id="categories"
                    name="categories"
                    type="text"
                    value={formData.categories}
                    onChange={handleChange}
                    placeholder="e.g. Apparel, Home Textile, Industrial"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Fabrics */}
                <div>
                  <label
                    htmlFor="fabrics"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Fabric Types *
                  </label>

                  <input
                    id="fabrics"
                    name="fabrics"
                    type="text"
                    value={formData.fabrics}
                    onChange={handleChange}
                    placeholder="e.g. Cotton, Linen, Denim"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* MOQ */}
                <div>
                  <label
                    htmlFor="moq"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Minimum Order Quantity *
                  </label>

                  <div className="relative">
                    <Package
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="moq"
                      name="moq"
                      type="number"
                      min="1"
                      value={formData.moq}
                      onChange={handleChange}
                      placeholder="e.g. 100"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Minimum number of units a buyer must order.
                  </p>
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="border-t border-slate-200 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Complete Supplier Onboarding
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Fields marked with * are required.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SupplierOnboarding;
