import {
    BriefcaseBusiness,
    CalendarDays,
    Clock3,
    Info,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/orders", icon: CalendarDays, label: "Appointments" },
    { path: "/products", icon: Clock3, label: "Availability" },
    { path: "/customers", icon: Users, label: "Clients" },
    { path: "/services", icon: BriefcaseBusiness, label: "Services" },
    { path: "/about", icon: Info, label: "About Schedulr" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-full w-64 border-r border-[#2d5960] bg-[#102f35] lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-7">
        <h1 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5fb89f] shadow-lg shadow-black/20">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          Schedulr
        </h1>
        <p className="mt-2 pl-12 text-[10px] font-bold uppercase tracking-[.18em] text-[#8ebdb1]">Carefully planned</p>
      </div>

      <nav className="flex-1 px-4 py-7">
        <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#709a98]">Workspace</p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-[#2b756d] font-bold text-white shadow-lg shadow-black/10"
                      : "text-[#a8c5be] hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("auth-change"));
            navigate("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#a8c5be] transition-colors hover:bg-[#e57f62]/15 hover:text-[#f2b49f]"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
