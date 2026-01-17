"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../lib/db";

export async function createServiceOrder(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "0").replace(",", ".");
  const status = String(formData.get("status") || "in_progress");
  const tag = String(formData.get("tag") || "FEATURE");
  const deliveryDate = formData.get("delivery_date")
    ? String(formData.get("delivery_date"))
    : null;

  const price = Number(priceRaw);
  if (!name) throw new Error("Name is required");
  if (Number.isNaN(price)) throw new Error("Invalid price");

  await sql`
    INSERT INTO public.service_orders
      (name, price, description, status, tag, delivery_date)
    VALUES
      (
        ${name},
        ${price},
        ${description || null},
        ${status}::service_order_status,
        ${tag}::service_order_tag,
        ${deliveryDate}
      )
  `;

  revalidatePath("/");
}

export async function deleteServiceOrder(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid id");

  await sql`DELETE FROM public.service_orders WHERE id = ${id}`;
  revalidatePath("/");
}

export async function updateServiceOrderStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "in_progress");

  if (!id) throw new Error("Invalid id");

  await sql`
    UPDATE public.service_orders
    SET status = ${status}::service_order_status
    WHERE id = ${id}
  `;

  revalidatePath("/");
}

export async function updateServiceOrder(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "0").replace(",", ".");
  const status = String(formData.get("status") || "in_progress");
  const tag = String(formData.get("tag") || "FEATURE");
  const deliveryDate = formData.get("delivery_date")
    ? String(formData.get("delivery_date"))
    : null;

  const price = Number(priceRaw);

  if (!id) throw new Error("Invalid id");
  if (!name) throw new Error("Name is required");
  if (Number.isNaN(price)) throw new Error("Invalid price");

  await sql`
    UPDATE public.service_orders
    SET
      name = ${name},
      price = ${price},
      description = ${description || null},
      status = ${status}::service_order_status,
      tag = ${tag}::service_order_tag,
      delivery_date = ${deliveryDate}
    WHERE id = ${id}
  `;

  revalidatePath("/");
}
