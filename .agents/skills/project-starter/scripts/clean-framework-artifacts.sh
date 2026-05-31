#!/usr/bin/env bash
set -euo pipefail

# Limpa artefatos padrão de scaffold Vite/React para reduzir ruído inicial.
# Seguro para reexecução (idempotente).

FILES=(
  "src/assets/react.svg"
  "src/App.css"
  "src/index.css"
)

DIRS=(
  "src/assets"
)

for f in "${FILES[@]}"; do
  if [[ -f "$f" ]]; then
    rm -f "$f"
    echo "removed file: $f"
  fi
done

for d in "${DIRS[@]}"; do
  if [[ -d "$d" ]] && [[ -z "$(ls -A "$d")" ]]; then
    rmdir "$d"
    echo "removed empty dir: $d"
  fi
done

echo "cleanup complete"
