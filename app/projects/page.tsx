import { getProjectsForCurrentUser, type ProjectRow } from "../actions/Projects";
import { ProjectsManager } from "../components/ProjectsManager";

export const metadata = {
  title: 'Meus Projetos',
  description: 'Gerencie seus projetos.',
};

export default async function ProjectsPage() {
  // O fetch continua no servidor para performance e segurança
  let projects: ProjectRow[] = [];
  let errorMessage: string | null = null;

  try {
    projects = await getProjectsForCurrentUser();
  } catch (error) {
    console.error("Falha ao carregar projetos:", error);
    errorMessage = "Não foi possível carregar seus projetos no momento. Tente novamente mais tarde.";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProjectsManager projects={projects} errorMessage={errorMessage} />
    </div>
  );
}