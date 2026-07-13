# Archived sample

An AWS Lambda (Claudia.js 1.x, aws-sdk v2) port of the CRUD blog sample. Claudia 1.x and aws-sdk v2 are end-of-life.

**Status:** archived — the source remains browsable, but the dependency manifests
(`package.json` / `package-lock.json`) were removed because their dependency
stacks are end-of-life and accounted for most of this repository's Dependabot
alerts. The sample is not expected to build as-is.

To restore the original manifests:

```sh
git log --diff-filter=D -- crud-blog-lambda/package.json   # find the removing commit
git checkout <that-commit>^ -- crud-blog-lambda/package.json
```

For maintained samples of the same ideas, see the [v2 samples](../v2/).
