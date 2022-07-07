import { Provider } from './ref_base';
import { isPromise } from './ref_transform';

export class RefContainer {
	private cacheContainer: Map<Provider<unknown>, unknown> = new Map();

	getOrCreate<T>(
		constructor: Provider<T>,
		create: { (): Promise<T> },
	): Promise<T>;
	getOrCreate<T>(constructor: Provider<T>, create: { (): T }): T;

	getOrCreate<T>(
		constructor: Provider<T>,
		create: { (): T | Promise<T> },
	): T | Promise<T> {
		if (this.cacheContainer.has(constructor)) {
			// console.log(`Return from cache instance of : ${constructor.name}`);
			return this.cacheContainer.get(constructor) as T | Promise<T>;
		}

		const result = create();
		if (isPromise(result)) {
			this.cacheContainer.set(constructor, result);
			return result;
		}
		this.cacheContainer.set(constructor, result);
		return result;
	}
}
