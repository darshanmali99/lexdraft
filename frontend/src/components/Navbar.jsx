import { Bell, Search, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Map paths → readable titles
const PAGE_TITLES = {
  "/dashboard":     { title: "Dashboard",       subtitle: "Legal operations overview" },
  "/documents/new": { title: "Generate",         subtitle: "AI-powered document creation" },
  "/documents":     { title: "Documents",         subtitle: "Manage your legal agreements" },
  "/knowledge-base":{ title: "Knowledge Base",    subtitle: "AI retrieval & templates" },
  "/settings":      { title: "Settings",          subtitle: "Workspace & preferences" },
};

function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();

  const page = PAGE_TITLES[location.pathname] || {
    title: "LexDraft",
    subtitle: "Enterprise Legal AI",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // Derive initials from stored token/user (graceful fallback)
  const initials = "LD";

  return (
    <header
      className="glass"
      style={{
        height: "72px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 0,
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* ---- Left: Page Title ---- */}
      <div>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#f1f5f9",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          {page.title}
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#8b9ab3",
            marginTop: "2px",
          }}
        >
          {page.subtitle}
        </p>
      </div>

      {/* ---- Right ---- */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {/* Search */}
        <div
          className="hidden xl:flex"
          style={{ position: "relative" }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#4b5a72",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search documents..."
            style={{
              width: "280px",
              height: "38px",
              paddingLeft: "38px",
              paddingRight: "16px",
              fontSize: "13px",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Notifications */}
        <button
          className="icon-btn"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.03)",
            position: "relative",
          }}
        >
          <Bell size={15} style={{ color: "#8b9ab3" }} />
          {/* Dot */}
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "6px",
              height: "6px",
              borderRadius: "999px",
              background: "#4f8cff",
              boxShadow: "0 0 6px #4f8cff",
            }}
          />
        </button>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "28px",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        {/* User Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4f8cff 0%, #3b73e8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "0.05em",
              boxShadow: "0 2px 8px rgba(79,140,255,0.35)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div className="hidden md:block">
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#f1f5f9", letterSpacing: "-0.01em" }}>
              Admin
            </p>
            <p style={{ fontSize: "11px", color: "#8b9ab3", marginTop: "1px" }}>
              Enterprise
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "#f87171",
            transition: "background 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.06)";
          }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;