"use client";

import { useState, useMemo } from "react";
import { ServiceOrderCard } from "./ServiceOrderCard";
import { CreateServiceModal } from "./CreateServiceModal";

type ServiceOrder = {
  id: number;
  name: string;
  price: string;
  description: string | null;
  status: "in_progress" | "blocked" | "finished" | "ready_for_dev" | "canceled";
  tag: "SEO" | "DESIGN" | "CONFIG" | "FEATURE";
  created_at: string;
};

// Tipo auxiliar para as Tabs
type TabType = "all" | ServiceOrder["status"];

export default function ServiceOrderManager({ orders }: { orders: ServiceOrder[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 1. Calcular contagens para os badges
  const counts = useMemo(() => {
    const tempCounts = {
      all: orders.length,
      in_progress: 0,
      blocked: 0,
      finished: 0,
      ready_for_dev: 0,
      canceled: 0
    };
    
    orders.forEach(o => {
      if (tempCounts[o.status] !== undefined) {
        tempCounts[o.status]++;
      }
    });

    return tempCounts;
  }, [orders]);

  // 2. Filtrar ordens com base na Tab ativa
  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter(o => o.status === activeTab);
  }, [orders, activeTab]);

  // Lista de Tabs para renderizar
  const tabs: { id: TabType; label: string }[] = [
    { id: "all", label: "Todos" },
    { id: "ready_for_dev", label: "Pronto p/ Dev" },
    { id: "in_progress", label: "Em Andamento" },
    { id: "blocked", label: "Bloqueados" },
    { id: "finished", label: "Finalizados" },
    { id: "canceled", label: "Cancelados" },
  ];

  return (
    <div>
      {/* Cabeçalho Principal */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
          Ordens de Serviço
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-[#121214] hover:bg-white/90 transition-all font-semibold rounded-lg px-5 py-2.5 text-sm shadow-lg hover:shadow-white/10"
        >
          + Novo Serviço
        </button>
      </div>

      {/* --- Navegação por Tabs --- */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-white/[0.08] scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap
                ${isActive 
                  ? "text-white border-b-2 border-white bg-white/[0.04]" 
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
                }
              `}
            >
              {tab.label}
              {count > 0 && (
                <span className={`
                  text-[10px] px-1.5 py-0.5 rounded-full font-bold
                  ${isActive ? "bg-white text-black" : "bg-white/10 text-white/60"}
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* --- Lista de Serviços Filtrada --- */}
      <section className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <p className="text-center py-10 text-white/50 text-[15px]">
            Nenhum serviço encontrado nesta categoria.
          </p>
        ) : (
          filteredOrders.map((order) => (
            <ServiceOrderCard
              key={order.id}
              order={order}
              isExpanded={expandedId === order.id}
              onToggle={() => toggleExpand(order.id)}
            />
          ))
        )}
      </section>

      {/* Modal */}
      {isModalOpen && (
        <CreateServiceModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}