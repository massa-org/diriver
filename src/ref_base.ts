export type Constructor<T> = { new (ref: Ref): T };
export type Initializer<T> = {
	new (...args: never[]): T;
	initialize(ref: Ref): Promise<T>;
};

export type Provider<T> = Initializer<T> | Constructor<T>;

export class DiriverError extends Error {
	constructor(message?: string) {
		super(message);
	}
}

export interface Ref {
	resolve<T>(constructor: Initializer<T>): Promise<T>;
	resolve<T>(constructor: Constructor<T>): T;
}
