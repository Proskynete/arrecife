# § 41 · `ref` is a prop in React 19, and the types said otherwise

**Release:** 0.8.0 · [index](README.md)

---

**System rule:** the pattern says `export function`, not `forwardRef`, because
«React 19 passes `ref` as just another prop». The types had not followed.

**What stayed:** `Input`, `Textarea`, `Label` and `DateField` declare their props
with `ComponentProps` instead of `ComponentPropsWithoutRef`.

`ComponentPropsWithoutRef` is what React 18 required. There, `ref` was not a prop
— it arrived through `forwardRef` — and a type including it promised something
the component could not deliver. In 19 the `...props` spread forwards it like any
other attribute, so the components already worked; the type was the only thing
still describing the old world.

**Which is the worse half of the two failure modes.** A behaviour that is missing
gets found and fixed. A type that forbids something the runtime allows gets
WORKED AROUND, and the workaround outlives the reason: `blog-content-manager`'s
Giphy dialog focuses its search field 50 ms after opening, because Radix claims
focus first, and to get at the input it took the `ref` on the wrapping `div` and
reached in with a `querySelector`. That is a detour around a type, sitting in a
project, looking like a detour around a behaviour.

**Four and not all of them.** The scope is the primitives that wrap a native
control you focus programmatically, which is where the need is real and where the
bug was found. Every other component in the repo still declares
`ComponentPropsWithoutRef`, and a sweep of forty files to make `<caption>`
ref-able would be a rename with no consumer behind it. When one appears, the
change is one word.

**Action in the document:** none. It is a type, not an identity decision.

---
