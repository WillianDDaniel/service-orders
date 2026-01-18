"use client";

import { useState } from "react";
import { createProject, updateProject } from "../actions/Projects";
import { type NeonAuthUserRow } from "../actions/User";
import { UserSearchMultiSelect } from "./UserSearchMultiSelect"; // Importe o novo componente

// Tipo completo do projeto incluindo a image_url
export type ProjectRow = {
  id: number;
  name: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
};

interface ProjectModalProps {
  initialData?: ProjectRow | null;
  onClose: () => void;
}

export function ProjectModal({ initialData, onClose }: ProjectModalProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para controlar os usuários selecionados no componente filho
  const [selectedUsers, setSelectedUsers] = useState<NeonAuthUserRow[]>([]);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    
    // IMPORTANTE: Serializar os IDs dos usuários selecionados para enviar ao server action
    const memberIds = selectedUsers.map(u => u.id);
    formData.set("members_json", JSON.stringify(memberIds));

    try {
      if (isEditing) {
        await updateProject(formData);
      } else {
        await createProject(formData);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar projeto. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 py-6 sm:px-0">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-[#121214] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-white/95">
            {isEditing ? "Editar Projeto" : "Novo Projeto"}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form action={handleSubmit} className="grid gap-4">
          {isEditing && <input type="hidden" name="id" value={initialData.id} />}

          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1.5 ml-1">
              Nome do Projeto *
            </label>
            <input
              id="name"
              name="name"
              defaultValue={initialData?.name}
              placeholder="Ex: Website Institucional"
              required
              minLength={3}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none focus:border-white/20 transition-all placeholder:text-white/30"
            />
          </div>

          {/* NOVO: Campo URL da Imagem */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-white/70 mb-1.5 ml-1 flex justify-between">
              <span>URL da Capa (Opcional)</span>
              <span className="text-xs text-white/40 font-normal">https://...</span>
            </label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={initialData?.image_url || ""}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-3 text-white text-[15px] outline-none focus:border-white/20 transition-all placeholder:text-white/30"
            />
          </div>

          {/* NOVO: Componente de Seleção Múltipla de Usuários */}
          <div>
            <UserSearchMultiSelect 
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
            />
             {isEditing && (
                <p className="text-xs text-white/40 mt-1 ml-1">
                    Nota: Na edição, você só pode adicionar novos membros.
                </p>
             )}
          </div>


          <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-white/5">
             <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="text-white/60 hover:text-white px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-[#121214] rounded-lg px-6 py-2.5 text-sm font-semibold cursor-pointer transition-all hover:bg-white/90 shadow-lg hover:shadow-white/10 disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-[#121214]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isEditing ? 'Salvar Alterações' : (isLoading ? 'Criando...' : 'Criar Projeto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}