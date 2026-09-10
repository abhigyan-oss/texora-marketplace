import {
  Shirt,
  Armchair,
  Sparkles,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Apparel Fabrics",
    description: "Cotton, linen, denim and more",
    icon: Shirt,
    products: "1,240+ products",
    search: "cotton",
  },
  {
    name: "Home Textiles",
    description: "Curtains, bedding and upholstery",
    icon: Armchair,
    products: "860+ products",
    search: "linen",
  },
  {
    name: "Technical Textiles",
    description: "Industrial and performance fabrics",
    icon: Sparkles,
    products: "420+ products",
    search: "technical",
  },
  {
    name: "Bulk & Wholesale",
    description: "Source directly from suppliers",
    icon: Building2,
    products: "2,000+ products",
    search: "wholesale",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (search: string) => {
    navigate(`/marketplace?search=${encodeURIComponent(search)}`);
  };

  return (
    <section
      id="marketplace"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Explore fabrics
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Find fabrics for every need.
            </h2>

            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Browse thousands of fabrics from verified suppliers and discover
              materials that match your business requirements.
            </p>
          </div>

          {/* View All */}
          <button
            type="button"
            data-cursor="interactive"
            onClick={() => navigate("/marketplace")}
            className="group flex items-center gap-2 font-semibold text-indigo-600"
          >
            <span>
              View all categories
            </span>

            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-1"
            />
          </button>
        </div>

        {/* Category Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                type="button"
                data-cursor="interactive"
                onClick={() =>
                  handleCategoryClick(category.search)
                }
                className="group cursor-none rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-xl"
              >

                {/* Icon */}
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={24} />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-slate-900">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>

                {/* Bottom */}
                <div className="mt-6 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-500">
                    {category.products}
                  </span>

                  <ArrowUpRight
                    size={20}
                    className="text-slate-400 transition group-hover:text-indigo-600"
                  />

                </div>
              </button>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Categories;