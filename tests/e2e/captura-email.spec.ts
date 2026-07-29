import { expect, test } from "@playwright/test";

/**
 * Captura de correo.
 *
 * Es el flujo del activo más valioso del negocio: la lista. Se comprueba que el
 * formulario valida, que da de alta y que **dice la verdad** sobre lo que va a
 * pasar después (confirmación por correo), sin prometer una descarga inmediata
 * que todavía no existe.
 */

const LANDING = "/recursos/plantilla-iva-trimestral-autonomos";

test("la landing del lead magnet explica qué te llevas", async ({ page }) => {
  await page.goto(LANDING);

  await expect(
    page.getByRole("heading", { name: "Plantilla de IVA trimestral para autónomos" }),
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Qué incluye" })).toBeVisible();
  await expect(page.getByLabel("Tu correo electrónico")).toBeVisible();
});

test("un correo válido queda apuntado y se anuncia la confirmación", async ({ page }) => {
  await page.goto(LANDING);

  const correo = `prueba-${Date.now()}@ejemplo.com`;
  await page.getByLabel("Tu correo electrónico").fill(correo);
  await page.getByRole("button", { name: "Descargar gratis" }).click();

  const aviso = page.getByRole("status");
  await expect(aviso).toBeVisible();
  await expect(aviso).toContainText("Casi está");
  await expect(aviso).toContainText(correo);
  // Doble opt-in: no se promete la descarga sin confirmar.
  await expect(aviso).toContainText("pulsa el enlace");
});

test("un correo inválido no pasa del navegador", async ({ page }) => {
  await page.goto(LANDING);

  const campo = page.getByLabel("Tu correo electrónico");
  await campo.fill("esto-no-es-un-correo");
  await page.getByRole("button", { name: "Descargar gratis" }).click();

  // La validación nativa impide el envío: seguimos en el formulario.
  await expect(campo).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("el enlace de confirmación caducado no deja a nadie colgado", async ({ page }) => {
  await page.goto("/confirmar/token-que-no-existe");

  await expect(
    page.getByRole("heading", { name: "Este enlace ya no sirve" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ver los recursos gratuitos" }),
  ).toBeVisible();
});
