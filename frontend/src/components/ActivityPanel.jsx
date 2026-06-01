import { FileText, Clock, CheckCircle2, RefreshCcw } from "lucide-react";

const activities = [
  {
    title: "NDA Agreement generated",
    time: "2 minutes ago",
    type: "generated",
    icon: FileText,
  },
  {
    title: "Employment contract exported",
    time: "18 minutes ago",
    type: "exported",
    icon: CheckCircle2,
  },
  {
    title: "Legal template uploaded",
    time: "45 minutes ago",
    type: "uploaded",
    icon: RefreshCcw,
  },
  {
    title: "Service agreement reviewed",
    time: "1 hour ago",
    type: "reviewed",
    icon: Clock,
  },
];

const TYPE_COLORS = {
  generated: { bg: "rgba(79,140,255,0.12)",  color: "#4f8cff" },
  exported:  { bg: "rgba(34,197,94,0.10)",   color: "#22c55e" },
  uploaded:  { bg: "rgba(245,158,11,0.10)",  color: "#f59e0b" },
  reviewed:  { bg: "rgba(255,255,255,0.06)", color: "#8b9ab3" },
};

function ActivityPanel() {
  return (
    <div className="card" style={{ padding: "28px" }}>
      {/* Header */}
      <div style={{ marginBottom: "22px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
          Recent Activity
        </h3>
        <p style={{ fontSize: "12.5px", color: "#8b9ab3", marginTop: "4px" }}>
          Latest legal operations
        </p>
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const colors = TYPE_COLORS[activity.type];
          const isLast = index === activities.length - 1;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "14px",
                paddingBottom: isLast ? "0" : "18px",
                position: "relative",
              }}
            >
              {/* Timeline line */}
              {!isLast && (
                <div
                  style={{
                    position: "absolute",
                    left: "17px",
                    top: "34px",
                    bottom: "0",
                    width: "1px",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
              )}

              {/* Icon */}
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: colors.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={14} style={{ color: colors.color }} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: "6px" }}>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#e2e8f0", lineHeight: 1.4 }}>
                  {activity.title}
                </p>
                <p style={{ fontSize: "11px", color: "#4b5a72", marginTop: "3px" }}>
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All */}
      <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          style={{
            fontSize: "12.5px",
            fontWeight: "600",
            color: "#4f8cff",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          View all activity →
        </button>
      </div>
    </div>
  );
}

export default ActivityPanel;