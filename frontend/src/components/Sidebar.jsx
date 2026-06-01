import {
  LayoutDashboard,
  FileText,
  Settings,
  PlusSquare,
  Database,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Generate",
    icon: PlusSquare,
    path: "/documents/new",
  },
  {
    name: "Documents",
    icon: FileText,
    path: "/documents",
  },
  {
    name: "Knowledge Base",
    icon: Database,
    path: "/knowledge-base",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {

  return (

    <aside className="hidden lg:flex flex-col justify-between w-[250px] min-h-screen border-r border-white/5 bg-[#0f131b] px-5 py-7">

      {/* Top Section */}

      <div>

        {/* Logo */}

        <div className="mb-12">

          <h1 className="text-[26px] font-semibold tracking-tight">
            LexDraft
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Enterprise Legal AI
          </p>

        </div>

        {/* Navigation */}

        <nav className="space-y-1.5">

          {navItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/[0.04] border border-white/5 text-white"
                      : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                  }`
                }
              >

                <Icon
                  size={18}
                  className="transition"
                />

                <span>
                  {item.name}
                </span>

              </NavLink>
            );
          })}

        </nav>

      </div>

      {/* Bottom Card */}

      <div className="card p-5">

        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">

          Workspace

        </p>

        <h3 className="mt-3 text-base font-semibold">
          Premium Plan
        </h3>

        <p className="text-sm text-slate-500 mt-2 leading-relaxed">

          AI-powered legal document workflows for enterprise operations.

        </p>

      </div>

    </aside>
  );
}

export default Sidebar;