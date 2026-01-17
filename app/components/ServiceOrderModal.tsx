"use client";

import { useState } from "react";
import { createServiceOrder, updateServiceOrder } from "../actions/ServiceOrders";

// Definindo o tipo aqui para uso no componente
type ServiceOrder = {
  id: number;
  name: string;
  price: string;
  description: string | null;
  status: "in_progress" | "blocked" | "finished" | "ready_for_dev" | "canceled";
  tag: "SEO" | "DESIGN" | "CONFIG" | "FEATURE";
  delivery_date: string | null;
  created_at: string;
};

interface ServiceOrderModalProps {
  initialData?: ServiceOrder | null; // Opcional: se existir, é edição
  onClose: () => void;
}

export function ServiceOrderModal({ initialData, onClose }: ServiceOrderModalProps) {
  const isEditing = !!initialData;

  // Função auxiliar para formatar preço inicial (ex: 120.50 -> R$ 120,50)
  const formatInitialPrice = (val: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(val));
  };

  // Estados inicializados com os dados se for edição
  const [displayPrice, setDisplayPrice] = useState(
    initialData ? formatInitialPrice(initialData.price) : ""
  );
  const [realPrice, setRealPrice] = useState(initialData?.price || "0");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyNums = value.replace(/\D/g, "");
    const numberValue = Number(onlyNums) / 100;

    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numberValue);

    setDisplayPrice(formatted);
    setRealPrice(numberValue.toFixed(2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#121214] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-white/95">
            {isEditing ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <form
          action={async (formData) => {
            if (isEditing) {
              await updateServiceOrder(formData);
            } else {
              await createServiceOrder(formData);
            }
            onClose();
          }}
          className="grid gap-3.5"
        >
          {/* Se estiver editando, precisamos enviar o ID */}
          {isEditing && <input type="hidden" name="id" value={initialData.id} />}

          <input
            name="name"
            defaultValue={initialData?.name}
            placeholder="Nome do Serviço"
            required
            className="bg-black border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none focus:border-white/20 transition-all"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input type="hidden" name="price" value={realPrice} />
              <input
                type="text"
                placeholder="R$ 0,00"
                value={displayPrice}
                onChange={handlePriceChange}
                className="w-full bg-black border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none focus:border-white/20 transition-all"
              />
            </div>

            <div className="relative">
              <input
                type="date"
                name="delivery_date"
                defaultValue={initialData?.delivery_date || ""}
                className="w-full bg-black border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none focus:border-white/20 transition-all [color-scheme:dark]"
              />
              <span className="absolute -top-2 left-2 text-[10px] text-white/50 bg-[#121214] px-1">
                Data de Entrega
              </span>
            </div>
          </div>

          <textarea
            name="description"
            defaultValue={initialData?.description || ""}
            placeholder="Descrição detalhada..."
            rows={3}
            className="bg-black border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none resize-y focus:border-white/20 transition-all"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              name="tag"
              defaultValue={initialData?.tag || "FEATURE"}
              className="bg-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none cursor-pointer w-full focus:border-white/20 transition-all"
            >
              {["SEO", "DESIGN", "CONFIG", "FEATURE"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={initialData?.status || "in_progress"}
              className="bg-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none cursor-pointer w-full focus:border-white/20 transition-all"
            >
              <option value="in_progress">Em Andamento</option>
              <option value="blocked">Bloqueado</option>
              <option value="finished">Finalizado</option>
              <option value="ready_for_dev">Pronto p/ Dev</option>
              <option value="canceled">Cancelado</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-white text-[#121214] rounded-lg px-6 py-2.5 text-sm font-semibold cursor-pointer transition-all hover:bg-white/90"
            >
              {isEditing ? "Salvar Alterações" : "Criar Serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}