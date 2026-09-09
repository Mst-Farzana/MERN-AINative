import axios from "axios";
import { Mail, MoreHorizontal, Phone, Search, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Client { id: string; name: string; email: string; phone: string; service: string; status: "Active" | "New" | "Inactive"; appointments: number; }

const Customers = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "New">("All");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "Initial consultation" });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await axios.get<{ data: Client[] }>(`${apiUrl}/customers`);
        setClients(response.data.data);
      } catch (requestError) {
        setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || "Unable to load clients" : "Unable to load clients");
      } finally { setIsLoading(false); }
    };
    void loadClients();
  }, [apiUrl]);
  const filteredClients = useMemo(() => clients.filter((client) => `${client.name} ${client.email} ${client.service}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All" || client.status === filter)), [clients, filter, query]);
  const addClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    try {
      const response = await axios.post<{ data: Client }>(`${apiUrl}/customers`, form);
      setClients((current) => [response.data.data, ...current]);
      setForm({ name: "", email: "", phone: "", service: "Initial consultation" });
      setIsAdding(false);
    } catch (requestError) {
      setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || "Unable to add client" : "Unable to add client");
    }
  };
  const closePanels = () => { setIsAdding(false); setSelectedClient(null); };

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Client relationship management</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#183333] sm:text-4xl">Clients</h1><p className="mt-2 text-sm text-[#6c7b79]">Keep every relationship, conversation, and booking in one place.</p></div><button onClick={() => setIsAdding(true)} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 hover:bg-[#115e59]"><UserPlus className="h-4 w-4" /> Add client</button></section>
      {error && <div className="rounded-xl border border-[#f0d8ce] bg-[#fff0e9] px-4 py-3 text-sm font-bold text-[#b8583e]">{error}</div>}
      {isLoading && <div className="rounded-xl border border-[#dfeae4] bg-[#f8fbf9] px-4 py-3 text-sm font-semibold text-[#6c7b79]">Loading clients...</div>}
      <section className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-[#163d42] p-5 text-white shadow-lg shadow-[#102f35]/10"><p className="text-xs font-bold text-[#b7d4cc]">Total clients</p><p className="mt-3 text-3xl font-extrabold">{clients.length}</p><p className="mt-1 text-xs font-semibold text-[#8ed0bd]">Growing your network</p></div><div className="rounded-2xl border border-[#dfeae4] bg-[#f8fbf9] p-5"><p className="text-xs font-bold text-[#82918d]">Active clients</p><p className="mt-3 text-3xl font-extrabold text-[#183333]">{clients.filter((client) => client.status === "Active").length}</p><p className="mt-1 text-xs font-semibold text-[#0f766e]">Returning relationships</p></div><div className="rounded-2xl border border-[#f0d8ce] bg-[#fff8f5] p-5"><p className="text-xs font-bold text-[#9b7465]">New this month</p><p className="mt-3 text-3xl font-extrabold text-[#183333]">{clients.filter((client) => client.status === "New").length}</p><p className="mt-1 text-xs font-semibold text-[#d96e50]">Ready for follow-up</p></div></section>
      <section className="rounded-2xl border border-[#dfeae4] bg-[#f8fbf9]/90 shadow-[0_14px_35px_rgba(31,69,63,.06)]"><div className="flex flex-col gap-4 border-b border-[#e5eee9] p-5 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#82918d]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clients, email or service" className="w-full rounded-xl border border-[#dfeae4] bg-white py-3 pl-10 pr-4 text-sm text-[#183333] outline-none focus:border-[#0f766e]" /></div><div className="flex gap-2">{(["All", "Active", "New"] as const).map((option) => <button key={option} onClick={() => setFilter(option)} className={`rounded-lg px-3 py-2 text-xs font-extrabold ${filter === option ? "bg-[#dff3ec] text-[#0f766e]" : "text-[#82918d] hover:bg-white"}`}>{option}</button>)}</div></div><div className="divide-y divide-[#e5eee9]">{filteredClients.map((client) => <div key={client.id} className="flex flex-col gap-4 p-5 transition hover:bg-white/70 md:flex-row md:items-center"><div className="flex min-w-0 flex-1 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2b756d] text-sm font-extrabold text-white">{client.name.split(" ").map((part) => part[0]).join("")}</div><div className="min-w-0"><p className="truncate text-sm font-extrabold text-[#183333]">{client.name}</p><p className="truncate text-xs text-[#82918d]">{client.service} · {client.appointments} appointments</p></div></div><div className="grid gap-2 text-xs text-[#6c7b79] sm:grid-cols-2 md:w-[360px]"><span className="flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 text-[#0f766e]" />{client.email}</span><span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[#0f766e]" />{client.phone}</span></div><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-extrabold ${client.status === "New" ? "bg-[#fff0e9] text-[#d96e50]" : "bg-[#dff3ec] text-[#0f766e]"}`}>{client.status}</span><button onClick={() => setSelectedClient(client)} aria-label={`Open ${client.name}`} className="rounded-lg p-2 text-[#82918d] hover:bg-[#eaf3ee] hover:text-[#183333]"><MoreHorizontal className="h-4 w-4" /></button></div>)}{filteredClients.length === 0 && <div className="p-12 text-center"><p className="font-bold text-[#183333]">No clients found</p><p className="mt-1 text-sm text-[#82918d]">Try a different search or add a new client.</p></div>}</div></section>
      {(isAdding || selectedClient) && <div className="fixed inset-0 z-30 bg-[#102f35]/30 backdrop-blur-sm" onClick={closePanels}><aside onClick={(event) => event.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-[#f8fbf9] p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="eyebrow">{isAdding ? "New relationship" : "Client profile"}</p><h2 className="mt-1 text-2xl font-extrabold text-[#183333]">{isAdding ? "Add client" : selectedClient?.name}</h2></div><button onClick={closePanels} aria-label="Close" className="rounded-xl p-2 text-[#6c7b79] hover:bg-[#eaf3ee]"><X className="h-5 w-5" /></button></div>{isAdding ? <form onSubmit={addClient} className="mt-8 space-y-4"><label className="block text-xs font-bold text-[#6c7b79]">Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfeae4] bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e]" placeholder="e.g. Jordan Lee" /></label><label className="block text-xs font-bold text-[#6c7b79]">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfeae4] bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e]" placeholder="jordan@example.com" /></label><label className="block text-xs font-bold text-[#6c7b79]">Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfeae4] bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e]" placeholder="+1 555 000 0000" /></label><label className="block text-xs font-bold text-[#6c7b79]">Primary service<select value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfeae4] bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e]"><option>Initial consultation</option><option>Strategy session</option><option>Property viewing</option><option>Follow-up call</option></select></label><button type="submit" className="mt-4 w-full rounded-xl bg-[#0f766e] py-3 text-sm font-extrabold text-white">Save client</button></form> : selectedClient && <div className="mt-8 space-y-5"><div className="rounded-2xl bg-[#dff3ec] p-5"><p className="text-sm font-extrabold text-[#183333]">{selectedClient.email}</p><p className="mt-1 text-sm text-[#6c7b79]">{selectedClient.phone}</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-[#dfeae4] bg-white p-4"><p className="text-xs text-[#82918d]">Appointments</p><p className="mt-2 text-2xl font-extrabold text-[#183333]">{selectedClient.appointments}</p></div><div className="rounded-xl border border-[#dfeae4] bg-white p-4"><p className="text-xs text-[#82918d]">Status</p><p className="mt-2 text-sm font-extrabold text-[#0f766e]">{selectedClient.status}</p></div></div><button className="w-full rounded-xl bg-[#163d42] py-3 text-sm font-extrabold text-white">Schedule appointment</button></div>}</aside></div>}
    </div>
  );
};

export default Customers;
