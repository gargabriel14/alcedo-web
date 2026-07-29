/**
 * Sustituto de `server-only` para los tests.
 *
 * El paquete real lanza un error al importarse fuera de un componente de
 * servidor, que es exactamente lo que queremos en el build de Next y lo que
 * estorba en un test de Node. Aquí no hace nada.
 */
export {};
