import {

  BrowserRouter,

  Routes,

  Route,

  Navigate

} from "react-router-dom";

import DashboardLayout
from "../layouts/DashboardLayout";

import AuthLayout
from "../layouts/AuthLayout";

import LoginPage
from "../pages/LoginPage";

import DashboardPage
from "../pages/DashboardPage";

import GeneratePage
from "../pages/GeneratePage";

import DocumentsPage
from "../pages/DocumentsPage";

import SettingsPage
from "../pages/SettingsPage";


function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route element={<AuthLayout />}>

          <Route
            path="/login"
            element={<LoginPage />}
          />

        </Route>

        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/generate"
            element={<GeneratePage />}
          />

          <Route
            path="/documents"
            element={<DocumentsPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />

        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;