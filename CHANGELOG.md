## [2.3.1](https://github.com/etienne-bechara/nestjs-redis/compare/v2.3.0...v2.3.1) (2021-07-01)


### Bug Fixes

* improve error and reconnection logging ([76d775c](https://github.com/etienne-bechara/nestjs-redis/commit/76d775c17789aba0533593b8f8336973fb1cf927))

# [2.3.0](https://github.com/etienne-bechara/nestjs-redis/compare/v2.2.2...v2.3.0) (2021-04-29)


### Features

* support float increment ([86f4f16](https://github.com/etienne-bechara/nestjs-redis/commit/86f4f16b0c519d509b2ad038e065c4c13fa0e42e))

## [2.2.2](https://github.com/etienne-bechara/nestjs-redis/compare/v2.2.1...v2.2.2) (2021-04-28)


### Bug Fixes

* add retry options to lockKey ([7cde70e](https://github.com/etienne-bechara/nestjs-redis/commit/7cde70e95f78c57a1293f28b0492033e49de0bc5))

## [2.2.1](https://github.com/etienne-bechara/nestjs-redis/compare/v2.2.0...v2.2.1) (2021-04-20)


### Bug Fixes

* allow to increase/decrease by custom amount ([c33e1e1](https://github.com/etienne-bechara/nestjs-redis/commit/c33e1e119ac0759317066c361494fd62d181ada2))

# [2.2.0](https://github.com/etienne-bechara/nestjs-redis/compare/v2.1.3...v2.2.0) (2021-04-20)


### Features

* add increment key with ttl ([7aa7940](https://github.com/etienne-bechara/nestjs-redis/commit/7aa7940515763d65561472c0fb625f6bffa7e1a6))

## [2.1.3](https://github.com/etienne-bechara/nestjs-redis/compare/v2.1.2...v2.1.3) (2021-04-20)


### Bug Fixes

* ci publish ([30bee67](https://github.com/etienne-bechara/nestjs-redis/commit/30bee675f2097564e52f6ec25595cffe903b26fe))
* ci publish ([8a4296d](https://github.com/etienne-bechara/nestjs-redis/commit/8a4296d5f9e36cfd861d8efa47f40321093ce08f))

## [2.1.2](https://github.com/etienne-bechara/nestjs-redis/compare/v2.1.1...v2.1.2) (2021-04-19)


### Bug Fixes

* better config organization ([ae0f842](https://github.com/etienne-bechara/nestjs-redis/commit/ae0f8424611069e438cb468b30c558f2a6f35c6c))

## [2.1.1](https://github.com/etienne-bechara/nestjs-redis/compare/v2.1.0...v2.1.1) (2021-04-16)


### Bug Fixes

* add isInitialized() method ([bbec6dc](https://github.com/etienne-bechara/nestjs-redis/commit/bbec6dc35078716feccea8bfe758a9ec00841b7c))

# [2.1.0](https://github.com/etienne-bechara/nestjs-redis/compare/v2.0.2...v2.1.0) (2021-04-16)


### Features

* add unlock key and do not change original value ([3fce656](https://github.com/etienne-bechara/nestjs-redis/commit/3fce65640e6d1ea5b1e1716ed69e182224314701))

## [2.0.2](https://github.com/etienne-bechara/nestjs-redis/compare/v2.0.1...v2.0.2) (2021-04-14)


### Bug Fixes

* port variable validation ([b738395](https://github.com/etienne-bechara/nestjs-redis/commit/b738395aea387ed23c762cf11ffb30a752255947))

## [2.0.1](https://github.com/etienne-bechara/nestjs-redis/compare/v2.0.0...v2.0.1) (2021-04-14)


### Bug Fixes

* allow missing variables and do not connect to host ([dfd5579](https://github.com/etienne-bechara/nestjs-redis/commit/dfd55794e64689a7d2a9bda3222d2821cf70ce09))

# [2.0.0](https://github.com/etienne-bechara/nestjs-redis/compare/v1.1.4...v2.0.0) (2021-04-09)


### Bug Fixes

* sync major ver with core ([6740eb2](https://github.com/etienne-bechara/nestjs-redis/commit/6740eb270bf5fcb6910b301c68fcc2f2429b0d44))


### BREAKING CHANGES

* sync major ver with core

## [1.1.4](https://github.com/etienne-bechara/nestjs-redis/compare/v1.1.3...v1.1.4) (2021-04-09)


### Bug Fixes

* sync core version ([84f5416](https://github.com/etienne-bechara/nestjs-redis/commit/84f54162ba02165006bf0c448f0a7c9c80778ac5))

## [1.1.3](https://github.com/etienne-bechara/nestjs-redis/compare/v1.1.2...v1.1.3) (2021-04-03)


### Bug Fixes

* add ncp dev dep ([eb8462d](https://github.com/etienne-bechara/nestjs-redis/commit/eb8462d4c725eb51930d5c155d84a9f582dbee48))
* replace npm with pnpm ([9ddf753](https://github.com/etienne-bechara/nestjs-redis/commit/9ddf7538f91e48d1a6b1e34d2df950d83b3b99f8))

## [1.1.2](https://github.com/etienne-bechara/nestjs-redis/compare/v1.1.1...v1.1.2) (2021-03-27)


### Bug Fixes

* add missing uuid dep ([08c8e0d](https://github.com/etienne-bechara/nestjs-redis/commit/08c8e0deec772941e2bf129803081bd4fd8e80a1))

## [1.1.1](https://github.com/etienne-bechara/nestjs-redis/compare/v1.1.0...v1.1.1) (2021-03-27)


### Bug Fixes

* add built-in injectable config (optional) ([1d80afd](https://github.com/etienne-bechara/nestjs-redis/commit/1d80afd02754499898e562d70fb06725947fdbf8))

# [1.1.0](https://github.com/etienne-bechara/nestjs-redis/compare/v1.0.3...v1.1.0) (2021-03-27)


### Features

* improve nestjs integration and add examples ([959ed8c](https://github.com/etienne-bechara/nestjs-redis/commit/959ed8c25af9447de204d82f5b0a88ddd0004e7e))

## [1.0.3](https://github.com/etienne-bechara/nestjs-redis/compare/v1.0.2...v1.0.3) (2021-01-18)


### Bug Fixes

* add missing dev dependency ([b650ee1](https://github.com/etienne-bechara/nestjs-redis/commit/b650ee1013fc1c4ed2168878d38840af44299d0c))
* update dependencies ([4b1c955](https://github.com/etienne-bechara/nestjs-redis/commit/4b1c955e1557512220cda0ad79f30c1403312f51))

## [1.0.2](https://github.com/etienne-bechara/nestjs-redis/compare/v1.0.1...v1.0.2) (2020-11-07)


### Bug Fixes

* adjust peer dependencies ([86591ee](https://github.com/etienne-bechara/nestjs-redis/commit/86591eea2dbdd4dd7a18761f03a240e43d4114fa))
* bump dependencies ([949ea65](https://github.com/etienne-bechara/nestjs-redis/commit/949ea65fe35b8e3de64e928e2d18fdb3c5246c8e))

## [1.0.1](https://github.com/etienne-bechara/nestjs-redis/compare/v1.0.0...v1.0.1) (2020-11-03)


### Bug Fixes

* module dependencie tree ([e9da304](https://github.com/etienne-bechara/nestjs-redis/commit/e9da304b0b9500c8d6fae2ccd650cbe39a934384))

# 1.0.0 (2020-11-03)


### Features

* initial version ([d996477](https://github.com/etienne-bechara/nestjs-redis/commit/d996477adc938dbeece7e2de72d4f5ce47fb0bfe))
