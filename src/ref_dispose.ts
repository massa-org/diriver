import { mapValueOrPromise } from './ref_transform';
import { DiriverError } from './ref_base';

export interface Disposable {
	dispose(): Promise<void> | void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDisposable(object: any): object is Disposable {
	return 'dispose' in object && typeof object.dispose === 'function';
}

export class RefDispose {
	private disposeSet: Set<Disposable> = new Set();
	disposed: boolean = false;

	registerDispose<T>(create: { (): Promise<T> }): { (): Promise<T> };
	registerDispose<T>(create: { (): T }): { (): T };
	registerDispose<T>(create: { (): T | Promise<T> }): { (): T | Promise<T> } {
		return () => {
			return mapValueOrPromise(create, (result) => {
				if (this.disposed) throw new DiriverError('Ref used after dispose');
				if (isDisposable(result)) this.disposeSet.add(result);
				return result;
			});
		};
	}

	async dispose() {
		this.disposed = true;
		await Promise.all([...this.disposeSet.values()].map((e) => e.dispose()));
	}
}
