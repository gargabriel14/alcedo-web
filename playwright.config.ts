import { defineConfig, devices } from "@playwright/test";

/**
 * Tests de los dos flujos que dan dinero.
 *
 * Se ejecutan contra el **build de producción**, no contra el servidor de
 * desarrollo: es el único que se parece a lo que verá un cliente. Y contra el
 * proveedor de pago simulado, así que se puede recorrer una compra entera sin
 * credenciales y sin mover un euro.
 *
 * Un solo navegador y un solo tamaño: móvil. Aquí el 75 % del tráfico llega de
 * TikTok y de Reels, así que si algo funciona solo en escritorio, no funciona.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "movil",
      use: { ...devices["Pixel 7"] },
    },
  ],

  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
