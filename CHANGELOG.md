# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.6.3](https://bitbucket.org/labor-digital/json-api/compare/v3.6.2...v3.6.3) (2020-07-20)


### Bug Fixes

* update dependencies ([fd6f79f](https://bitbucket.org/labor-digital/json-api/commit/fd6f79f36c3e69d7bdbb8e0c4473165edc8c699c))

### [3.6.2](https://bitbucket.org/labor-digital/json-api/compare/v3.6.1...v3.6.2) (2020-07-20)


### Bug Fixes

* update dependencies ([09f46f9](https://bitbucket.org/labor-digital/json-api/commit/09f46f978ac3ce2b03e7c129eb2545e1f961699b))

### [3.6.1](https://bitbucket.org/labor-digital/json-api/compare/v3.6.0...v3.6.1) (2020-06-19)


### Bug Fixes

* **JsonApi:** make sure different requests don't cancel each other out ([a884e76](https://bitbucket.org/labor-digital/json-api/commit/a884e76251e66e8a441aba6deec272b19878e5f3))

## [3.6.0](https://bitbucket.org/labor-digital/json-api/compare/v3.5.0...v3.6.0) (2020-05-22)


### Features

* deprecate JsonApiState + JsonApiStateList in favour of Resource and Collection ([0cd4e10](https://bitbucket.org/labor-digital/json-api/commit/0cd4e10baef3676fd8ce27ad5409427f7cfcfb6d))
* update dependencies ([36f3292](https://bitbucket.org/labor-digital/json-api/commit/36f3292b73e8241b2cdd35ebea8a0a91982b87a6))

## [3.5.0](https://bitbucket.org/labor-digital/json-api/compare/v3.4.2...v3.5.0) (2020-04-19)


### Features

* update dependencies ([9fd3c0f](https://bitbucket.org/labor-digital/json-api/commit/9fd3c0fe01d7884d81991856c9afe1f7657f8ec8))


### Bug Fixes

* **JsonApi:** make sure all 2xx response codes are valid not only 200 ([5571082](https://bitbucket.org/labor-digital/json-api/commit/5571082f657457e368ec25fa86fba0babbe144e9))

### [3.4.2](https://bitbucket.org/labor-digital/json-api/compare/v3.4.1...v3.4.2) (2020-03-23)

### [3.4.1](https://bitbucket.org/labor-digital/json-api/compare/v3.4.0...v3.4.1) (2020-03-23)

## 3.4.0 (2020-03-23)


### Features

* initial public release ([196ce3c](https://bitbucket.org/labor-digital/json-api/commit/196ce3cb9f0f906c7da595d9fc78a276b1cbcc1d))


### Bug Fixes

* fix missing dependencies in code after public release ([83518ad](https://bitbucket.org/labor-digital/json-api/commit/83518ad4eb2e947d5d9c0d335b321d4539c0d7ba))
* fix missing dependency after public release ([acbe0c3](https://bitbucket.org/labor-digital/json-api/commit/acbe0c388a34598778357ed426ab0821827f5ccf))

# [3.3.0] (2020-01-10)


### Features

* **JsonApi:** add server response information (status and headers) to the json api response object ([19e7c58])
* update dependencies ([77b65a9])



# [3.2.0] (2020-01-07)


### Features

* **State:** add new hasValue() method on the state object, to check for empty values ([ab2f56b])
* update dependencies ([6eb8527])



# [3.1.0] (2019-12-31)


### Features

* update dependencies ([e3bc00d])



# [3.0.0] (2019-12-30)


### Features

* remove translation helper ([e713caa])
* update dependencies ([c2d0d5a])


### BREAKING CHANGES

* translation helper removed + simplify file tree



## [2.0.2] (2019-12-29)



## [2.0.1] (2019-11-27)


### Bug Fixes

* remove jsonapi-normalizer dependency ([4736bb4])



# [2.0.0] (2019-11-27)


### Features

* simplify objects and use jsonapi-normalizer as de-serializer ([46dbf24])


### BREAKING CHANGES

* the deserialized objects may now look different than
before + changed public api of some objects



# [1.6.0] (2019-11-08)


### Features

* update dependencies ([53f99ac])



# [1.5.0] (2019-11-08)


### Features

* update dependencies ([17628a3])



# [1.4.0] (2019-10-25)


### Bug Fixes

* add error handling for JsonApi.getSingle() method when the json api response was inconsistent ([9f83ac9])


### Features

* update dependencies to latest version ([f5ab8e1])



# [1.3.0] (2019-10-15)


### Features

* better implementation for getSingle() ([eccd345])



# [1.2.0] (2019-09-26)


### Features

* add new features and better state handling ([2b2d261])



# 1.1.0 (2019-08-11)


### Bug Fixes

* remove doc generation from pipeline scripts ([7c8522a])
* remove doc generation from pipeline scripts ([8414fb6])
* remove tests from pipeline scripts ([7f3ecf6])


### Features

* initial commit ([fb1e57c])
