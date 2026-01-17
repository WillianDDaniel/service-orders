import { sql } from "./lib/db";
import ServiceOrderManager from "./components/ServiceOrderManager"; // Ajuste o caminho conforme onde salvou o arquivo acima

type ServiceOrder = {
  id: number;
  name: string;
  price: string;
  description: string | null;
  status: "in_progress" | "blocked" | "finished" | "ready_for_dev" | "canceled";
  tag: "SEO" | "DESIGN" | "CONFIG" | "FEATURE";
  created_at: string;
};

export default async function Home() {
  // O fetch continua no Server Side para performance e SEO
  const rows = (await sql`
    SELECT id, name, price, description, status, tag, created_at
    FROM public.service_orders
    ORDER BY created_at DESC
  `) as unknown as ServiceOrder[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Passamos os dados para o componente Client que tem a interatividade */}
      <ServiceOrderManager orders={rows} />
    </div>
  );
}