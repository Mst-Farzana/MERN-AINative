import { CheckCircle2, Mail } from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="app-shell flex">
      <Sidebar />
      <div className="app-main flex-1 lg:ml-64">
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
        <footer className="border-t border-white/10 bg-[#102f35] px-6 py-7 text-[#b7d4cc] md:px-10">
          <div className="mx-auto flex max-w-[1480px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-base font-extrabold text-white">Schedulr</p>
              <p className="mt-1 text-xs text-[#8ebdb1]">A calmer way to run your service business.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold">
              <a href="/about" className="transition hover:text-white">About</a>
              <a href="/services" className="transition hover:text-white">Services</a>
              <a href="mailto:support@schedulr.app" className="inline-flex items-center gap-2 transition hover:text-white"><Mail className="h-3.5 w-3.5" /> Support</a>
              <span className="inline-flex items-center gap-2 text-[#8ed0bd]"><CheckCircle2 className="h-3.5 w-3.5" /> All systems operational</span>
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-[1480px] border-t border-white/10 pt-4 text-[11px] text-[#709a98]">© 2026 Schedulr · Secure scheduling for modern teams</div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
