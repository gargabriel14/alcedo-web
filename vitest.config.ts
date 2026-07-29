import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Tests de lógica.
 *
 * Entorno de Node, no de navegador: aquí no se prueban componentes, se prueba lo
 * que pasa cuando alguien paga. Los flujos de interfaz están en Playwright.
 *
 * `server-only` se sustituye por un módulo vacío: es un centinela pensado para
 * que el build de Next avise si un módulo de servidor acaba en el navegador, y
 * fuera de Next no tiene sentido.
 */
export default defineConfig({
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "./tests/dobles/server-only.ts"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unidad/**/*.test.ts"],
    globals: false,
  },
});
