# AGENTS.md

Las reglas de este repositorio están en **[CLAUDE.md](CLAUDE.md)**, que es el
fichero canónico. Este existe porque otros agentes buscan `AGENTS.md` por
convención.

Antes de escribir una línea, lee CLAUDE.md entero. En resumen, lo que más caro
sale romper:

1. El precio nunca llega desde el cliente: llega un SKU y el importe sale del
   catálogo del servidor.
2. Nadie importa un SDK de pago fuera de `src/lib/pagos/`.
3. No se publica ninguna reseña que no exista, ni `aggregateRating` sin
   valoraciones reales.
4. Los plazos de garantía y actualizaciones se leen de `src/lib/garantia.ts`,
   nunca se escriben a mano.
5. Código y comentarios en español; interfaz en español de España.
6. `pnpm verificar` en verde antes de dar nada por terminado.
