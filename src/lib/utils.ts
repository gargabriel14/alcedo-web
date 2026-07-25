import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind resolviendo conflictos (la última gana). */
export function cn(...clases: ClassValue[]): string {
  return twMerge(clsx(clases));
}

/**
 * Precio en formato español: `29 €`, `24,50 €`.
 * Los céntimos solo aparecen si existen, que es como los escribe una editorial.
 */
export function formatearPrecio(euros: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(euros) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(euros);
}

/** `2026-03-14` → `14 de marzo de 2026`. */
export function formatearFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
