## Qué cambia

<!-- Una o dos frases. Qué se ve distinto después de esto. -->

## Por qué

<!-- El motivo, no el cambio. Si viene del Design System o del Manual de marca,
     cita la sección; si contradice al documento, dilo aquí y anótalo en
     docs/decisiones.md. -->

## Comprobaciones

- [ ] `pnpm lint` y `pnpm typecheck` pasan
- [ ] `pnpm test` pasa en los **dos** modos (un color solo falla en uno)
- [ ] Las stories cubren los estados nuevos, no solo el de reposo
- [ ] Si toca color: el contraste está **medido**, no estimado, y anotado
- [ ] Si toca `tokens.ts`: `pnpm check:tokens` sigue en verde
- [ ] Si contradice al documento: está en `docs/decisiones.md` con su motivo

## Capturas

<!-- En los dos modos si el cambio es visual. El switch está en la toolbar de
     Storybook. -->
