#!/bin/sh
set -e

# Aplica as migrations pendentes antes de subir o servidor
yarn migrate:deploy

# Seed opcional (apenas dados de teste): defina RUN_SEED=true no ambiente de QA
if [ "$RUN_SEED" = "true" ]; then
  yarn mock
fi

exec yarn start
