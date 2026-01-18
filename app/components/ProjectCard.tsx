import { type ProjectRow } from "../actions/Projects";

// Formata para "DD/MM/YYYY"
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

// Calcula tempo relativo (ex: "há 2 horas", "agora mesmo")
const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return `há ${Math.floor(interval)} anos`;
  interval = seconds / 2592000;
  if (interval > 1) return `há ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `há ${Math.floor(interval)} dias`;
  interval = seconds / 3600;
  if (interval > 1) return `há ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `há ${Math.floor(interval)} minutos`;
  return "agora mesmo";
};

// --- O Componente Card ---
export function ProjectCard({ project }: { project: ProjectRow }) {
  return (
    // Usamos as mesmas cores de fundo, borda e efeitos de hover dos exemplos anteriores
    <div className="group bg-[#121214] border border-white/[0.08] rounded-xl p-5 transition-all duration-200 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 flex flex-col h-full">
      
      {/* Cabeçalho do Card: Ícone e Título */}
      <div className="flex items-start gap-3 mb-auto">
        {/* Ícone de pasta com cor suave que brilha no hover */}
        <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-white/60 group-hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
          </svg>
        </div>
        {/* Título do Projeto */}
        <h3 className="text-lg font-semibold text-white/95 group-hover:text-white transition-colors break-words line-clamp-2 pt-0.5">
          {project.name}
        </h3>
      </div>

      {/* Rodapé do Card: Datas */}
      <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 mt-6 text-xs text-white/50">
        <div title={new Date(project.created_at).toLocaleString()}>
            Criado em <span className="font-medium text-white/70">{formatDate(project.created_at)}</span>
        </div>
         <div className="flex items-center gap-1.5 text-white/70 bg-white/5 px-2 py-1 rounded-md font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white/50">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            {timeAgo(project.updated_at)}
        </div>
      </div>
    </div>
  );
}
