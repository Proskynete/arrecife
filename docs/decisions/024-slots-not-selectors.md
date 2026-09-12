# § 24 · The composed parts are reached with a slot, not with a selector

**Release:** 0.6.0 · [index](README.md)

---

**Backlog point 10, and it was the only entry left from the original list.**
`ArticleCard` receives `tags` as strings and turns them into badges, so a project
with an E2E suite had no way to reach one: it selected by structure —
`article > div > span` — or by a style class. The second already broke the blog's
suite once, because a style class is not a contract; it changes when the style
changes.

**What stayed:** `tagAsChild`, a slot per part. The library keeps the classes and
the rule — a tag is a category pill, and that does not become negotiable — and
hands over the element and its attributes.

    tagAsChild={({ tag }) => <span data-testid={`tag-${tag}`}>{tag}</span>}

**The two alternatives, and why not.** Documenting the DOM shape as a stable
contract costs no code today and freezes the markup forever: every later refactor
becomes a breaking change, and nothing verifies the promise — it breaks without a
single check noticing. Putting `data-*` attributes in the library is cheaper to
consume and it is test scaffolding shipped in the product: an attribute nobody
renders for a reason, that cannot be removed once a suite depends on it.

**The shape is not new.** `linkAsChild` already had it in `Breadcrumb` and
`TableOfContents`, so this is one idiom for «the project supplies the element,
the library supplies the styling» and not a second one doing the same thing under
another name. It generalises: the next composed part that needs reaching gets a
`…AsChild` with the same signature.

**Where it was not needed.** `Nav` and `SidebarNav` already take their items as
children and export `NavItem` and `SidebarItem`, so the parts were reachable
already. `CourseCard` takes `meta` and `status` as nodes. `ArticleCard`'s tags
were the only genuinely closed part, which is why this is one prop and not a
sweep.

**Action in the document:** none. It is an API decision, not an identity one.

---
