import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex flex-col grow overflow-y-auto flex-1 lg:ml-56">
        <Outlet />
      </main>
    </div>
  );
}
