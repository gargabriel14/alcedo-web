-- =============================================================================
-- Editorial Alcedo — esquema inicial de la tienda
--
-- CÓMO SE APLICA (una sola vez, y no hace falta instalar nada):
--   1. Entra en tu proyecto de Supabase.
--   2. Menú izquierdo → SQL Editor → New query.
--   3. Pega este fichero entero y pulsa Run.
--
-- Todo el acceso pasa por el servidor con la clave de servicio. Las políticas
-- RLS están para que, si algún día se usa la clave pública desde el navegador,
-- nadie pueda leer los pedidos de otro.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Lista de correo, con doble opt-in
-- -----------------------------------------------------------------------------
create table if not exists public.suscriptores (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  -- Lead magnet por el que se apuntó. Sirve para saber qué imán funciona.
  recurso text,
  confirmado boolean not null default false,
  token_confirmacion text unique,
  -- El token caduca: un enlace de confirmación eterno es un agujero.
  token_expira_en timestamptz,
  creado_en timestamptz not null default now(),
  confirmado_en timestamptz,
  baja_en timestamptz
);

create index if not exists suscriptores_email_idx on public.suscriptores (email);
create index if not exists suscriptores_token_idx on public.suscriptores (token_confirmacion);

-- -----------------------------------------------------------------------------
-- Pedidos
-- -----------------------------------------------------------------------------
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  -- Id de la transacción en la pasarela. UNIQUE es la última red de seguridad
  -- contra pedidos duplicados si fallara la idempotencia por evento.
  referencia_proveedor text not null unique,
  proveedor text not null default 'simulado',
  email text not null,
  sku text not null,
  -- Dinero siempre en céntimos y como entero.
  importe_centimos integer not null check (importe_centimos >= 0),
  moneda text not null default 'EUR',
  pais text,
  pagado_en timestamptz not null default now(),
  -- Token del enlace de descarga inmediata. Se puede regenerar desde la cuenta.
  token_descarga text not null unique,
  token_expira_en timestamptz not null,
  descargas_usadas integer not null default 0,
  creado_en timestamptz not null default now()
);

create index if not exists pedidos_email_idx on public.pedidos (lower(email));
create index if not exists pedidos_token_idx on public.pedidos (token_descarga);

-- -----------------------------------------------------------------------------
-- Registro de descargas
-- -----------------------------------------------------------------------------
create table if not exists public.descargas (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  fichero text not null,
  version text,
  descargado_en timestamptz not null default now()
);

create index if not exists descargas_pedido_idx on public.descargas (pedido_id);

-- -----------------------------------------------------------------------------
-- Idempotencia de webhooks
--
-- Las pasarelas reintentan. Sin esta tabla, un reintento crearía un pedido
-- duplicado y mandaría un segundo correo al cliente.
-- -----------------------------------------------------------------------------
create table if not exists public.eventos_webhook (
  id text primary key,
  tipo text not null,
  proveedor text not null default 'simulado',
  recibido_en timestamptz not null default now(),
  procesado_en timestamptz,
  error text
);

-- -----------------------------------------------------------------------------
-- Analítica propia (sin cookies ni scripts de terceros)
-- -----------------------------------------------------------------------------
create table if not exists public.eventos (
  id bigint generated always as identity primary key,
  nombre text not null check (
    nombre in (
      'lead_captado',
      'checkout_iniciado',
      'compra_completada',
      'descarga',
      'click_amazon'
    )
  ),
  propiedades jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now()
);

create index if not exists eventos_nombre_fecha_idx on public.eventos (nombre, creado_en desc);

-- -----------------------------------------------------------------------------
-- Seguridad
-- -----------------------------------------------------------------------------
alter table public.suscriptores enable row level security;
alter table public.pedidos enable row level security;
alter table public.descargas enable row level security;
alter table public.eventos_webhook enable row level security;
alter table public.eventos enable row level security;

-- Sin políticas para anon: nadie lee nada con la clave pública.
-- La clave de servicio, que solo vive en el servidor, se salta RLS.

-- Excepción: un cliente identificado por enlace mágico puede ver SUS pedidos.
drop policy if exists "cada cual ve sus pedidos" on public.pedidos;
create policy "cada cual ve sus pedidos"
  on public.pedidos
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "cada cual ve sus descargas" on public.descargas;
create policy "cada cual ve sus descargas"
  on public.descargas
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.pedidos p
      where p.id = descargas.pedido_id
        and lower(p.email) = lower(auth.jwt() ->> 'email')
    )
  );

-- -----------------------------------------------------------------------------
-- Almacenamiento privado de los ficheros vendidos
--
-- Bucket privado: no se sirve nada por URL pública. Cada descarga genera una URL
-- firmada de duración corta desde el servidor.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('productos', 'productos', false)
on conflict (id) do nothing;

-- Sin políticas de storage para anon ni authenticated: el acceso es siempre
-- desde el servidor con la clave de servicio, que es quien firma las URL.
