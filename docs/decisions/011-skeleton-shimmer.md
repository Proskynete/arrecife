# § 11 · The skeleton does move

**Release:** 0.6.0 · [index](README.md)

---

**Document:** 1.4s linear shimmer.
**Code:** it had it still, with the written argument that «the system does not
animate».

The document wins. It is the THIRD and last motion exception, alongside the
button spinner and the side panel, and all three pass the same filter: they are
feedback about PROGRESS, not about state. A block that is still and a block that
will never load look exactly the same.

It sits behind `motion-safe`, so it switches itself off for anyone who asked for
less motion, and `still` turns it off by hand for long lists — twenty rows
sweeping at once are a strobe, not a load.

**Action in the document:** none, but it would help if the document said there
are three exceptions and which ones.

---
