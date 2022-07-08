# Diriver

Is a simple dependency injection library that syntax inspired by riverpod

## Main pros

- no decorators
- no reflection, allow to use in plain js
- no boilerplate
- async dependencies
- dependency free

## Other features

- cycle detection
- disposable dependencies
- strongly typed

## Cons

- only class dependency
- only singletons

# Core concept

Main ideas behind this package is

- simplify and unify process of creation and usage of providers
- stay typesafe
- compatible with plain javascript
- no depend on package or runtime

# Basic types

`Provider` is just a class, and this class used as key to access and create provider from code.

`ref` - is just a container for all providers, you can create multiple containers for various use cases. But preffer to use single global `ref`. All created refs **MUST** be disposed

```js
import { GlobalRef } from 'diriver';
export const ref = new GlobalRef();

async function main() {
	await ref.dispose();
}
```

`ref.resolve` - main function of this package that allow to get access to provider and declare dependencies beetween providers

# Sync providers

Sync providers is provider that can be initialized syncroniosly it's declares through class with constructor that has zero or one `ref` argument. It can depend on other sync providers with usage of `ref.resolve` inside body of constructor

```js
class SyncProvider {
	constructor(ref: Ref) {
		this.depend1 = ref.resolve(SyncProvider1);
		this.depend2 = ref.resolve(SyncProvider2);
	}
}
```

# Async providers

Async providers as opposed to sync cannot be initialized syncroniosly for various reason like

- use connection to database
- use other async provider
- use configuration that resolved asyncroniosly
- ...

Async provider must implement single static function `initialize` that has zero or one `ref` argument. It also can depend on any providers through `ref.resolve` in initialize body

**Example**

```ts
class AsyncProvider {
	static async initialize(ref: Ref) {
		return new AsyncProvider();
	}
}
```

# Dispose

Any provider can be converted to disposable just by adding dispose method to it

```js
class DisposableProvider implements Disposable {
	async dispose() {
		// do some clean up
	}
}
```

Dispose of providers proceed when `ref.dispose` was called. Dispose has no any meaningfully order.
_Implements clause is not required but higly recomended for code readability_

# Value providers

What about providers for non class values like objects, arrays, etc?
Right now one solution for this is to just create class wrapper for it.

```js
class ValueProvider{
	public value = 42;
}
```

# Extension

Cause used provider is just a class we can easely create it dynamicly.

It can be used to create some generic provider, or to pass arguments to provider and stay typesafe

```ts
function ValueProvider<T>(value: T) {
	return class {
		public value: T = value;
	};
}

const ArrayProvider = ValueProvider([1, 2, 3]);
```
