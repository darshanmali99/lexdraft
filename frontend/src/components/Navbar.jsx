import {
  Bell,
  Search,
} from "lucide-react";

function Navbar() {

  return (

    <header className="h-[88px] border-b border-white/5 bg-[#0a0d14]/90 backdrop-blur-xl px-8 flex items-center justify-between">

      {/* Left */}

      <div>

        <h2 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Legal operations overview
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        {/* Search */}

        <div className="relative hidden xl:block">

          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-[320px] h-11 pl-11 pr-4 text-sm"
          />

        </div>

        {/* Notification */}

        <button className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]">

          <Bell
            size={18}
            className="text-slate-400"
          />

        </button>

        {/* User */}

        <div className="flex items-center gap-3 pl-2">

          <div className="w-10 h-10 rounded-full bg-[#1b2230] flex items-center justify-center text-sm font-medium">

            D

          </div>

          <div className="hidden md:block">

            <p className="text-sm font-medium">
              Darshan
            </p>

            <p className="text-xs text-slate-500 mt-0.5">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;