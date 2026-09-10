import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  PackagePlus,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";

const SupplierLanding = () => {
  const benefits = [
    {
      icon: Users,
      title: "Reach More Buyers",
      description:
        "Connect with businesses looking for quality fabrics and reliable suppliers.",
    },
    {
      icon: PackagePlus,
      title: "Manage Products Easily",
      description:
        "Add products, update inventory and manage your textile catalog.",
    },
    {
      icon: ShoppingBag,
      title: "Receive Orders",
      description:
        "Receive incoming bulk orders and manage them from one dashboard.",
    },
    {
      icon: BarChart3,
      title: "Grow Your Business",
      description:
        "Track your products, orders and marketplace activity in one place.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create your account",
      description:
        "Register your supplier account and tell us about your business.",
    },
    {
      number: "02",
      title: "Set up your profile",
      description:
        "Add your business information, product categories and capabilities.",
    },
    {
      number: "03",
      title: "List your products",
      description:
        "Upload fabrics, specifications, pricing and inventory details.",
    },
    {
      number: "04",
      title: "Receive orders",
      description:
        "Connect with buyers and manage incoming orders from your dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-indigo-300">
              <TrendingUp size={16} />
              Built for textile suppliers
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Grow your textile business with Texora.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Showcase your fabrics, manage inventory, receive bulk orders and
              connect with businesses looking for reliable textile suppliers.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30"
              >
                Become a Supplier

                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-4 font-semibold text-white transition hover:bg-white/5"
              >
                Explore Marketplace
              </Link>
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

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Everything you need to manage your marketplace business.
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Texora gives textile suppliers the tools they need to showcase
            products and manage their growing business.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={23} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              How it works
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Start selling in four simple steps.
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number}>
                <span className="text-5xl font-bold text-indigo-100">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Supplier Dashboard
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Your business, all in one place.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Monitor products, manage inventory and stay updated with incoming
              customer orders through a clean and intuitive dashboard.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Manage your complete product catalog",
                "Track inventory availability",
                "Monitor incoming customer orders",
                "Update order status easily",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <CheckCircle2
                    size={20}
                    className="text-emerald-500"
                  />

                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="mt-10 inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Get started as a supplier
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Dashboard Mockup */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Supplier Overview
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  Your Marketplace Activity
                </h3>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Boxes size={22} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Products
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  24
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  12
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    Recent Order
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Premium Cotton Fabric
                  </p>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-3xl bg-indigo-600 px-8 py-16 text-center md:px-16">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Ready to grow your textile business?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
            Join Texora and connect with businesses looking for quality textile
            suppliers.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Become a Supplier
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SupplierLanding;