#!/usr/bin/env bash
# Decide si Vercel tiene que construir este commit.
#
#   exit 0  -> se salta el build
#   exit 1  -> se construye
#
# Lo configura `ignoreCommand` en vercel.json. Cada deploy se cobra, y un
# commit que solo mueve documentación no cambia un byte de lo que se sirve.
#
# La regla es una: **ante la duda, construir**. Un build de más cuesta
# centavos; uno de menos deja publicado algo viejo y no se nota hasta que
# alguien lo busca.
#
# Lo que está fuera de la lista, y por qué:
#
#   docs/llms.template.md   `scripts/build-llms.mjs` lo lee para generar
#                           llms.txt, que sí se publica. Por eso se ignoran
#                           las carpetas de docs una por una y no `docs/`
#                           entera.
#   stories/ y src/         son el contenido de Storybook, que es lo que se
#                           despliega.
#   scripts/                tsconfig los incluye, así que el build los
#                           typechequea.

set -uo pipefail

IGNORABLES='^(docs/(decisions|architecture|runbooks)/|docs/README\.md$|\.github/|AGENTS\.md$|CLAUDE\.md$|CHANGELOG\.md$|README\.md$)'

build() { echo "› construir: $1"; exit 1; }
skip()  { echo "› saltar: $1";    exit 0; }

command -v git >/dev/null 2>&1 || build "no hay git para comparar"

if [ -n "${VERCEL_GIT_PREVIOUS_SHA:-}" ] && git cat-file -e "${VERCEL_GIT_PREVIOUS_SHA}^{commit}" 2>/dev/null; then
  RANGE="${VERCEL_GIT_PREVIOUS_SHA}...HEAD"
elif git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  RANGE="HEAD^...HEAD"
else
  build "no se pudo determinar qué cambió"
fi

CHANGED=$(git diff --name-only "$RANGE" 2>/dev/null)
[ -z "$CHANGED" ] && build "el diff volvió vacío, algo no cuadra"

RELEVANTES=$(echo "$CHANGED" | grep -Ev "$IGNORABLES" || true)

if [ -z "$RELEVANTES" ]; then
  skip "$(echo "$CHANGED" | wc -l | tr -d ' ') archivo(s), todos documentación"
fi

build "$(echo "$RELEVANTES" | head -3 | tr '\n' ' ')"
