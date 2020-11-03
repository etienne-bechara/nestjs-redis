# NPM Package Template

This repository offers a template to create TypeScript base NPM packages and automatically publish it using GitHub actions, as well as generate Changelog and Release Notes according to Semantic Versioning.

## General Usage

1\. Clone this repository as a template to reduce commits to 1.

2\. Checkout to a `master` branch in order to enable pre-configured GitHub Actions.

```
git checkout -b master
```

3\. Update `package.json` fields `name` and `repository`.

4\. Add you NPM token with write access to repository secret `NPM_TOKEN`.

5\. Develop your code in TypeScript making sure that `*.ts` files are inside `/source`.

6\. Whenever you merge or push changes into `master` the publishing pipeline will trigger.


## Custom Usage

### NestJS

To build extensions for the `@bechara/nestjs-core` package, install the extra bundle and dev dependencies:

```
npm i @bechara/nestjs-core
npm i -D @nestjs/core @nestjs/common @nestjs/platform-express @nestjs/testing
```
