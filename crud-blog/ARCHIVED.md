# Archived sample

A Node/Express CRUD blog sample (circa 2016). Its dependency stack (express 4.13, request, pmx, node-uuid, nodemailer 1.x) is deprecated and was generating the bulk of this repository's security alerts.

**Status:** archived — the source remains browsable, but the dependency manifests
(`package.json` / `package-lock.json`) were removed because their dependency
stacks are end-of-life and accounted for most of this repository's Dependabot
alerts. The sample is not expected to build as-is.

To restore the original manifests:

```sh
git log --diff-filter=D -- crud-blog/package.json   # find the removing commit
git checkout <that-commit>^ -- crud-blog/package.json
```

For maintained samples of the same ideas, see the [v2 samples](../v2/).
