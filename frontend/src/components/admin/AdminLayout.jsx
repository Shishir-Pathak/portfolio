// frontend/src/components/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#070b16] text-white md:flex">
      {/* Sidebar — becomes sticky on md+ */}
      <div className="md:sticky md:top-0 md:h-screen md:overflow-y-auto md:shrink-0">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <main className="min-w-0 flex-1 p-5 md:p-8">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}