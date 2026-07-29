import { describe, expect, it } from "vitest";
import { ProveedorSimulado } from "@/lib/pagos/simulado";
import { ErrorFirmaWebhook } from "@/lib/pagos/tipos";
import {
  DIAS_TOKEN_DESCARGA,
  fechaDentroDe,
  generarToken,
  LIMITE_DESCARGAS,
} from "@/lib/tienda/tokens";

const proveedor = new ProveedorSimulado();

function peticionSimulada(cuerpo: unknown, conCabecera = true): Request {
  return new Request("https://alcedo.test/api/pagos/webhook", {
    method: "POST",
    headers: conCabecera
      ? { "content-type": "application/json", "x-alcedo-simulado": "1" }
      : { "content-type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
}

describe("apertura del pago", () => {
  it("abre el checkout de un producto que existe", async () => {
    const checkout = await proveedor.crearCheckout("pdf-excel-autonomos");

    expect(checkout.url).toContain("/checkout/simulado");
    expect(checkout.url).toContain("sku=pdf-excel-autonomos");
    expect(checkout.referencia).toMatch(/^sim_/);
  });

  it("da una referencia distinta en cada intento", async () => {
    const uno = await proveedor.crearCheckout("pdf-excel-autonomos");
    const dos = await proveedor.crearCheckout("pdf-excel-autonomos");

    expect(uno.referencia).not.toBe(dos.referencia);
  });

  it("se niega a cobrar un producto inexistente", async () => {
    await expect(proveedor.crearCheckout("libro-que-no-existe")).rejects.toThrow();
  });
});

describe("verificación del webhook", () => {
  it("rechaza una petición sin la marca de simulación", async () => {
    const peticion = peticionSimulada({ id: "evt_1", tipo: "compra.completada" }, false);

    await expect(proveedor.verificarWebhook(peticion)).rejects.toBeInstanceOf(
      ErrorFirmaWebhook,
    );
  });

  it("rechaza un cuerpo sin id ni tipo", async () => {
    await expect(
      proveedor.verificarWebhook(peticionSimulada({ hola: "mundo" })),
    ).rejects.toBeInstanceOf(ErrorFirmaWebhook);
  });

  it("acepta un evento bien formado", async () => {
    const evento = await proveedor.verificarWebhook(
      peticionSimulada({ id: "evt_1", tipo: "compra.completada" }),
    );

    expect(evento.id).toBe("evt_1");
    expect(evento.tipo).toBe("compra.completada");
  });
});

describe("normalización del pedido", () => {
  it("ignora los eventos que no son una compra", async () => {
    const pedido = await proveedor.normalizarPedido({
      id: "evt_2",
      tipo: "cliente.actualizado",
      datos: {},
    });

    expect(pedido).toBeNull();
  });

  /**
   * El test que de verdad importa: aunque el evento venga manipulado con otro
   * importe, el pedido se guarda con el precio del catálogo del servidor.
   */
  it("coge el importe del catálogo y no del evento", async () => {
    const pedido = await proveedor.normalizarPedido({
      id: "evt_3",
      tipo: "compra.completada",
      datos: {
        referencia: "sim_abc",
        email: "cliente@ejemplo.com",
        sku: "pdf-excel-autonomos",
        importeCentimos: 1,
        precio: 0.01,
      },
    });

    expect(pedido).not.toBeNull();
    expect(pedido!.importeCentimos).toBe(2900);
    expect(pedido!.moneda).toBe("EUR");
    expect(pedido!.email).toBe("cliente@ejemplo.com");
  });

  it("revienta si el evento trae un sku desconocido", async () => {
    await expect(
      proveedor.normalizarPedido({
        id: "evt_4",
        tipo: "compra.completada",
        datos: { referencia: "sim_x", email: "a@b.com", sku: "inventado" },
      }),
    ).rejects.toThrow();
  });

  it("revienta si falta el correo", async () => {
    await expect(
      proveedor.normalizarPedido({
        id: "evt_5",
        tipo: "compra.completada",
        datos: { referencia: "sim_x", sku: "pdf-excel-autonomos" },
      }),
    ).rejects.toThrow();
  });
});

describe("tokens de descarga", () => {
  it("son largos y no se repiten", () => {
    const tokens = new Set(Array.from({ length: 500 }, generarToken));

    expect(tokens.size).toBe(500);
    for (const token of tokens) {
      expect(token.length).toBeGreaterThanOrEqual(40);
      // base64url: nada que haya que escapar en una URL.
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });

  it("caducan a los treinta días", () => {
    const vence = new Date(fechaDentroDe(DIAS_TOKEN_DESCARGA)).getTime();
    const esperado = Date.now() + DIAS_TOKEN_DESCARGA * 24 * 60 * 60 * 1000;

    expect(Math.abs(vence - esperado)).toBeLessThan(2000);
  });

  it("mantiene el límite de descargas que anuncia la web", () => {
    expect(LIMITE_DESCARGAS).toBe(5);
  });
});
