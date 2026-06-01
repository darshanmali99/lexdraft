import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import {
  Outlet,
} from "react-router-dom";

function DashboardLayout() {

  return (

    <div className="flex min-h-screen bg-[#020817] text-white overflow-hidden">

      {/* Sidebar */}

      <Sidebar />


      {/* Main Layout */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar */}

        <Navbar />


        {/* Page Content */}

        <main className="flex-1 overflow-y-auto">

          <div className="max-w-[1450px] mx-auto px-6 md:px-8 py-8 md:py-10">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;