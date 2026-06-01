import { useEffect, useState } from "react";
import {
  FileText,
  Scale,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Plus,
} from "lucide-react";

import AnalyticsChart from "../components/AnalyticsChart";
import ActivityPanel from "../components/ActivityPanel";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getDashboardStats } from "../services/dashboardService";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalDocuments: 0,
    generatedDocuments: 0,
    clients: 0,
    successRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStatsData(data);
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton />;

  const stats = [
    {
      title: "Total Documents",
      value: statsData.totalDocuments,
      icon: FileText,
      iconClass: "stat-icon-blue",
      trend: "+12%",
      trendLabel: "this month",
    },
    {
      title: "AI Generated",
      value: statsData.generatedDocuments,
      icon: Scale,
      iconClass: "stat-icon-green",
      trend: "+8%",
      trendLabel: "this week",
    },
    {
      title: "Clients",
      value: statsData.clients,
      icon: Users,
      iconClass: "stat-icon-amber",
      trend: "+3",
      trendLabel: "new this month",
    },
    {
      title: "Success Rate",
      value: `${statsData.successRate}%`,
      icon: CheckCircle2,
      iconClass: "stat-icon-green",
      trend: "↑ 2%",
      trendLabel: "vs last month",
    },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* ---- Action Bar ---- */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
            }}
          >
            Good afternoon 👋
          </h1>
          <p style={{ fontSize: "13px", color: "#8b9ab3", marginTop: "4px" }}>
            Here&apos;s what&apos;s happening with your legal workspace.
          </p>
        </div>

        <button
          onClick={() => navigate("/documents/new")}
          className="btn-primary"
          style={{ padding: "0 20px", height: "42px", fontSize: "13.5px" }}
        >
          <Plus size={15} />
          New Document
        </button>
      </div>

      {/* ---- Stats Grid ---- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "16px",
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="card"
              style={{ padding: "22px 24px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#8b9ab3", fontWeight: "500", letterSpacing: "0.01em" }}>
                    {stat.title}
                  </p>
                  <h2
                    style={{
                      fontSize: "32px",
                      fontWeight: "800",
                      color: "#f1f5f9",
                      letterSpacing: "-0.04em",
                      marginTop: "10px",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "10px" }}>
                    <TrendingUp size={12} style={{ color: "#22c55e" }} />
                    <span style={{ fontSize: "11.5px", color: "#22c55e", fontWeight: "600" }}>
                      {stat.trend}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "#4b5a72" }}>{stat.trendLabel}</span>
                  </div>
                </div>
                <div className={`stat-icon ${stat.iconClass}`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Analytics + Activity ---- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "16px",
        }}
        className="xl-grid"
      >
        {/* Analytics */}
        <div className="card" style={{ padding: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                Document Activity
              </h3>
              <p style={{ fontSize: "12.5px", color: "#8b9ab3", marginTop: "4px" }}>
                AI-generated documents over the past 7 days
              </p>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "#4f8cff",
                background: "rgba(79,140,255,0.08)",
                border: "1px solid rgba(79,140,255,0.20)",
                borderRadius: "8px",
                padding: "6px 12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              This Week
              <ArrowUpRight size={12} />
            </button>
          </div>
          <AnalyticsChart />
        </div>

        {/* Activity */}
        <ActivityPanel />
      </div>
    </div>
  );
}

export default DashboardPage;