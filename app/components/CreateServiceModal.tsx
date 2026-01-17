"use client";

import { createServiceOrder } from "../actions/ServiceOrders";

interface CreateServiceModalProps {
  onClose: () => void;
}

export function CreateServiceModal({ onClose }: CreateServiceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-[#121214] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-white/95">Nova Ordem de Serviço</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">✕</button>
        </div>

        <form action={async (formData) => {
          await createServiceOrder(formData);
          onClose();
        }} className="grid gap-3.5">
          <input name="name" placeholder="Nome do Serviço" required className="bg-black border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none focus:border-white/20 transition-all" />
          <input name="price" placeholder="Preço (ex: 120.00)" defaultValue="0" className="bg-black border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none focus:border-white/20 transition-all" />
          <textarea name="description" placeholder="Descrição detalhada..." rows={3} className="bg-black border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none resize-y focus:border-white/20 transition-all" />
          
          <div className="grid grid-cols-2 gap-3">
            <select name="tag" defaultValue="FEATURE" className="bg-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none cursor-pointer w-full focus:border-white/20 transition-all">
              {["SEO", "DESIGN", "CONFIG", "FEATURE"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select name="status" defaultValue="in_progress" className="bg-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none cursor-pointer w-full focus:border-white/20 transition-all">
              <option value="in_progress">Em Andamento</option>
              <option value="blocked">Bloqueado</option>
              <option value="finished">Finalizado</option>
              <option value="ready_for_dev">Pronto p/ Dev</option>
              <option value="canceled">Cancelado</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="text-white/60 hover:text-white px-4 py-2.5 text-sm font-medium transition-colors">Cancelar</button>
            <button type="submit" className="bg-white text-[#121214] rounded-lg px-6 py-2.5 text-sm font-semibold cursor-pointer transition-all hover:bg-white/90">Criar Serviço</button>
          </div>
        </form>
      </div>
    </div>
  );
}