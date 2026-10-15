import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/common/DashboardNavbar";
import Sidebar from "../components/common/Sidebar";

function MainLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="app-shell">
			{sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
			<Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
			<main className="app-main">
				<DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
				<Outlet />
			</main>
		</div>
	);
}

export default MainLayout;
