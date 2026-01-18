// app/actions/User.ts

"use server";

import { sql } from "../lib/db";

export type NeonAuthUserRow = {
  id: string;
  email: string;
  name: string | null;
};

export async function searchUsersSmart(query: string): Promise<NeonAuthUserRow[]> {
  const q = String(query || "").trim();

  if (q.length < 1) return [];

  const like = `%${q}%`;

  // AQUI ESTAVA O ERRO: uma vírgula sobrando após o DESC na cláusula ORDER BY
  const rows = await sql`
    SELECT
      id,
      email,
      name
    FROM neon_auth."user"
    WHERE
      email ILIKE ${like}
      OR (name IS NOT NULL AND name ILIKE ${like})
      OR similarity(email, ${q}) > 0.2
      OR (name IS NOT NULL AND similarity(name, ${q}) > 0.2)
    ORDER BY
      GREATEST(
        similarity(email, ${q}),
        COALESCE(similarity(name, ${q}), 0)
      ) DESC
    LIMIT 5
  `;

  return rows as NeonAuthUserRow[];
}