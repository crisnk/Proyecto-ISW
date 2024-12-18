import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import { AuthProvider } from "@context/AuthContext";
import "@styles/Sidebar.css";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <button
        className={`sidebar-toggle-btn ${isSidebarVisible ? "active" : ""}`}
        onClick={toggleSidebar}
      >
        <span className="hamburger-icon"></span>
      </button>
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${isSidebarVisible ? "with-sidebar" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Root;
