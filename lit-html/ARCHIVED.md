# Archived sample

A vendored snapshot of the lit-html library source (circa 2017), kept for the early lit-html samples. The modern lit-html sample lives in v2/04-rocket-launcher-lit.

**Status:** archived — the source remains browsable, but the dependency manifests
(`package.json` / `package-lock.json`) were removed because their dependency
stacks are end-of-life and accounted for most of this repository's Dependabot
alerts. The sample is not expected to build as-is.

To restore the original manifests:

```sh
git log --diff-filter=D -- lit-html/package.json   # find the removing commit
git checkout <that-commit>^ -- lit-html/package.json
```

For maintained samples of the same ideas, see the [v2 samples](../v2/).
