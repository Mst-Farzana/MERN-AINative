import { ArrowUpRight, Clock3, Plus, Sparkles } from "lucide-react";
import { useState } from "react";

const services = [
  { name: "Initial consultation", detail: "Understand goals and recommend a clear next step.", duration: "45 min", price: "$120", color: "#0f766e" },
  { name: "Strategy session", detail: "A focused working session for decisions and planning.", duration: "60 min", price: "$180", color: "#e57f62" },
  { name: "Property viewing", detail: "A guided viewing with time for questions and notes.", duration: "45 min", price: "$95", color: "#c2944c" },
];

const Services = () => {
  const [showAdded, setShowAdded] = useState(false);
  return <div className="space-y-7"><section className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Your service catalogue</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#183333] sm:text-4xl">Services</h1><p className="mt-2 text-sm text-[#6c7b79]">Control what clients can book and keep your availability clear.</p></div><button onClick={() => setShowAdded(true)} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 hover:bg-[#115e59]"><Plus className="h-4 w-4" /> Add service</button></section>{showAdded && <div className="rounded-xl border border-[#b8e2d3] bg-[#dff3ec] px-4 py-3 text-sm font-bold text-[#0f766e]">Service creation is ready. Connect it to your catalogue API to publish a new service.</div>}<section className="grid gap-5 lg:grid-cols-3">{services.map((service) => <article key={service.name} className="group rounded-2xl border border-[#dfeae4] bg-[#f8fbf9] p-6 shadow-[0_14px_35px_rgba(31,69,63,.05)] transition hover:-translate-y-1 hover:shadow-xl"><div className="flex items-start justify-between"><div className="rounded-xl p-3" style={{ color: service.color, backgroundColor: `${service.color}18` }}><Sparkles className="h-5 w-5" /></div><button aria-label={`Open ${service.name}`} className="rounded-lg p-2 text-[#82918d] opacity-0 transition group-hover:opacity-100 hover:bg-[#dff3ec] hover:text-[#0f766e]"><ArrowUpRight className="h-4 w-4" /></button></div><h2 className="mt-6 text-lg font-extrabold text-[#183333]">{service.name}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-[#6c7b79]">{service.detail}</p><div className="mt-6 flex items-center justify-between border-t border-[#e5eee9] pt-4"><span className="flex items-center gap-2 text-xs font-bold text-[#82918d]"><Clock3 className="h-4 w-4" /> {service.duration}</span><span className="text-lg font-extrabold text-[#183333]">{service.price}</span></div></article>)}</section></div>;
};
export default Services;
