import { DiriverError, Provider } from './ref_base';

export class RefCycleDetector {
	constructor(
		private resolveSet: Set<Provider<unknown>> = new Set(),
		private resolveChain: Provider<unknown>[] = [],
	) {}

	detectCycle(constructor: Provider<unknown>): void | never {
		if (this.resolveSet?.has(constructor)) {
			this.resolveChain.push(constructor);
			throw new DiriverError(
				'detect cycle in resolution process: ' +
					this.resolveChain.map((e) => e.name).join(' --> '),
			);
		}

		this.resolveSet.add(constructor);
		this.resolveChain.push(constructor);
	}

	copy() {
		return new RefCycleDetector(new Set(this.resolveSet), [
			...this.resolveChain,
		]);
	}
}
