import { RefCycleDetector } from './ref_cycle_detector';
import {
	Constructor,
	DiriverError,
	Initializer,
	Provider,
	Ref,
} from './ref_base';
import { RefContainer } from './ref_container';
import { RefDispose } from './ref_dispose';

function isAsyncProvider<T>(provider: Provider<T>): provider is Initializer<T> {
	if ('initialize' in provider && typeof provider.initialize === 'function') {
		return true;
	}
	return false;
}

function validateConstructor<T>(constructor: Constructor<T>): never | void {
	if (constructor.length > 1) {
		throw new DiriverError(`Constructor accepts more than one ref argument`);
	}
}

function validateInitializer<T>(constructor: Initializer<T>): never | void {
	if (constructor.initialize.length > 1) {
		throw new DiriverError(
			`Initialize function accepts more than one ref argument`,
		);
	}
}

export class ResolveRef implements Ref {
	constructor(
		private refContainer: RefContainer,
		private refDispose: RefDispose,
		private refCycleDetector: RefCycleDetector = new RefCycleDetector(),
		private isSyncContext = false,
	) {
		//
	}

	// create new context for next resolve call
	private nextContext() {
		return new ResolveRef(
			this.refContainer,
			this.refDispose,
			this.refCycleDetector.copy(),
			this.isSyncContext,
		);
	}
	private wrapBuilder<T>(
		constructor: Provider<T>,
		create: { (nextRef: Ref): Promise<T> },
	): Promise<T>;
	private wrapBuilder<T>(
		constructor: Provider<T>,
		create: { (nextRef: Ref): T },
	): T;
	private wrapBuilder<T>(
		constructor: Provider<T>,
		create: { (nextRef: Ref): T | Promise<T> },
	) {
		this.refCycleDetector.detectCycle(constructor);
		return this.refContainer.getOrCreate(
			constructor,
			this.refDispose.registerDispose(() => create(this.nextContext())),
		);
	}

	private initialize<T>(constructor: Initializer<T>): Promise<T> {
		validateInitializer(constructor);

		// console.log(`Initialize instance of: ${constructor.name}`);

		return this.wrapBuilder(constructor, async function (next) {
			const value = await constructor.initialize(next);

			if (!(value instanceof constructor)) {
				throw new DiriverError(
					`initialize method must return object of parrent class but return '${value}'`,
				);
			}
			return value;
		});
	}

	private construct<T>(constructor: Constructor<T>): T {
		validateConstructor(constructor);

		return this.wrapBuilder(constructor, (next) => new constructor(next));
	}

	resolve<T>(constructor: Constructor<T> | Initializer<T>): T | Promise<T> {
		if (isAsyncProvider(constructor)) {
			if (this.isSyncContext)
				throw new DiriverError('Async provider used in sync context');
			return this.initialize(constructor);
		}
		this.isSyncContext = true;
		return this.construct(constructor);
	}
}
