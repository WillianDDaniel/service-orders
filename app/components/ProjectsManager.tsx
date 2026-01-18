"use client";

import { useState } from "react";
import { type ProjectRow } from "../actions/Projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

interface ProjectsManagerProps {
  projects: ProjectRow[];
  errorMessage?: string | null;
}

export function ProjectsManager({ projects, errorMessage }: ProjectsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* Cabeçalho com Botão */}
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3">
          {/* Ícone do Título */}
          <div className="w-9 h-9 bg-white/5 p-1.5 rounded-lg border border-white/10 shadow-sm flex items-center justify-center text-white/80">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.625-4.5V6a2.25 2.25 0 0 1 2.25-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v1.5m-9 0h9.75M2.25 12.75H3.75a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H2.25a2.25 2.25 0 0 1-2.25-2.25v-3a2.25 2.25 0 0 1 2.25-2.25Zm9 0h1.5a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v-3a2.25 2.25 0 0 1 2.25-2.25Zm9 0h1.5a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v-3a2.25 2.25 0 0 1 2.25-2.25Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent whitespace-nowrap">
            Meus Projetos
          </h1>
        </div>

        {/* Botão Novo Projeto */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-[#121214] hover:bg-white/90 transition-all font-semibold rounded-lg px-5 py-2.5 text-sm shadow-lg hover:shadow-white/10 whitespace-nowrap flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Novo Projeto
        </button>
      </div>

      {/* Exibição de Erro de Carregamento */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm mb-6 animate-in fade-in slide-in-from-top-2">
          {errorMessage}
        </div>
      )}

      {/* Grid de Conteúdo ou Empty State */}
      <section>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (!errorMessage && (
          <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-16 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
            <div className="text-white/20 mb-6 bg-white/5 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-3">Nenhum projeto encontrado</h3>
            <p className="text-white/50 max-w-md mx-auto mb-6">
              Você ainda não faz parte de nenhum projeto. Crie seu primeiro projeto agora.
            </p>
            {/* Botão duplicado no empty state para facilitar */}
            <button
               onClick={() => setIsModalOpen(true)}
               className="bg-white/[0.08] text-white hover:bg-white/[0.12] border border-white/10 transition-all font-semibold rounded-lg px-5 py-2.5 text-sm"
            >
              Criar Primeiro Projeto
            </button>
          </div>
        ))}
      </section>

      {/* Modal Renderizado Condicionalmente */}
      {isModalOpen && (
        <ProjectModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}