# § 8 · There was no danger button

**Release:** 0.6.0 · **Status:** Reversed in § 21 · [index](README.md)

---

> **This rule no longer holds.** `Button` has `destructive` and
> `destructiveOutline` since 0.6.0. The entry stays because the file's contract
> is that a reversal comes with a new argument and not by forgetting — the new
> argument is in § 21. What survives of this one is the half that was right:
> inside an `AlertDialog` the confirm button is still not red.

What it said, and why it said it: none of the document's 987 lines shows a
destructive button, and the system's error lives in the alerts and in field
validation. The `danger` variant that was in the code was deleted, and the exit
was written into the entry — «if the blog admin needs a real destructive button,
it goes into the document **first** and in here second».

That is exactly the road it came back by. The palette was decided outside the
code, and then the variant was written.

**Action in the document:** none — § 21 carries it. This entry is kept for the
route it records, not for anything the document still owes.

---
