import axios from "axios";
import {
    ArrowUpRight,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
    DollarSign,
    MoreHorizontal,
    Plus,
    Sparkles,
    Users,
} from "lucide-react";
import { useState } from "react";

interface DashboardInsight {
  summary: string;
  highlights: string[];
  recommendations: string[];
  risk: string;
}

const days = [
  { label: "Mon", date: "23" },
  { label: "Tue", date: "24" },
  { label: "Wed", date: "25" },
  { label: "Thu", date: "26" },
  { label: "Fri", date: "27" },
  { label: "Sat", date: "28" },
  { label: "Sun", date: "29" },
];

const appointments = [
  { time: "09:00", name: "Maya Rodriguez", service: "Initial consultation", duration: "45 min", color: "#0f766e" },
  { time: "10:30", name: "Ethan Brooks", service: "Strategy session", duration: "60 min", color: "#e57f62" },
  { time: "13:00", name: "Sophia Chen", service: "Property viewing", duration: "45 min", color: "#c2944c" },
  { time: "15:30", name: "Liam Wilson", service: "Follow-up call", duration: "30 min", color: "#8069a8" },
];

const Dashboard = () => {
  const [selectedDay, setSelectedDay] = useState("24");
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointments)[number] | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [insight, setInsight] = useState<DashboardInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const generateInsight = async () => {
    setIsLoadingInsight(true);
    setInsightError("");
    try {
      const response = await axios.get<{ data: DashboardInsight }>(`${apiUrl}/ai/dashboard-insights`);
      setInsight(response.data.data);
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      const isBackendOffline = axios.isAxiosError(error) && !error.response;
      setInsightError(message || (isBackendOffline ? "Backend is offline. Start the backend on port 5000 and try again." : "AI insights could not be generated right now."));
    } finally {
      setIsLoadingInsight(false);
    }
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-[#8ed0bd]">Tuesday, October 24, 2024</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Good morning, Ava</h1>
          <p className="mt-2 text-sm text-[#b7d4cc]">Here is what is happening with your schedule today.</p>
        </div>
        <button onClick={() => setIsBookingOpen(true)} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition hover:bg-[#115e59]"><Plus className="h-4 w-4" /> New appointment</button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Today's appointments", value: "12", detail: "+3 from yesterday", icon: CalendarDays, color: "#0f766e" },
          { label: "Open time slots", value: "08", detail: "Across 3 services", icon: Clock3, color: "#d96e50" },
          { label: "New clients", value: "24", detail: "+18.2% this month", icon: Users, color: "#8a6b3f" },
          { label: "Revenue this month", value: "$18,420", detail: "+12.4% vs last month", icon: DollarSign, color: "#6c5b9a" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#163d42] p-5 text-white shadow-[0_18px_40px_rgba(16,47,53,.18)]">
            <div className="flex items-start justify-between"><p className="max-w-[150px] text-xs font-bold leading-5 text-[#b7d4cc]">{stat.label}</p><div className="rounded-xl p-2.5" style={{ backgroundColor: `${stat.color}28`, color: stat.color }}><stat.icon className="h-4 w-4" /></div></div>
            <p className="mt-4 text-2xl font-extrabold tracking-tight text-white">{stat.value}</p><p className="mt-1 text-xs font-semibold text-[#8ed0bd]">{stat.detail}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <section className="soft-grid overflow-hidden rounded-2xl border border-[#dfeae4] bg-white shadow-[0_12px_35px_rgba(31,69,63,.05)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#e5eee9] bg-white/80 px-5 py-5 sm:flex-row sm:items-center"><div><h2 className="text-lg font-extrabold text-[#183333]">Your schedule</h2><p className="mt-1 text-xs text-[#82918d]">7 appointments · 4h 15m booked</p></div><div className="flex items-center gap-2"><button aria-label="Previous week" className="rounded-lg border border-[#dfeae4] p-2 text-[#6c7b79] hover:bg-[#f2f7f3]"><ChevronLeft className="h-4 w-4" /></button><button className="rounded-lg border border-[#dfeae4] px-3 py-2 text-xs font-bold text-[#183333]">Today</button><button aria-label="Next week" className="rounded-lg border border-[#dfeae4] p-2 text-[#6c7b79] hover:bg-[#f2f7f3]"><ChevronRight className="h-4 w-4" /></button></div></div>
          <div className="grid grid-cols-7 border-b border-[#e5eee9] bg-white/70">{days.map((day) => <button key={day.date} onClick={() => setSelectedDay(day.date)} className={`border-r border-[#e5eee9] px-2 py-4 text-center transition last:border-0 ${selectedDay === day.date ? "bg-[#e4f5ee]" : "hover:bg-[#f2f7f3]"}`}><span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#82918d]">{day.label}</span><span className={`mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${selectedDay === day.date ? "bg-[#0f766e] text-white" : "text-[#183333]"}`}>{day.date}</span></button>)}</div>
          <div className="divide-y divide-[#e5eee9] bg-white/60">{appointments.map((appointment) => <div key={appointment.time} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 px-5 py-4 sm:grid-cols-[68px_1fr_auto] sm:gap-5"><span className="text-xs font-bold text-[#82918d]">{appointment.time}</span><div className="flex min-w-0 items-center gap-3"><span className="h-9 w-1 rounded-full" style={{ backgroundColor: appointment.color }}></span><div className="min-w-0"><p className="truncate text-sm font-extrabold text-[#183333]">{appointment.name}</p><p className="truncate text-xs text-[#82918d]">{appointment.service} · {appointment.duration}</p></div></div><button onClick={() => setSelectedAppointment(appointment)} aria-label={`Open ${appointment.name} appointment`} className="rounded-lg p-2 text-[#a0afaa] hover:bg-[#eef5f1] hover:text-[#183333]"><MoreHorizontal className="h-4 w-4" /></button></div>)}</div>
          <button className="flex w-full items-center justify-center gap-2 border-t border-[#e5eee9] bg-white/80 py-4 text-xs font-extrabold text-[#0f766e] hover:bg-[#f2f7f3]">View full calendar <ArrowUpRight className="h-3.5 w-3.5" /></button>
        </section>

        <section className="rounded-2xl bg-[#183333] p-6 text-white shadow-[0_18px_45px_rgba(24,51,51,.16)]"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#f2b49f]" /><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#a8d7c7]">Smart assistant</p></div><span className="rounded-full bg-[#ffffff12] px-2 py-1 text-[10px] font-bold text-[#b7dcd0]">Gemini</span></div><h2 className="mt-6 text-2xl font-extrabold leading-tight">Make your day run a little smoother.</h2><p className="mt-3 text-sm leading-6 text-[#b4c9c2]">Get a quick read on bookings, client demand, and the best next action for your team.</p><button onClick={generateInsight} disabled={isLoadingInsight} className="mt-7 flex items-center gap-2 rounded-xl bg-[#e57f62] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#d96e50] disabled:opacity-60"><Sparkles className="h-4 w-4" />{isLoadingInsight ? "Analyzing..." : insight ? "Refresh insight" : "Generate insight"}</button>{insightError && <p className="mt-4 text-xs text-[#f2b49f]">{insightError}</p>}{insight && <div className="mt-6 space-y-3 border-t border-white/10 pt-5"><p className="text-sm leading-6 text-[#e4f2ed]">{insight.summary}</p><p className="flex items-start gap-2 text-xs leading-5 text-[#b4c9c2]"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a8d7c7]" />{insight.recommendations[0]}</p></div>}{!insight && <div className="mt-8 border-t border-white/10 pt-5"><p className="text-xs font-bold text-[#94b9ae]">Today’s focus</p><p className="mt-2 text-sm font-bold text-[#e4f2ed]">You have 3 open slots between 11:30 and 14:00.</p></div>}</section>
      </div>

      <section className="grid gap-6 rounded-2xl border border-white/10 bg-[#163d42] p-6 text-white shadow-[0_18px_40px_rgba(16,47,53,.18)] lg:grid-cols-[1fr_1.4fr]">
        <div><div className="flex items-center justify-between"><div><p className="eyebrow text-[#8ed0bd]">Performance</p><h2 className="mt-1 text-lg font-extrabold text-white">Booking overview</h2></div><button className="text-xs font-extrabold text-[#8ed0bd]">This month</button></div><div className="mt-6 flex items-end gap-2"><span className="text-3xl font-extrabold text-white">184</span><span className="mb-1 text-xs font-bold text-[#f2b49f]">+16.8%</span></div><p className="mt-1 text-xs text-[#b7d4cc]">Confirmed appointments this month</p></div>
        <div className="relative h-36 border-l border-white/15 pl-5"><svg className="h-full w-full overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none" role="img" aria-label="Monthly booking trend"><defs><linearGradient id="bookingFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5fb89f" stopOpacity=".32" /><stop offset="100%" stopColor="#5fb89f" stopOpacity="0" /></linearGradient></defs><path d="M0 112 C48 98 62 105 105 88 S160 104 205 70 S270 84 310 54 S362 72 405 42 S470 58 510 28 S560 42 600 16 L600 150 L0 150 Z" fill="url(#bookingFill)" className="booking-chart-fill" /><path d="M0 112 C48 98 62 105 105 88 S160 104 205 70 S270 84 310 54 S362 72 405 42 S470 58 510 28 S560 42 600 16" fill="none" stroke="#8ed0bd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="booking-chart-line" /><path d="M0 112 C48 98 62 105 105 88 S160 104 205 70 S270 84 310 54 S362 72 405 42 S470 58 510 28 S560 42 600 16" fill="none" stroke="#e57f62" strokeLinecap="round" strokeWidth="2" strokeDasharray="2 20" className="booking-chart-pulse" /></svg><div className="mt-1 flex justify-between text-[9px] font-bold text-[#a8c8c0]">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => <span key={month}>{month}</span>)}</div></div>
      </section>

      {(selectedAppointment || isBookingOpen) && <div className="fixed inset-0 z-30 bg-[#183333]/20 backdrop-blur-[2px]" onClick={() => { setSelectedAppointment(null); setIsBookingOpen(false); }}><aside onClick={(event) => event.stopPropagation()} className="booking-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fbfcfa] p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="eyebrow">{selectedAppointment ? "Appointment details" : "New booking"}</p><h2 className="mt-1 text-2xl font-extrabold text-[#183333]">{selectedAppointment ? selectedAppointment.name : "Create appointment"}</h2></div><button aria-label="Close panel" onClick={() => { setSelectedAppointment(null); setIsBookingOpen(false); }} className="rounded-xl p-2 text-[#6c7b79] hover:bg-[#eaf3ee]">×</button></div>{selectedAppointment ? <div className="mt-8 space-y-5"><div className="rounded-2xl bg-[#dff3ec] p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#0f766e]">{selectedAppointment.time} · Today</p><p className="mt-2 text-lg font-extrabold text-[#183333]">{selectedAppointment.service}</p><p className="mt-1 text-sm text-[#6c7b79]">Duration: {selectedAppointment.duration}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-[#82918d]">Booking status</p><span className="mt-3 inline-flex rounded-full bg-[#dff3ec] px-3 py-1.5 text-xs font-extrabold text-[#0f766e]">Confirmed</span></div><div className="flex gap-3"><button className="flex-1 rounded-xl border border-[#dfeae4] py-3 text-sm font-bold text-[#183333]">Reschedule</button><button className="flex-1 rounded-xl bg-[#e57f62] py-3 text-sm font-bold text-white">Message client</button></div></div> : <div className="mt-8 space-y-4"><label className="block text-xs font-bold text-[#6c7b79]">Client name<input className="mt-2 w-full rounded-xl border border-[#dfeae4] bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e]" placeholder="Search or add client" /></label><label className="block text-xs font-bold text-[#6c7b79]">Service<select className="mt-2 w-full rounded-xl border border-[#dfeae4] bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e]"><option>Initial consultation</option><option>Strategy session</option><option>Property viewing</option></select></label><label className="block text-xs font-bold text-[#6c7b79]">Date and time<input type="datetime-local" className="mt-2 w-full rounded-xl border border-[#dfeae4] bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e]" /></label><button onClick={() => setIsBookingOpen(false)} className="mt-4 w-full rounded-xl bg-[#0f766e] py-3 text-sm font-extrabold text-white">Save appointment</button></div>}</aside></div>}
    </div>
  );
};

export default Dashboard;
