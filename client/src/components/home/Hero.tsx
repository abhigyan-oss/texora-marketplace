import { useState } from "react";
import { ArrowRight, Bot, Search, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) {
      navigate("/marketplace");
      return;
    }

    navigate(`/marketplace?search=${encodeURIComponent(query)}`);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const openAI = () => {
    window.dispatchEvent(new Event("open-texora-ai"));
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

        {/* Left Side */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            <Bot size={16} />
            AI-powered textile sourcing
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Source the right fabric
            <span className="text-indigo-600">
              {" "}
              smarter and faster.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover trusted textile suppliers, compare fabrics, manage bulk
            orders and get intelligent recommendations with Texora AI.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

            {/* Explore Marketplace */}
            <button
              type="button"
              onClick={() => navigate("/marketplace")}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-600"
            >
              Explore Marketplace
              <ArrowRight size={18} />
            </button>

            {/* Ask Texora AI */}
            <button
              type="button"
              onClick={openAI}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-semibold transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <Bot size={18} />
              Ask Texora AI
            </button>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Search
                className="flex-shrink-0 text-slate-400"
                size={20}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                placeholder="Try: breathable cotton for summer shirts..."
                className="w-full bg-transparent py-2 outline-none"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div
          className="relative"
          data-cursor="dark"
        >
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900 p-8 text-white">

              {/* Featured Header */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-100">
                    Featured collection
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Premium Cotton
                  </h2>
                </div>

                <ShoppingBag />
              </div>

              {/* Product Information */}
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <p className="text-sm text-indigo-100">
                  Starting from
                </p>

                <p className="mt-1 text-4xl font-bold">
                  ₹245
                  <span className="text-base font-medium text-indigo-100">
                    /meter
                  </span>
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3 text-sm">

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-indigo-100">
                      GSM
                    </p>

                    <p className="mt-1 font-semibold">
                      180
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-indigo-100">
                      MOQ
                    </p>

                    <p className="mt-1 font-semibold">
                      50m
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-indigo-100">
                      Stock
                    </p>

                    <p className="mt-1 font-semibold">
                      2.4k
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;