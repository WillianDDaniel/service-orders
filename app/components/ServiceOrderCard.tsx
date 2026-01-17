"use client";

import { deleteServiceOrder, updateServiceOrderStatus } from "../actions/ServiceOrders";

type ServiceOrder = {
  id: number;
  name: string;
  price: string;
  description: string | null;
  status: "in_progress" | "blocked" | "finished" | "ready_for_dev" | "canceled";
  tag: "SEO" | "DESIGN" | "CONFIG" | "FEATURE";
  created_at: string;
};

interface ServiceOrderCardProps {
  order: ServiceOrder;
  isExpanded: boolean;
  onToggle: () => void;
}

// Mapa de tradução para exibição
const statusDisplay = {
  in_progress: "Em Andamento",
  blocked: "Bloqueado",
  finished: "Finalizado",
  ready_for_dev: "Pronto p/ Dev",
  canceled: "Cancelado"
};

export function ServiceOrderCard({ order, isExpanded, onToggle }: ServiceOrderCardProps) {
  
  const getStatusColor = (status: string) => {
    if (status === "finished") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (["blocked", "canceled"].includes(status)) return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  return (
    <div className={`bg-[#121214] border border-white/[0.08] rounded-xl transition-all shadow-lg overflow-hidden ${
      isExpanded ? "border-white/20" : "hover:border-white/[0.12]"
    }`}>
      {/* Cabeçalho Clicável */}
      <div onClick={onToggle} className="p-5 flex justify-between items-center cursor-pointer select-none group">
        <strong className="text-lg font-semibold text-white/95 group-hover:text-white transition-colors">
          {order.name}
        </strong>

        <div className="flex items-center gap-4">
          <span className={`text-xs px-2.5 py-1.5 rounded-md font-medium border border-white/5 ${getStatusColor(order.status)}`}>
            {statusDisplay[order.status] || order.status}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
            className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Conteúdo Expandido */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="border-t border-white/[0.08] pt-4 grid gap-4">
            <div className="flex gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-white/40 text-xs">Preço</span>
                <span className="text-white/90 font-medium">R$ {order.price}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/40 text-xs">Tag</span>
                <span className="text-white/90 font-medium">{order.tag}</span>
              </div>
            </div>

            {order.description && (
              <div className="bg-black p-3 rounded-lg border border-white/[0.04]">
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{order.description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-center pt-2 mt-2 border-t border-white/[0.05]">
              <form action={updateServiceOrderStatus} className="flex gap-2 items-center flex-1">
                <input type="hidden" name="id" value={order.id} />
                <select name="status" defaultValue={order.status} className="bg-black border border-white/10 rounded-md px-2.5 py-2 text-white text-xs outline-none cursor-pointer focus:border-white/20 transition-all w-full max-w-[160px]">
                  <option value="in_progress">Em Andamento</option>
                  <option value="blocked">Bloqueado</option>
                  <option value="finished">Finalizado</option>
                  <option value="ready_for_dev">Pronto p/ Dev</option>
                  <option value="canceled">Cancelado</option>
                </select>
                <button type="submit" className="bg-white/[0.08] text-white/90 border border-white/10 rounded-md px-3.5 py-2 text-xs font-medium cursor-pointer transition-all hover:bg-white/[0.12]">
                  Atualizar Status
                </button>
              </form>

              <form action={deleteServiceOrder}>
                <input type="hidden" name="id" value={order.id} />
                <button type="submit" className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-md px-3.5 py-2 text-xs font-medium cursor-pointer transition-all hover:bg-red-500/20">
                  Excluir
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}