# Archived sample

A TodoMVC implementation on Angular 7 (karma/protractor/tslint toolchain, all end-of-life). Updating requires a full Angular rewrite.

**Status:** archived — the source remains browsable, but the dependency manifests
(`package.json` / `package-lock.json`) were removed because their dependency
stacks are end-of-life and accounted for most of this repository's Dependabot
alerts. The sample is not expected to build as-is.

To restore the original manifests:

```sh
git log --diff-filter=D -- todomvc-app-angular/package.json   # find the removing commit
git checkout <that-commit>^ -- todomvc-app-angular/package.json
```

For maintained samples of the same ideas, see the [v2 samples](../v2/).
