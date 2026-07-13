# Archived sample

An ES6 full-stack boilerplate (express 4.13, request, log4js 1.x, tingodb — all deprecated).

**Status:** archived — the source remains browsable, but the dependency manifests
(`package.json` / `package-lock.json`) were removed because their dependency
stacks are end-of-life and accounted for most of this repository's Dependabot
alerts. The sample is not expected to build as-is.

To restore the original manifests:

```sh
git log --diff-filter=D -- vanilla-es6-boilerplate-project/package.json   # find the removing commit
git checkout <that-commit>^ -- vanilla-es6-boilerplate-project/package.json
```

For maintained samples of the same ideas, see the [v2 samples](../v2/).
