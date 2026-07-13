# Archived sample

A Node/Express time-travel store sample (express 4.13, node-uuid — both long deprecated).

**Status:** archived — the source remains browsable, but the dependency manifests
(`package.json` / `package-lock.json`) were removed because their dependency
stacks are end-of-life and accounted for most of this repository's Dependabot
alerts. The sample is not expected to build as-is.

To restore the original manifests:

```sh
git log --diff-filter=D -- server-side-timetravel-store/package.json   # find the removing commit
git checkout <that-commit>^ -- server-side-timetravel-store/package.json
```

For maintained samples of the same ideas, see the [v2 samples](../v2/).
