import { expect, test } from "@playwright/test";

/**
 * Compra completa, de la ficha a la descarga.
 *
 * Es el camino que genera el margen del negocio, así que se recorre entero y
 * contra el proveedor de pago simulado: mismo webhook, misma idempotencia, mismo
 * token de descarga y mismo límite que en producción.
 */

const FICHA = "/libro/excel-para-autonomos-en-espana";

test("la ficha deja claro por qué el PDF gana al Kindle", async ({ page }) => {
  await page.goto(FICHA);

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Excel para autónomos en España",
  );

  // El bloque que decide la venta.
  await expect(page.getByRole("heading", { name: "Elige tu formato" })).toBeVisible();
  await expect(page.getByText("Mejor opción:")).toContainText("el Kindle, no");

  // Y las promesas que sostienen el precio.
  await expect(page.getByText("Garantía de devolución de 14 días")).toBeVisible();
  await expect(page.getByText("Actualizaciones gratuitas 12 meses")).toBeVisible();
});

test("el índice y las preguntas frecuentes se despliegan", async ({ page }) => {
  await page.goto(FICHA);

  const capitulo = page.getByText("La factura que no te van a devolver");
  await capitulo.click();
  await expect(page.getByText("Numeración correlativa sin agujeros")).toBeVisible();

  const pregunta = page.getByText("¿Esto sustituye a mi asesor fiscal?");
  await pregunta.click();
  await expect(page.getByText("Sustituye a la carpeta de facturas")).toBeVisible();
});

test("comprar el PDF lleva a la descarga inmediata", async ({ page }) => {
  await page.goto(FICHA);

  await page.getByRole("link", { name: /Comprar el PDF Premium/ }).first().click();
  await expect(page).toHaveURL(/\/comprar\/pdf-excel-autonomos/);
  await expect(page.getByText("Pasarela en modo simulado")).toBeVisible();

  await page.getByRole("button", { name: /Pagar/ }).click();
  await expect(page).toHaveURL(/\/checkout\/simulado/);
  // Texto completo del aviso: «Pago simulado» a secas también aparece en el
  // anunciador de rutas de Next, que lee el título de la página.
  await expect(page.getByText("Aquí no se cobra dinero")).toBeVisible();

  const correo = `compra-${Date.now()}@ejemplo.com`;
  await page.getByLabel("Correo del comprador").fill(correo);
  await page.getByRole("button", { name: "Simular pago completado" }).click();

  // Post-compra: la descarga está aquí, no en el correo.
  await expect(page).toHaveURL(/\/checkout\/exito/);
  await expect(page.getByRole("heading", { name: "Gracias. Descárgalo ya" })).toBeVisible();

  const descargas = page.getByRole("link", { name: "Descargar" });
  await expect(descargas).toHaveCount(5);

  // El correo no se enseña entero.
  await expect(page.getByText(/co\*+@ejemplo\.com/)).toBeVisible();
});

test("el enlace de descarga responde y se agota a las cinco", async ({ page, request }) => {
  await page.goto(FICHA);
  await page.getByRole("link", { name: /Comprar el PDF Premium/ }).first().click();
  await page.getByRole("button", { name: /Pagar/ }).click();
  await page.getByLabel("Correo del comprador").fill(`limite-${Date.now()}@ejemplo.com`);
  await page.getByRole("button", { name: "Simular pago completado" }).click();
  await expect(page).toHaveURL(/\/checkout\/exito/);

  const enlace = await page
    .getByRole("link", { name: "Descargar" })
    .first()
    .getAttribute("href");

  expect(enlace).toBeTruthy();

  // Cinco descargas permitidas…
  for (let intento = 1; intento <= 5; intento++) {
    const respuesta = await request.get(enlace!);
    expect(respuesta.status(), `descarga ${intento}`).toBe(200);
  }

  // …y la sexta se corta, explicando cómo seguir.
  const agotada = await request.get(enlace!);
  expect(agotada.status()).toBe(429);
  expect(await agotada.text()).toContain("Entra en tu cuenta");
});

test("un token inventado no descarga nada", async ({ request }) => {
  const respuesta = await request.get("/api/descargar/token-falso");

  expect(respuesta.status()).toBe(404);
});
