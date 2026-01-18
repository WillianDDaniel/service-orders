"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../lib/db";
import { requireUserId } from "../lib/auth/server";

export type ProjectRow = {
  id: number;
  name: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
};

// Helper para limpar a URL
function normalizeImageUrl(value: unknown): string | null {
  const url = String(value || "").trim();
  // Validação básica de URL (opcional, mas recomendada)
  if (url.length > 0 && !url.startsWith('http')) {
      return null; // Ou forçar https://
  }
  return url.length > 0 ? url : null;
}

// Helper para parsear o JSON de membros
function parseMemberIds(jsonString: unknown): string[] {
    try {
        const parsed = JSON.parse(String(jsonString || "[]"));
        if (Array.isArray(parsed)) {
            // Filtra para garantir que são apenas strings (UUIDs) válidas
            return parsed.filter(id => typeof id === 'string' && id.length > 0);
        }
        return [];
    } catch (e) {
        console.error("Erro ao parsear IDs dos membros:", e);
        return [];
    }
}


export async function getProjectsForCurrentUser(): Promise<ProjectRow[]> {
  const userId = await requireUserId();

  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.image_url,
      p.created_at,
      p.updated_at
    FROM public.projects p
    INNER JOIN public.project_members pm
      ON pm.project_id = p.id
    WHERE pm.user_id = ${userId}::uuid
    ORDER BY p.created_at DESC
  `;

  return rows as ProjectRow[];
}

export async function createProject(formData: FormData) {
  const creatorUserId = await requireUserId();

  const name = String(formData.get("name") || "").trim();
  const imageUrl = normalizeImageUrl(formData.get("image_url"));
  // Pegamos a string JSON do input hidden
  const selectedMemberIds = parseMemberIds(formData.get("members_json"));

  if (!name || name.length < 3) {
    throw new Error("O nome do projeto deve ter pelo menos 3 caracteres.");
  }

  try {
    // 1. Criar o Projeto
    const insertResult = await sql`
      INSERT INTO public.projects (name, image_url)
      VALUES (${name}, ${imageUrl})
      RETURNING id
    `;

    const newProjectId = insertResult[0]?.id;
    if (!newProjectId) throw new Error("Falha ao recuperar ID do novo projeto.");

    // 2. Preparar lista de membros (Criador + Selecionados)
    // Usamos um Set para garantir que não haja IDs duplicados
    const uniqueMembers = new Set([creatorUserId, ...selectedMemberIds]);

    // 3. Inserir membros em lote
    // Vamos iterar e inserir. Em SQLs mais avançados poderíamos fazer um bulk insert,
    // mas um loop com ON CONFLICT é seguro e simples para começar.
    for (const userId of uniqueMembers) {
        await sql`
          INSERT INTO public.project_members (project_id, user_id, role)
          VALUES (${newProjectId}, ${userId}::uuid, ${userId === creatorUserId ? 'owner' : 'member'})
          ON CONFLICT (project_id, user_id) DO NOTHING
        `;
    }

    revalidatePath("/projects");
    return { ok: true, projectId: newProjectId };
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    throw new Error("Erro ao tentar criar o projeto no banco de dados.");
  }
}

export async function updateProject(formData: FormData) {
  const currentUserId = await requireUserId();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const imageUrl = normalizeImageUrl(formData.get("image_url"));
  const selectedMemberIds = parseMemberIds(formData.get("members_json"));


  if (!id || Number.isNaN(id)) throw new Error("Invalid project id");
  if (!name || name.length < 3) {
    throw new Error("O nome do projeto deve ter pelo menos 3 caracteres.");
  }

  // Verifica se o usuário tem permissão para editar (opcional, mas bom)
  const membership = await sql`SELECT role FROM public.project_members WHERE project_id = ${id} AND user_id = ${currentUserId}::uuid`;
  if (membership.length === 0) throw new Error("Você não tem permissão para editar este projeto.");


  // 1. Atualiza dados básicos do projeto
  await sql`
    UPDATE public.projects
    SET
      name = ${name},
      image_url = ${imageUrl},
      updated_at = now()
    WHERE id = ${id}
  `;

  // 2. Sincronizar Membros (Abordagem Simplificada: Apenas adicionar novos)
  // *Nota: Remover membros na edição é mais complexo pois envolve decidir quem pode remover quem.
  // Nesta abordagem, apenas garantimos que os novos selecionados sejam adicionados.*
  const uniqueMembersToAdd = new Set([...selectedMemberIds]);

    for (const userId of uniqueMembersToAdd) {
        await sql`
          INSERT INTO public.project_members (project_id, user_id, role)
          VALUES (${id}, ${userId}::uuid, 'member')
          ON CONFLICT (project_id, user_id) DO NOTHING
        `;
    }


  revalidatePath("/projects");
  return { ok: true };
}

export async function deleteProject(formData: FormData) {
  const currentUserId = await requireUserId();

  const id = Number(formData.get("id"));
  if (!id || Number.isNaN(id)) throw new Error("Invalid project id");

  // Verifica permissão (ex: só owner pode deletar)
  const membership = await sql`SELECT role FROM public.project_members WHERE project_id = ${id} AND user_id = ${currentUserId}::uuid`;
  if (membership[0]?.role !== 'owner') throw new Error("Apenas o dono pode excluir o projeto.");


  // O DELETE CASCADE na chave estrangeira no banco já deve lidar com isso,
  // mas explicitamente deletar os membros primeiro é uma boa prática de segurança.
  await sql`DELETE FROM public.project_members WHERE project_id = ${id}`;
  await sql`DELETE FROM public.projects WHERE id = ${id}`;

  revalidatePath("/projects");
  return { ok: true };
}