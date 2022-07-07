import { describe, expect, it } from 'vitest';
import { Ref } from '../src/index';
import { GlobalRef } from '../src/ref_global';

// The two tests marked with concurrent will be run in parallel
describe('cycle detection', () => {
	class SyncCycleA {
		constructor(ref: Ref) {
			ref.resolve(SyncCycleB);
		}
	}
	class SyncCycleB {
		constructor(ref: Ref) {
			ref.resolve(SyncCycleA);
		}
	}

	it('detect sync cycle', async () => {
		const ref = new GlobalRef();
		expect(() => ref.resolve(SyncCycleA)).toThrow('cycle');
		expect(() => ref.resolve(SyncCycleB)).toThrow('cycle');
	});

	class AC1 {
		static async initialize(ref: Ref) {
			await ref.resolve(AC1);
		}
	}
	class AC2 {
		static async initialize(ref: Ref) {
			await ref.resolve(AC2);
		}
	}

	it('detect async cycle', async () => {
		const ref = new GlobalRef();

		await expect(ref.resolve(AC1)).rejects.toThrow('cycle');
		await expect(ref.resolve(AC2)).rejects.toThrow('cycle');
	});
});

describe('resolve errors', () => {
	class ZeroArgumentSync {
		constructor() {}
	}
	class SingleArgumentSync {
		constructor(ref) {}
	}
	class TwoArgumentSync {
		constructor(one, two) {}
	}

	class AP {
		static async initialize(ref: Ref) {
			return new AP();
		}
	}

	class APSC {
		constructor(ref: Ref) {
			ref.resolve(AP);
		}
	}

	it('incorect argument count in resolveors', () => {
		const ref = new GlobalRef();
		expect(() => ref.resolve(ZeroArgumentSync)).not.toThrow();
		expect(() => ref.resolve(SingleArgumentSync)).not.toThrow();
		expect(() => ref.resolve(TwoArgumentSync as any)).toThrowError();
	});

	it('second resolve call return same object', async () => {
		const ref = new GlobalRef();
		const first = ref.resolve(SingleArgumentSync);
		const second = ref.resolve(SingleArgumentSync);
		expect(first).toBe(second);

		const firstPromise = ref.resolve(AP);
		const secondPromise = ref.resolve(AP);

		expect(firstPromise).toBe(secondPromise);

		const firstAsync = await ref.resolve(AP);
		const secondAsync = await ref.resolve(AP);

		expect(firstAsync).toBe(secondAsync);
	});

	it('use after dispose', async () => {
		const ref = new GlobalRef();
		ref.dispose();

		expect(() => ref.resolve(ZeroArgumentSync)).toThrow();
		await expect(ref.resolve(AP)).rejects.toThrow();
	});

	it('use async in sync context throw error', async () => {
		const ref = new GlobalRef();
		
		expect(() => ref.resolve(APSC)).toThrow();
	});
});
