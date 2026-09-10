import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe2,
  Package,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

const Suppliers = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">

        {/* Background Effects */}
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
              <Store size={16} />
              Grow your textile business with Texora
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-white md:text-6xl">
              Sell smarter.
              <br />
              Reach more buyers.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Join India's growing B2B textile marketplace. Showcase your
              products, connect with verified buyers, and manage your business
              from one powerful platform.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                to="/register"
                className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700"
              >
                Become a Supplier

                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/marketplace"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Marketplace
              </Link>

            </div>

          </div>

          {/* Stats */}
          <div className="mt-20 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">

            <div>
              <p className="text-3xl font-bold text-white">
                500+
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Suppliers
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold text-white">
                2K+
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Products
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold text-white">
                20+
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Cities
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold text-white">
                ₹10Cr+
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Trade Volume
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="max-w-2xl">

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Why Texora
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Everything you need to grow your textile business.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-500">
            Texora helps textile suppliers reach more buyers and manage their
            business operations efficiently.
          </p>

        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Users size={24} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Reach Verified Buyers
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Connect directly with businesses and buyers actively sourcing
              fabrics and textile products.
            </p>

          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Package size={24} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Manage Products Easily
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Add products, manage inventory and keep your catalog updated
              from one centralized dashboard.
            </p>

          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Grow Your Business
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Get access to new markets and opportunities to scale your textile
              business.
            </p>

          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <BarChart3 size={24} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Business Insights
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Track orders, product performance and marketplace activity with
              powerful business insights.
            </p>

          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <ShieldCheck size={24} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Trusted Marketplace
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Build trust with verified marketplace profiles and secure
              business interactions.
            </p>

          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <Globe2 size={24} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Expand Your Reach
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Showcase your textile products to buyers across multiple cities
              and growing markets.
            </p>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Simple process
            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-900">
              Start selling in three simple steps.
            </h2>

          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                1
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Create Account
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Register as a supplier and create your business profile.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                2
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                List Your Products
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Upload fabrics, product details and inventory information.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                3
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Receive Orders
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Connect with buyers and manage your orders from your dashboard.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="rounded-3xl bg-indigo-600 px-8 py-16 text-center md:px-16">

          <CheckCircle2
            size={40}
            className="mx-auto text-indigo-200"
          />

          <h2 className="mt-6 text-4xl font-bold text-white">
            Ready to grow your textile business?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
            Join Texora and start connecting with businesses looking for
            quality textile suppliers.
          </p>

          <Link
            to="/register"
            className="mx-auto mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-indigo-600 transition hover:bg-slate-100"
          >
            Become a Supplier
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Suppliers;