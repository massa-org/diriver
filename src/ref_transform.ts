export function isPromise<T>(v: T | Promise<T>): v is Promise<T> {
	return 'then' in v && typeof v.then === 'function';
}

export function mapValueOrPromise<T, R>(
	create: { (): T },
	transform: { (v: T): R },
): R;
export function mapValueOrPromise<T, R>(
	create: { (): Promise<T> },
	transform: { (v: T): R },
): Promise<R>;

export function mapValueOrPromise<T, R>(
	create: { (): T | Promise<T> },
	transform: { (v: T): R },
): R | Promise<R> {
	const result = create();

	if (isPromise(result)) {
		return result.then(transform);
	} else {
		return transform(result);
	}
}
