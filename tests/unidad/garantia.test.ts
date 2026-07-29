import { describe, expect, it } from "vitest";
import {
  DIAS_GARANTIA,
  estadoActualizaciones,
  estadoGarantia,
  MESES_ACTUALIZACION,
  textoGarantia,
} from "@/lib/garantia";

/**
 * La garantía y las actualizaciones son promesas por escrito en la ficha de cada
 * libro. Si este módulo se equivoca, el sitio anuncia una cosa y cumple otra, y
 * eso no da error por pantalla: hay que atraparlo aquí.
 */

const COMPRA = new Date("2026-03-01T10:00:00Z");

describe("garantía de devolución", () => {
  it("cubre el día completo del vencimiento, no la hora exacta de la compra", () => {
    const estado = estadoGarantia(COMPRA, COMPRA);

    expect(estado.vigente).toBe(true);
    // Quien compra a las 22:00 no pierde ese día: la ventana acaba al final del
    // día 15, así que quedan los 14 días prometidos y el resto del día de compra.
    expect(estado.vence.toISOString()).toBe("2026-03-15T23:59:59.999Z");
    expect(estado.diasRestantes).toBe(15);
  });

  it("sigue vigente en la última hora del último día", () => {
    const estado = estadoGarantia(COMPRA, new Date("2026-03-15T23:00:00Z"));

    expect(estado.vigente).toBe(true);
    expect(estado.diasRestantes).toBe(1);
    expect(textoGarantia(estado)).toBe("Te queda 1 día de garantía");
  });

  it("vence pasada la medianoche del último día", () => {
    const estado = estadoGarantia(COMPRA, new Date("2026-03-16T00:30:00Z"));

    expect(estado.vigente).toBe(false);
    expect(estado.diasRestantes).toBe(0);
    expect(textoGarantia(estado)).toBe("Garantía de devolución vencida");
  });

  it("usa el plazo anunciado en la web", () => {
    expect(DIAS_GARANTIA).toBe(14);
  });
});

describe("actualizaciones gratuitas", () => {
  it("duran doce meses desde la compra", () => {
    expect(MESES_ACTUALIZACION).toBe(12);

    const casiUnAno = estadoActualizaciones(COMPRA, new Date("2027-02-25T12:00:00Z"));
    expect(casiUnAno.vigente).toBe(true);
  });

  it("dejan de aplicar pasado el año", () => {
    const pasado = estadoActualizaciones(COMPRA, new Date("2027-03-05T12:00:00Z"));

    expect(pasado.vigente).toBe(false);
    expect(pasado.diasRestantes).toBe(0);
  });

  it("aguanta una compra en 29 de febrero sin romperse", () => {
    const bisiesto = new Date("2028-02-29T12:00:00Z");
    const estado = estadoActualizaciones(bisiesto, new Date("2029-01-01T12:00:00Z"));

    expect(estado.vigente).toBe(true);
    expect(Number.isNaN(estado.vence.getTime())).toBe(false);
  });
});
