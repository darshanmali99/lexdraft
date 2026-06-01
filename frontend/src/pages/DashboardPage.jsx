import {
  useEffect,
  useState,
} from "react";

import {
  FileText,
  Scale,
  Users,
  CheckCircle2,
} from "lucide-react";

import AnalyticsChart from "../components/AnalyticsChart";

import ActivityPanel from "../components/ActivityPanel";

import LoadingSkeleton from "../components/LoadingSkeleton";

import {
  getDashboardStats,
} from "../services/dashboardService";

import {
  useNavigate,
} from "react-router-dom";


function DashboardPage() {

  // ======================================
  // NAVIGATION
  // ======================================

  const navigate =
    useNavigate();


  // ======================================
  // STATE
  // ======================================

  const [loading, setLoading] =
    useState(true);

  const [statsData, setStatsData] =
    useState({
      totalDocuments: 0,
      generatedDocuments: 0,
      clients: 0,
      successRate: 0,
    });


  // ======================================
  // FETCH DASHBOARD DATA
  // ======================================

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const data =
          await getDashboardStats();

        setStatsData(data);

      } catch (error) {

        console.error(
          "Dashboard stats error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

    fetchStats();

  }, []);


  // ======================================
  // LOADING
  // ======================================

  if (loading) {

    return <LoadingSkeleton />;
  }


  // ======================================
  // STATS
  // ======================================

  const stats = [

    {
      title: "Documents",
      value: statsData.totalDocuments,
      icon: FileText,
    },

    {
      title: "Generated",
      value: statsData.generatedDocuments,
      icon: Scale,
    },

    {
      title: "Clients",
      value: statsData.clients,
      icon: Users,
    },

    {
      title: "Success Rate",
      value: `${statsData.successRate}%`,
      icon: CheckCircle2,
    },

  ];


  // ======================================
  // COMPONENT
  // ======================================

  return (

    <div className="space-y-8 fade-in">

      {/* ======================================
          ACTION BAR
      ====================================== */}

      <div className="flex justify-end">

        <button
          onClick={() => {
            navigate("/documents/new");
          }}
          className="btn-primary px-5 h-11 text-sm"
        >

          Generate Document

        </button>

      </div>


      {/* ======================================
          STATS GRID
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (

            <div
              key={stat.title}
              className="card p-6"
            >

              <div className="flex items-start justify-between">

                {/* Content */}

                <div>

                  <p className="text-sm text-slate-500">

                    {stat.title}

                  </p>

                  <h2 className="text-3xl font-semibold mt-4">

                    {stat.value}

                  </h2>

                </div>


                {/* Icon */}

                <div className="w-11 h-11 rounded-xl bg-white/[0.04] flex items-center justify-center">

                  <Icon
                    size={18}
                    className="text-slate-300"
                  />

                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* ======================================
          ANALYTICS SECTION
      ====================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Analytics */}

        <div className="xl:col-span-2 card p-7">

          <div className="mb-8">

            <h3 className="text-lg font-semibold">

              Document Analytics

            </h3>

            <p className="text-sm text-slate-500 mt-1">

              AI-generated document activity over time

            </p>

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