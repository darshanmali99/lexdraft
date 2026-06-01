import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import DashboardLayout from "./layouts/DashboardLayout";

import DashboardPage from "./pages/DashboardPage";

import GeneratePage from "./pages/GeneratePage";

import DocumentsPage from "./pages/DocumentsPage";

import SettingsPage from "./pages/SettingsPage";

import KnowledgeBasePage from "./pages/KnowledgeBasePage";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  const token =
    localStorage.getItem("token");


  return (

    <BrowserRouter>

      <Routes>

        {/* ======================================
            ROOT REDIRECT
        ====================================== */}

        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* ======================================
            PUBLIC ROUTE
        ====================================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* ======================================
            DASHBOARD LAYOUT
        ====================================== */}

        <Route
          element={<DashboardLayout />}
        >

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />


          {/* Generate */}

          <Route
            path="/documents/new"
            element={
              <ProtectedRoute>
                <GeneratePage />
              </ProtectedRoute>
            }
          />


          {/* Documents */}

          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />


          {/* Knowledge Base */}

          <Route
            path="/knowledge-base"
            element={
              <ProtectedRoute>
                <KnowledgeBasePage />
              </ProtectedRoute>
            }
          />


          {/* Settings */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

        </Route>


        {/* ======================================
            FALLBACK
        ====================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;