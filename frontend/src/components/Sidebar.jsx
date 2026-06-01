import {
  LayoutDashboard,
  FileText,
  Settings,
  Sparkles,
  Database,
  Scale,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Generate",
    icon: Sparkles,
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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "rgba(8, 11, 18, 0.97)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "28px 16px",
        flexShrink: 0,
      }}
      className="hidden lg:flex"
    >
      {/* ---- LOGO ---- */}
      <div
        style={{ marginBottom: "36px", padding: "0 8px" }}
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4f8cff 0%, #3b73e8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(79,140,255,0.40)",
              flexShrink: 0,
            }}
          >
            <Scale size={17} color="#fff" />
          </div>
          <div>
            <h1
              style={{
                fontSize: "17px",
                fontWeight: "700",
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
              }}
            >
              LexDraft
            </h1>
            <p
              style={{
                fontSize: "10px",
                color: "rgba(139,154,179,0.8)",
                letterSpacing: "0.05em",
                marginTop: "1px",
              }}
            >
              Enterprise Legal AI
            </p>
          </div>
        </div>
      </div>

      {/* ---- SECTION LABEL ---- */}
      <p
        className="section-label"
        style={{ paddingLeft: "12px", marginBottom: "8px" }}
      >
        Navigation
      </p>

      {/* ---- NAV LINKS ---- */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "11px",
                padding: "10px 12px",
                borderRadius: "12px",
                fontSize: "13.5px",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "#f1f5f9" : "#8b9ab3",
                background: isActive
                  ? "rgba(79, 140, 255, 0.12)"
                  : "transparent",
                border: "1px solid",
                borderColor: isActive
                  ? "rgba(79, 140, 255, 0.25)"
                  : "transparent",
                boxShadow: isActive
                  ? "0 0 20px rgba(79,140,255,0.08)"
                  : "none",
                transition: "all 0.18s ease",
                textDecoration: "none",
                letterSpacing: "-0.01em",
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (!el.dataset.active) {
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.color = "#e2e8f0";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (!el.dataset.active) {
                  el.style.background = el.classList.contains("active")
                    ? "rgba(79, 140, 255, 0.12)"
                    : "transparent";
                  el.style.color = el.classList.contains("active")
                    ? "#f1f5f9"
                    : "#8b9ab3";
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    style={{
                      color: isActive ? "#4f8cff" : "inherit",
                      flexShrink: 0,
                    }}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <div
                      style={{
                        marginLeft: "auto",
                        width: "5px",
                        height: "5px",
                        borderRadius: "999px",
                        background: "#4f8cff",
                        boxShadow: "0 0 6px #4f8cff",
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ---- BOTTOM SECTION ---- */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Workspace Card */}
        <div
          style={{
            background: "rgba(79,140,255,0.06)",
            border: "1px solid rgba(79,140,255,0.15)",
            borderRadius: "16px",
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#4f8cff",
              marginBottom: "6px",
            }}
          >
            Workspace
          </p>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#f1f5f9",
            }}
          >
            Premium Plan
          </h3>
          <p
            style={{
              fontSize: "11px",
              color: "#8b9ab3",
              marginTop: "4px",
              lineHeight: "1.5",
            }}
          >
            AI-powered enterprise legal workflows.
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "12px",
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "#f87171",
            fontSize: "13px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            cursor: "pointer",
            transition: "background 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.06)";
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;