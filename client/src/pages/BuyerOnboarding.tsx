import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../config/api";


interface FormData {
  businessType: string;
  industry: string;
  fabricTypes: string[];
  orderQuantity: string;
  budgetRange: string;
}

const fabricOptions = [
  "Cotton",
  "Linen",
  "Denim",
  "Silk",
  "Wool",
  "Polyester",
  "Rayon",
  "Sustainable Fabrics",
];

const BuyerOnboarding = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    businessType: "",
    industry: "",
    fabricTypes: [],
    orderQuantity: "",
    budgetRange: "",
  });

  const updateField = (
    field: keyof FormData,
    value: string | string[]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const toggleFabric = (fabric: string) => {
    setFormData((previous) => {
      const exists = previous.fabricTypes.includes(fabric);

      return {
        ...previous,
        fabricTypes: exists
          ? previous.fabricTypes.filter(
              (item) => item !== fabric
            )
          : [...previous.fabricTypes, fabric],
      };
    });

    setError("");
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.businessType) {
        setError("Please select your business type.");
        return false;
      }

      if (!formData.industry.trim()) {
        setError("Please enter your industry.");
        return false;
      }
    }

    if (step === 2) {
      if (formData.fabricTypes.length === 0) {
        setError("Please select at least one fabric type.");
        return false;
      }
    }

    if (step === 3) {
      if (!formData.orderQuantity) {
        setError("Please select your typical order quantity.");
        return false;
      }

      if (!formData.budgetRange) {
        setError("Please select your budget range.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    setError("");

    if (step < 3) {
      setStep((previous) => previous + 1);
    }
  };

  const handleBack = () => {
    setError("");

    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  // STEP 5:
  // Save buyer onboarding preferences to MongoDB
  const savePreferences = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("texora-token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/users/buyer-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save onboarding preferences."
        );
      }

      // Update locally stored user information
      const existingUser =
        localStorage.getItem("texora-user");

      if (existingUser) {
        const user = JSON.parse(existingUser);

        const updatedUser = {
          ...user,
          onboardingCompleted:
            data.user.onboardingCompleted,
          buyerProfile: data.user.buyerProfile,
        };

        localStorage.setItem(
          "texora-user",
          JSON.stringify(updatedUser)
        );
      }

      // Keep local copy as well
      localStorage.setItem(
        "texora-buyer-preferences",
        JSON.stringify(formData)
      );

      localStorage.setItem(
        "buyerPreferences",
        JSON.stringify(formData)
      );

      // Go to buyer dashboard
      navigate("/buyer/dashboard");
    } catch (error) {
      console.error(
        "Failed to save buyer onboarding:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save your preferences."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white mb-4">
            <Sparkles size={26} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Welcome to Texora
          </h1>

          <p className="text-slate-500 mt-2">
            Tell us about your business so we can personalize
            your marketplace experience.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className="flex items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= number
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {step > number ? (
                  <Check size={18} />
                ) : (
                  number
                )}
              </div>

              {number < 3 && (
                <div
                  className={`w-16 md:w-24 h-1 mx-2 rounded ${
                    step > number
                      ? "bg-slate-900"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Building2
                    size={24}
                    className="text-slate-900"
                  />

                  <h2 className="text-2xl font-bold text-slate-900">
                    Tell us about your business
                  </h2>
                </div>

                <p className="text-slate-500">
                  This helps us understand what kind of buyer
                  you are.
                </p>
              </div>

              {/* Business Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Business Type
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Manufacturer",
                    "Retailer",
                    "Wholesaler",
                    "Fashion Brand",
                    "Designer",
                    "Other",
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        updateField(
                          "businessType",
                          type
                        )
                      }
                      className={`p-4 rounded-xl border text-left transition ${
                        formData.businessType === type
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <span className="font-medium">
                        {type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Industry
                </label>

                <input
                  type="text"
                  value={formData.industry}
                  onChange={(event) =>
                    updateField(
                      "industry",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Apparel, Home Furnishing, Sportswear"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-slate-900"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <BriefcaseBusiness
                    size={24}
                    className="text-slate-900"
                  />

                  <h2 className="text-2xl font-bold text-slate-900">
                    What fabrics are you looking for?
                  </h2>
                </div>

                <p className="text-slate-500">
                  Select all fabric types that interest your
                  business.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {fabricOptions.map((fabric) => {
                  const selected =
                    formData.fabricTypes.includes(
                      fabric
                    );

                  return (
                    <button
                      key={fabric}
                      type="button"
                      onClick={() =>
                        toggleFabric(fabric)
                      }
                      className={`relative p-4 rounded-xl border text-left transition ${
                        selected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {selected && (
                        <Check
                          size={16}
                          className="absolute top-3 right-3"
                        />
                      )}

                      <span className="font-medium">
                        {fabric}
                      </span>
                    </button>
                  );
                })}
              </div>

              {formData.fabricTypes.length > 0 && (
                <p className="text-sm text-slate-500 mt-5">
                  {formData.fabricTypes.length} fabric
                  {formData.fabricTypes.length > 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Package
                    size={24}
                    className="text-slate-900"
                  />

                  <h2 className="text-2xl font-bold text-slate-900">
                    Tell us about your buying needs
                  </h2>
                </div>

                <p className="text-slate-500">
                  We'll use this information to recommend
                  relevant products.
                </p>
              </div>

              {/* Order Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Typical Order Quantity
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "1 - 50 meters",
                    "51 - 200 meters",
                    "201 - 500 meters",
                    "500+ meters",
                  ].map((quantity) => (
                    <button
                      key={quantity}
                      type="button"
                      onClick={() =>
                        updateField(
                          "orderQuantity",
                          quantity
                        )
                      }
                      className={`p-4 rounded-xl border text-left transition ${
                        formData.orderQuantity ===
                        quantity
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {quantity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <IndianRupee size={17} />
                  Preferred Budget
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Under ₹250/meter",
                    "₹250 - ₹400/meter",
                    "₹400 - ₹600/meter",
                    "₹600+/meter",
                  ].map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() =>
                        updateField(
                          "budgetRange",
                          budget
                        )
                      }
                      className={`p-4 rounded-xl border text-left transition ${
                        formData.budgetRange === budget
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Your Preferences
                </h3>

                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <strong>Business:</strong>{" "}
                    {formData.businessType}
                  </p>

                  <p>
                    <strong>Industry:</strong>{" "}
                    {formData.industry}
                  </p>

                  <p>
                    <strong>Fabrics:</strong>{" "}
                    {formData.fabricTypes.join(", ")}
                  </p>

                  <p>
                    <strong>Order Quantity:</strong>{" "}
                    {formData.orderQuantity}
                  </p>

                  <p>
                    <strong>Budget:</strong>{" "}
                    {formData.budgetRange}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium ${
                step === 1 || loading
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={savePreferences}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold transition ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-slate-800"
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          You can update your preferences later from your
          profile.
        </p>
      </div>
    </div>
  );
};

export default BuyerOnboarding;
