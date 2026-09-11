import { useEffect, useState } from "react";
import {
  Building2,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
  Pencil,
  Save,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { API_URL } from "../config/api";


interface SupplierProfile {
  businessName: string;
  businessType: string;
  contactPerson: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  businessHours: string;
  productCategories: string[];
  fabricTypes: string[];
  minimumOrderQuantity: number;
  additionalInfo: string;
}

const SupplierProfile = () => {
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [formData, setFormData] = useState<SupplierProfile>({
    businessName: "",
    businessType: "",
    contactPerson: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    businessHours: "",
    productCategories: [],
    fabricTypes: [],
    minimumOrderQuantity: 1,
    additionalInfo: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("texora-token");

      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      if (!data.user) {
        throw new Error("Supplier profile not found");
      }

      const supplierProfile = data.user.supplierProfile;

      if (!supplierProfile) {
        throw new Error(
          "Supplier profile has not been completed yet."
        );
      }

      setProfile(supplierProfile);
      setFormData({
        businessName: supplierProfile.businessName || "",
        businessType: supplierProfile.businessType || "",
        contactPerson: supplierProfile.contactPerson || "",
        phone: supplierProfile.phone || "",
        address: supplierProfile.address || "",
        city: supplierProfile.city || "",
        state: supplierProfile.state || "",
        businessHours: supplierProfile.businessHours || "",
        productCategories:
          supplierProfile.productCategories || [],
        fabricTypes: supplierProfile.fabricTypes || [],
        minimumOrderQuantity:
          supplierProfile.minimumOrderQuantity || 1,
        additionalInfo:
          supplierProfile.additionalInfo || "",
      });
    } catch (error) {
      console.error("Failed to fetch supplier profile:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (
    field: keyof SupplierProfile,
    value: string | number
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "productCategories" | "fabricTypes",
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("texora-token");

      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/users/supplier-profile`,
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
          data.message || "Failed to update supplier profile"
        );
      }

      const updatedProfile = data.user?.supplierProfile || formData;

      setProfile(updatedProfile);
      setFormData(updatedProfile);

      const savedUser = localStorage.getItem("texora-user");

      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);

          localStorage.setItem(
            "texora-user",
            JSON.stringify({
              ...user,
              onboardingCompleted: true,
              supplierProfile: updatedProfile,
            })
          );
        } catch {
          // Ignore malformed localStorage data
        }
      }

      setEditing(false);
      setSuccess("Supplier profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2
            size={42}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-4 font-medium text-slate-600">
            Loading supplier profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <AlertTriangle
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load profile
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchProfile}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Supplier Profile
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Business Profile
            </h1>

            <p className="mt-3 text-slate-600">
              Manage your supplier information visible on Texora.
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setEditing(true);
                setError("");
                setSuccess("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Success */}
        {success && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        {/* Error */}
        {error && profile && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Profile */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          {/* Business */}
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Building2 size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Business Information
                </h2>

                <p className="text-sm text-slate-500">
                  Basic information about your business
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <ProfileField
                label="Business Name"
                value={formData.businessName}
                editing={editing}
                onChange={(value) =>
                  handleChange("businessName", value)
                }
              />

              <ProfileField
                label="Business Type"
                value={formData.businessType}
                editing={editing}
                onChange={(value) =>
                  handleChange("businessType", value)
                }
              />

              <ProfileField
                label="Contact Person"
                value={formData.contactPerson}
                editing={editing}
                onChange={(value) =>
                  handleChange("contactPerson", value)
                }
              />

              <ProfileField
                label="Minimum Order Quantity"
                value={String(formData.minimumOrderQuantity)}
                editing={editing}
                type="number"
                onChange={(value) =>
                  handleChange(
                    "minimumOrderQuantity",
                    Number(value)
                  )
                }
              />
            </div>
          </div>

          <div className="my-8 border-t border-slate-100" />

          {/* Contact */}
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Phone size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Contact & Location
                </h2>

                <p className="text-sm text-slate-500">
                  How buyers can reach your business
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <ProfileField
                label="Phone"
                value={formData.phone}
                editing={editing}
                onChange={(value) =>
                  handleChange("phone", value)
                }
              />

              <ProfileField
                label="Email / Business Email"
                value={
                  formData.additionalInfo.replace(
                    "Business email: ",
                    ""
                  )
                }
                editing={false}
                icon={<Mail size={16} />}
              />

              <ProfileField
                label="Address"
                value={formData.address}
                editing={editing}
                onChange={(value) =>
                  handleChange("address", value)
                }
                icon={<MapPin size={16} />}
              />

              <ProfileField
                label="City"
                value={formData.city}
                editing={editing}
                onChange={(value) =>
                  handleChange("city", value)
                }
              />

              <ProfileField
                label="State"
                value={formData.state}
                editing={editing}
                onChange={(value) =>
                  handleChange("state", value)
                }
              />

              <ProfileField
                label="Business Hours"
                value={formData.businessHours}
                editing={editing}
                onChange={(value) =>
                  handleChange("businessHours", value)
                }
                icon={<Clock3 size={16} />}
              />
            </div>
          </div>

          <div className="my-8 border-t border-slate-100" />

          {/* Marketplace */}
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Package size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Marketplace Information
                </h2>

                <p className="text-sm text-slate-500">
                  Products and materials you supply
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">

              <ProfileField
                label="Product Categories"
                value={formData.productCategories.join(", ")}
                editing={editing}
                onChange={(value) =>
                  handleArrayChange(
                    "productCategories",
                    value
                  )
                }
              />

              <ProfileField
                label="Fabric Types"
                value={formData.fabricTypes.join(", ")}
                editing={editing}
                onChange={(value) =>
                  handleArrayChange(
                    "fabricTypes",
                    value
                  )
                }
              />

              <ProfileField
                label="Additional Information"
                value={formData.additionalInfo}
                editing={editing}
                onChange={(value) =>
                  handleChange("additionalInfo", value)
                }
              />
            </div>
          </div>

          {/* Buttons */}
          {editing && (
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <button
                onClick={() => {
                  setEditing(false);

                  if (profile) {
                    setFormData(profile);
                  }

                  setError("");
                  setSuccess("");
                }}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

interface ProfileFieldProps {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
}

const ProfileField = ({
  label,
  value,
  editing,
  onChange,
  type = "text",
  icon,
}: ProfileFieldProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {editing ? (
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}

          <input
            type={type}
            value={value}
            onChange={(event) =>
              onChange?.(event.target.value)
            }
            className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
              icon ? "pl-10" : ""
            }`}
          />
        </div>
      ) : (
        <div className="flex min-h-[46px] items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {icon && (
            <span className="text-slate-400">
              {icon}
            </span>
          )}

          <span>
            {value || "Not provided"}
          </span>
        </div>
      )}
    </div>
  );
};

export default SupplierProfile;
