import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import { AuthProvider } from "@context/AuthContext";
import "@styles/sidebar.css";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(true);

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      setTimeout(() => setShowToggleButton(true), 150);
    } else {
      setShowToggleButton(false);
    }
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="app-layout">
      <Navbar />
      {showToggleButton && (
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          Funcionalidades
        </button>
      )}
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${isSidebarVisible ? "with-sidebar" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Root;
