import {
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  AuthContext
} from "../context/AuthContext";


function TopBar({

  title = "Dashboard"

}) {

  // ======================================
  // CONTEXT
  // ======================================

  const {
    user,
    logout
  } = useContext(AuthContext);

  const navigate =
    useNavigate();


  // ======================================
  // HANDLE LOGOUT
  // ======================================

  const handleLogout = () => {

    logout();

    navigate(
      "/login",
      { replace: true }
    );
  };


  // ======================================
  // COMPONENT
  // ======================================

  return (

    <header className="h-16 border-b border-white/5 bg-[#0F172A] px-6 flex items-center justify-between">

      {/* Left */}

      <div className="flex items-center gap-6">

        <h1 className="text-lg font-semibold text-white">

          LexDraft

        </h1>

        <div className="w-px h-6 bg-white/10" />

        <p className="text-sm text-slate-400">

          {title}

        </p>

      </div>


      {/* Right */}

      <div className="flex items-center gap-4">

        {/* User Email */}

        <div className="hidden md:flex flex-col items-end">

          <span className="text-xs text-slate-500">
            Admin
          </span>

          <span className="text-sm text-slate-300">

            {user?.email || "Unknown"}

          </span>

        </div>


        {/* Logout */}

        <button
          onClick={handleLogout}
          className="h-10 px-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm"
        >

          Logout

        </button>

      </div>

    </header>
  );
}

export default TopBar;