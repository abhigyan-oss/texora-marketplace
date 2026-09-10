import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Globe2,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Zap,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Discovery",
      description:
        "Describe what you need in natural language and let Texora help you discover suitable fabrics and suppliers faster.",
    },
    {
      icon: ShieldCheck,
      title: "Supplier-Focused Marketplace",
      description:
        "Connect with textile suppliers and explore products with clear specifications, pricing, stock and minimum order quantities.",
    },
    {
      icon: Package,
      title: "Built for Bulk Sourcing",
      description:
        "Designed around the needs of businesses that source fabrics and textile products at wholesale quantities.",
    },
    {
      icon: Zap,
      title: "Faster Decisions",
      description:
        "Compare materials, prices and product information in one place instead of searching across multiple platforms.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Discover",
      description:
        "Search the marketplace or tell Texora AI what type of fabric you are looking for.",
    },
    {
      number: "02",
      icon: Bot,
      title: "Compare",
      description:
        "Explore specifications, pricing, MOQ, availability and similar textile products.",
    },
    {
      number: "03",
      icon: Users,
      title: "Choose",
      description:
        "Find products and suppliers that match your business requirements.",
    },
    {
      number: "04",
      icon: Package,
      title: "Order",
      description:
        "Add products to your cart, provide shipping details and place your prototype order.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-100 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <Sparkles size={16} />
              The smarter way to source textiles
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Simplifying textile sourcing for{" "}
              <span className="text-violet-600">modern businesses.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Texora is a B2B textile marketplace designed to make fabric
              discovery, comparison and purchasing faster, smarter and more
              convenient for businesses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-600"
              >
                Explore Marketplace
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/onboarding/supplier"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-600"
              >
                Become a Supplier
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT IS TEXORA
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              About Texora
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              A marketplace built around the way textile businesses actually
              source.
            </h2>

            <p className="mt-6 leading-7 text-slate-600">
              Textile sourcing can involve searching through suppliers,
              comparing materials, checking minimum order quantities and
              understanding product specifications.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Texora brings these steps together into one digital marketplace,
              helping buyers discover suitable textile products while giving
              suppliers a dedicated platform to showcase and manage their
              inventory.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Search products by fabric, category or requirement",
                "Compare textile specifications and pricing",
                "Manage products and inventory as a supplier",
                "Place and manage B2B prototype orders",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-violet-600"
                  />

                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
              <div className="grid grid-cols-2 gap-4">
                {/* Suppliers */}
                <div className="rounded-2xl bg-violet-50 p-6">
                  <Store className="text-violet-600" size={28} />

                  <p className="mt-5 text-2xl font-bold text-slate-950">
                    Suppliers
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Showcase products, manage inventory and process orders.
                  </p>
                </div>

                {/* Buyers */}
                <div className="rounded-2xl bg-indigo-50 p-6">
                  <Users className="text-indigo-600" size={28} />

                  <p className="mt-5 text-2xl font-bold text-slate-950">
                    Buyers
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Discover fabrics and source products for their business.
                  </p>
                </div>

                {/* AI */}
                <div className="col-span-2 rounded-2xl bg-slate-950 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <Bot size={25} />

                    <span className="font-semibold">Texora AI</span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    Natural-language assistance for product discovery,
                    recommendations and textile comparisons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              Why Texora
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              Everything you need to source smarter
            </h2>

            <p className="mt-4 text-slate-600">
              A focused B2B experience connecting textile buyers and suppliers
              through technology.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              From requirement to order in a few simple steps.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Texora is designed to reduce the friction involved in finding
              textile products and turning sourcing requirements into orders.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                      <Icon size={20} />
                    </div>

                    <span className="text-sm font-bold text-slate-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          BUYER / SUPPLIER
      ===================================================== */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* BUYER */}
            <div className="rounded-3xl bg-white p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Globe2 size={24} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-950">
                Built for Buyers
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Find the right fabric faster with marketplace search,
                filtering, detailed product information and AI-assisted
                recommendations.
              </p>

              <Link
                to="/marketplace"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-violet-600 hover:text-violet-700"
              >
                Start sourcing
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* SUPPLIER */}
            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-white lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600">
                <Store size={24} />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                Built for Suppliers
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Create your supplier profile, manage textile products,
                monitor inventory and handle incoming orders through a
                dedicated supplier experience.
              </p>

              <Link
                to="/onboarding/supplier"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-violet-400 hover:text-violet-300"
              >
                Join Texora
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Sparkles size={27} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Ready to source smarter?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Explore textile products, discover suppliers and experience a
            smarter approach to B2B sourcing with Texora.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Explore Marketplace
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;