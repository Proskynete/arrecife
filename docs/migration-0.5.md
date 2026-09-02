# Migrating to 0.5.0

One breaking change: **`Toast` and its pieces stop being public API.** Everything
else in this version is additive and asks you to touch nothing.

> Note: the names in this document are the ones 0.5.0 published, in Spanish.
> From 0.6.0 onwards the whole API is in English — see
> [`migration-0.6.md`](migration-0.6.md).

---

## What disappears

| Stops being exported | What you do instead |
| --- | --- |
| `Toast` | `toast()` |
| `ToastProvider` | `<Toaster />` |
| `ToastViewport` | `<Toaster />` |
| `ToastTitle` | the `title` option |
| `ToastDescription` | the `description` option |
| `ToastProps` | `ToastOptions` |

`ToastAction` **stays**: it is what you pass in `action` when the notice offers an
undo, and without it that prop cannot be built from outside.

## Why

`Toaster` had been built on top of `Toast` from the day it landed, so the library
published two ways of showing the same thing. The lower one only served to bind a
notice to a component's lifecycle, and none of the five projects does that: the
notice is always fired by the data layer, which is exactly where there is no
component nearby to lift a `useState` onto.

Two paths with no criterion separating them are not flexibility, they are a
decision that has to be made again at every call site. The one that gets used
stays.

## How to migrate

Before:

```tsx
const [open, setOpen] = useState(false);

<ToastProvider>
  <Toast open={open} onOpenChange={setOpen} variant="success">
    <ToastTitle>Artículo publicado</ToastTitle>
    <ToastDescription>Ya está en el feed.</ToastDescription>
  </Toast>
  <ToastViewport />
</ToastProvider>

<Button onClick={() => setOpen(true)}>Publicar</Button>
```

After:

```tsx
// Once, as high in the tree as possible.
<Toaster />

// And anywhere, including outside React.
<Button onClick={() => toast.success('Artículo publicado', {
  description: 'Ya está en el feed.',
})}>
  Publicar
</Button>
```

Three things that move when you migrate:

1. **`<Toaster />` goes in ONCE**, not one per notice. Two mounted paint every
   notice twice: the list lives in the module, not in the instance.
2. **The state gets deleted.** The `useState` that opened the notice is no longer
   needed, and removing it is half the benefit — it was state travelling up the
   tree only to reach the provider.
3. **`variant` becomes a function**: `toast.success(...)` and `toast.error(...)`;
   a bare `toast(...)` is the neutral one.

If you need to close a notice by hand — the classic «guardando…» that gets
replaced when the request finishes — `toast()` returns the id:

```ts
const id = toast('Guardando…', { duration: Infinity });
await save();
toast.dismiss(id);
toast.success('Guardado');
```

## What does NOT change

`ToastAction` works the same, and `Toaster` accepts `duration` and `label` in
case the project needs another duration or the landmark in another language.

---

## Also in this version

None of this breaks anything, but it is probably what you want to use while
migrating:

- **`Nav`** puts the items on the right, adds the `~/` prompt and marks the
  current section in brackets. If your header relied on the items sitting right
  behind the brand, check how it looks.
- **`Footer`** puts the CLI signature on the right, on the same line as the
  icons.
- **`Logo`** accepts `conLema` (`withTagline` from 0.6.0), which adds the tagline
  under the wordmark with a divider. It is the shape the brand takes in the
  site's bar.
- **`Stat`** accepts `icon` and `description`.
- **`AvatarUpload`** is new: an avatar with an upload control, presentational. It
  emits `onSelectFile(File)` and your project does the `POST`.
- **`EventCalendar`** is new: a schedule with create, edit and delete.
- **`Accordion`** animates its height, behind `motion-safe`. See
  [`decisions.md`](decisions.md) § 20.
