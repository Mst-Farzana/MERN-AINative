import { Bell, ChevronDown, LogOut, Search, Settings, User, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<"profile" | "notifications" | null>(null);
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search.trim()) navigate(`/customers?search=${encodeURIComponent(search.trim())}`);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  return (
    <header className="relative sticky top-0 z-30 border-b border-white/10 bg-[#163d42]/95 px-6 py-4 text-white shadow-lg shadow-[#102f35]/10 backdrop-blur-md md:px-10">
      <div className="flex items-center justify-between gap-5">
        <form onSubmit={submitSearch} className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8ebdb1]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)}
              type="text"
              placeholder="Search clients, services..."
              className="w-full rounded-xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[#8ebdb1] focus:border-[#8ed0bd] focus:bg-white/15"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <p className="hidden text-sm font-semibold text-[#b7d4cc] sm:block">Tuesday, October 24, 2024</p>
          <button aria-label="Notifications" onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")} className="relative rounded-xl p-2 text-[#b7d4cc] hover:bg-white/10 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e57f62]"></span>
          </button>

          <button onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")} className="flex items-center gap-3 border-l border-white/15 pl-4 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5fb89f]">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white">Ava Thompson</p>
              <p className="text-xs text-[#8ebdb1]">Business admin</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[#8ebdb1] sm:block" />
          </button>
        </div>
      </div>
      {openMenu === "notifications" && <div className="absolute right-20 top-[72px] w-80 rounded-2xl border border-[#dfeae4] bg-[#f8fbf9] p-4 text-[#183333] shadow-2xl"><div className="flex items-center justify-between"><p className="font-extrabold">Notifications</p><button onClick={() => setOpenMenu(null)} aria-label="Close notifications"><X className="h-4 w-4" /></button></div><div className="mt-3 rounded-xl bg-[#dff3ec] p-3"><p className="text-sm font-bold">3 open appointment slots</p><p className="mt-1 text-xs text-[#6c7b79]">Your schedule has availability this afternoon.</p></div><div className="mt-2 rounded-xl bg-[#fff0e9] p-3"><p className="text-sm font-bold">Payment received</p><p className="mt-1 text-xs text-[#6c7b79]">Maya Rodriguez paid for her consultation.</p></div></div>}
      {openMenu === "profile" && <div className="absolute right-6 top-[72px] w-64 rounded-2xl border border-[#dfeae4] bg-[#f8fbf9] p-2 text-[#183333] shadow-2xl"><div className="border-b border-[#e5eee9] px-3 py-3"><p className="text-sm font-extrabold">Ava Thompson</p><p className="text-xs text-[#82918d]">Business administrator</p></div><button onClick={() => { setOpenMenu(null); navigate("/settings"); }} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-[#dff3ec]"><Settings className="h-4 w-4 text-[#0f766e]" /> Account settings</button><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#b8583e] hover:bg-[#fff0e9]"><LogOut className="h-4 w-4" /> Log out</button></div>}
    </header>
  );
};

export default Header;
