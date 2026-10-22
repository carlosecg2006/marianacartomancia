#!/usr/bin/env bash
# Testes do banco (pgTAP) num Postgres local descartável, sem Docker.
# Precisa de: postgresql-16, postgresql-16-pgtap, postgresql-16-cron.
# No CI os mesmos testes rodam no Postgres do Supabase (supabase test db).
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
PORTA="${PORTA:-54329}"
DIR="$(mktemp -d)"
chmod 777 "$DIR"

# O initdb não roda como root.
como() { if [ "$(id -u)" = 0 ]; then runuser -u postgres -- "$@"; else "$@"; fi; }

como "$PGBIN/initdb" -D "$DIR/dados" -U postgres --auth=trust -E UTF8 --locale=C.UTF-8 >/dev/null
cat >> "$DIR/dados/postgresql.conf" <<CONF
port = $PORTA
listen_addresses = ''
unix_socket_directories = '$DIR'
shared_preload_libraries = 'pg_cron'
cron.database_name = 'postgres'
timezone = 'UTC'
CONF
como "$PGBIN/pg_ctl" -D "$DIR/dados" -l "$DIR/log" -w start >/dev/null
trap 'como "$PGBIN/pg_ctl" -D "$DIR/dados" -m immediate stop >/dev/null; rm -rf "$DIR"' EXIT

sql() { psql -h "$DIR" -p "$PORTA" -U postgres -d postgres -v ON_ERROR_STOP=1 -q "$@"; }

sql -f "$RAIZ/supabase/local/shim.sql"
# O mesmo arquivo que vai para o SQL Editor do Supabase (migrations + seed).
sql -f "$RAIZ/supabase/instalar.sql"

[ -n "${SO_PREPARAR:-}" ] && { echo "socket: $DIR"; sleep "${SO_PREPARAR}"; exit 0; }
pg_prove -h "$DIR" -p "$PORTA" -U postgres -d postgres "$RAIZ"/supabase/tests/*.test.sql
