## Installation

Install the package:

```bash
npm i @ngry/store
```

Optionally, install [`@ngry/rx`](https://www.npmjs.com/package/@ngry/rx) for useful operators like `ofType`
and `task` and handy testing tools for Observables:

```bash
npm i @ngry/rx
```

## Documentation

- [Store](docs/store.md)
  - [Overview](docs/store.md#overview)
  - [Read operators](docs/store.md#read-operators)
    - [`select` operator](docs/store.md#select-operator)
    - [`query` operator](docs/store.md#query-operator)
    - [`get` operator](docs/store.md#get-operator)
  - [Write operators](docs/store.md#write-operators)
    - [`update` operator](docs/store.md#update-operator)
      - [`patch` operator](docs/store.md#patch-operator)
      - [`property` operator](docs/store.md#property-operator)
      - [`to` operator](docs/store.md#to-operator)
    - [`reset` operator](docs/store.md#reset-operator)
  - [Effects operators](docs/store.md#effects-operators)
    - [`fn` operator](docs/store.md#fn-operator)

## License

MIT
