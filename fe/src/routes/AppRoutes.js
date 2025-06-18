import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import DocumentList from "../pages/DocumentList";
import DocumentDetail from "../pages/DocumentDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import RoleManagementPage from "../pages/RoleManagement";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import RequireAuth from "../middleware/RequireAuth";

// Layout có Header + Sidebar
const MainLayout = ({ children }) => (
  <div>
    <Header />
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ padding: 20, flex: 1 }}>{children}</main>
    </div>
  </div>
);


// Layout chỉ có content (dành cho login/register)
const AuthLayout = ({ children }) => <div>{children}</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Trang Login không dùng layout có header/sidebar */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      {/* Các trang còn lại sử dụng MainLayout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </RequireAuth>

        }
      />
      <Route
        path="/document"
        element={
          <RequireAuth>
            <MainLayout>
              <DocumentList />
            </MainLayout>
          </RequireAuth>

        }
      />
      <Route
        path="/document/:id"
        element={
          <RequireAuth>
            <MainLayout>
              <DocumentDetail />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/role-management"
        element={
          <RequireAuth>
            <MainLayout>
              <RoleManagementPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="*"
        element={
          <RequireAuth>
            <MainLayout>
              <NotFound />
            </MainLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
