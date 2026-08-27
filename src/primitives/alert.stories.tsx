import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Nota, Pila } from '../../stories/utils.tsx';
import { Alert } from './alert.tsx';

const meta = { title: 'Primitivos/Alert', component: Alert } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variantes: Story = {
  render: () => (
    <>
      <Pila>
        <Alert variant="accent" title="Borrador guardado">
          Se guarda solo cada treinta segundos mientras escribes.
        </Alert>
        <Alert variant="success" title="Curso publicado">
          Ya es visible en cursos.eduardoalvarez.dev.
        </Alert>
        <Alert variant="warning" title="Falta la imagen de portada">
          Sin portada, la tarjeta del artículo se ve incompleta al compartirla.
        </Alert>
        <Alert variant="error" title="No se pudo publicar">
          El slug ya existe en otro artículo. Cámbialo y vuelve a intentar.
        </Alert>
      </Pila>
      <Nota>
        Fondo al 8 % del color semántico y borde al 22 %. El tono no puede vivir
        entero en un borde de 1px: cuatro avisos distinguidos por una línea son
        cuatro avisos que se confunden. El primero es ACENTO (✦), que es el
        informativo del sistema — no hay variante neutral, porque un aviso sin
        color es un párrafo.
      </Nota>
      <Nota>
        Los glifos son caracteres mono, nunca emoji: `✦ ✓ ! ✕`. Es la misma
        estética CLI del `❯` de la barra del bloque de código.
      </Nota>
      <Nota>
        El título va en `textPrimary` y no en el color del tono. En modo claro los
        semánticos están calibrados para pasar JUSTO sobre papel, así que sobre su
        propio tinte al 8 % caen a 4.11–4.40 y no pasan AA. El tinte es una
        superficie: encima va un token de texto, y el color semántico se queda en
        el borde y en el glifo, que es lo único que el documento pedía de él.
      </Nota>
    </>
  ),
};

export const ModoClaro: Story = {
  name: 'La verificación en modo claro',
  render: () => (
    <>
      <Pila>
        <Alert variant="accent" title="El 8 % está calculado sobre abismo" />
        <Alert variant="success" title="Sobre papel aguanta igual" />
        <Alert variant="warning" title="Cambia el modo en la toolbar" />
        <Alert variant="error" title="Este es el tinte más flojo de los ocho" />
      </Pila>
      <Nota>
        Medido, no estimado. Contraste del tinte contra el fondo de página:
        acento 1.149 oscuro / 1.106 claro, éxito 1.116 / 1.121, aviso 1.126 /
        1.109, error 1.067 / 1.120.
      </Nota>
      <Nota>
        El modo claro NO necesita una segunda tabla — aguanta igual o mejor que el
        oscuro. El punto flojo del sistema es `error` sobre abismo, 1.067, que se
        apoya entero en el borde al 22 %.
      </Nota>
    </>
  ),
};

export const Enfasis: Story = {
  name: 'Las dos recetas',
  render: () => (
    <>
      <Bloque titulo="sutil · 8 % de fondo, 22 % de borde">
        <Pila>
          <Alert variant="success" title="Ya estás dentro">
            Te llega un correo cada dos semanas. Nada más.
          </Alert>
        </Pila>
      </Bloque>

      <Bloque titulo="fuerte · 10 % de fondo, borde sólido">
        <Pila>
          <Alert variant="error" enfasis="fuerte" title="Ese correo no es válido">
            Revisa que tenga arroba y dominio.
          </Alert>
        </Pila>
      </Bloque>

      <Nota>
        La segunda receta es a propósito y está documentada: el aviso del
        formulario de newsletter va bajo el campo, así que necesita separarse del
        borde del input que tiene justo encima. No se unifican.
      </Nota>
    </>
  ),
};

export const SoloTitulo: Story = {
  name: 'Solo título',
  render: () => (
    <Pila>
      <Alert variant="success" title="Guardado" />
    </Pila>
  ),
};
