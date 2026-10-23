#!/bin/sh
set -e

# Seed opcional (apenas dados de teste): defina RUN_SEED=true no ambiente de QA.
# As migrations precisam estar aplicadas antes do seed.
if [ "$RUN_SEED" = "true" ]; then
  yarn migrate:deploy
  yarn mock
fi

# `yarn start` aplica as migrations pendentes e sobe o servidor
exec yarn start
