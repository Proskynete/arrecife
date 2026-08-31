# Migrar a la 0.5.0

Un solo cambio incompatible: **`Toast` y sus piezas dejan de ser API pública.**
Todo lo demás de esta versión es aditivo y no pide tocar nada.

---

## Qué desaparece

| Deja de exportarse | Con qué se hace ahora |
| --- | --- |
| `Toast` | `toast()` |
| `ToastProvider` | `<Toaster />` |
| `ToastViewport` | `<Toaster />` |
| `ToastTitle` | la opción `title` |
| `ToastDescription` | la opción `description` |
| `ToastProps` | `ToastOptions` |

`ToastAction` **se queda**: es lo que se pasa en `action` cuando el aviso ofrece
deshacer, y sin él esa prop no se puede construir desde fuera.

## El porqué

`Toaster` estaba construido encima de `Toast` desde el día que entró, así que la
librería publicaba dos formas de mostrar lo mismo. La de abajo solo servía para
atar un aviso al ciclo de vida de un componente, y ninguno de los cinco proyectos
lo hace: el aviso siempre lo dispara la capa de datos, que es justo donde no hay
un componente cerca al que subirle un `useState`.

Dos caminos sin criterio que los separe no son flexibilidad, son una decisión que
hay que volver a tomar en cada sitio de uso. Se queda el que se usa.

## Cómo se migra

Antes:

```tsx
const [abierto, setAbierto] = useState(false);

<ToastProvider>
  <Toast open={abierto} onOpenChange={setAbierto} variant="success">
    <ToastTitle>Artículo publicado</ToastTitle>
    <ToastDescription>Ya está en el feed.</ToastDescription>
  </Toast>
  <ToastViewport />
</ToastProvider>

<Button onClick={() => setAbierto(true)}>Publicar</Button>
```

Después:

```tsx
// Una sola vez, lo más arriba posible del árbol.
<Toaster />

// Y en cualquier sitio, incluido fuera de React.
<Button onClick={() => toast.success('Artículo publicado', {
  description: 'Ya está en el feed.',
})}>
  Publicar
</Button>
```

Tres cosas que cambian de sitio al migrar:

1. **`<Toaster />` va UNA vez**, no uno por aviso. Dos montados pintan cada aviso
   dos veces: la lista vive en el módulo, no en la instancia.
2. **El estado se borra.** El `useState` que abría el aviso ya no hace falta, y
   quitarlo es la mitad del beneficio — era estado que subía por el árbol solo
   para llegar al proveedor.
3. **`variant` pasa a ser una función**: `toast.success(...)` y
   `toast.error(...)`; `toast(...)` a secas es el neutral.

Si necesitas cerrar un aviso a mano —el clásico «guardando…» que se reemplaza
cuando termina la petición—, `toast()` devuelve el id:

```ts
const id = toast('Guardando…', { duration: Infinity });
await guardar();
toast.dismiss(id);
toast.success('Guardado');
```

## Lo que NO cambia

`ToastAction` funciona igual, y `Toaster` acepta `duration` y `label` por si el
proyecto necesita otra duración o el landmark en otro idioma.

---

## Además, en esta versión

Nada de esto rompe nada, pero es lo que probablemente quieras usar al migrar:

- **`Nav`** pone los items a la derecha, añade el prompt `~/` y marca la sección
  actual entre corchetes. Si tu cabecera dependía de que los items fueran justo
  detrás de la marca, revisa cómo queda.
- **`Footer`** pone la firma CLI a la derecha, en la misma línea que los iconos.
- **`Logo`** acepta `conLema`, que añade el lema bajo el wordmark con una
  divisoria. Es la forma que toma la marca en la barra del sitio.
- **`Stat`** acepta `icon` y `description`.
- **`AvatarUpload`** es nuevo: avatar con control de subida, presentacional.
  Emite `onSelectFile(File)` y el `POST` lo hace tu proyecto.
- **`EventCalendar`** es nuevo: agenda con crear, editar y borrar.
- **`Accordion`** anima la altura, detrás de `motion-safe`. Ver
  [`decisiones.md`](decisiones.md) § 20.
