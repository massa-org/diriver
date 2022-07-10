export declare type Constructor<T> = {
    new (ref: Ref): T;
};
export declare type Initializer<T> = {
    new (...args: never[]): T;
    initialize(ref: Ref): Promise<T>;
};
export declare type Provider<T> = Initializer<T> | Constructor<T>;
export declare class DiriverError extends Error {
    constructor(message?: string);
}
export interface Ref {
    resolve<T>(constructor: Initializer<T>): Promise<T>;
    resolve<T>(constructor: Constructor<T>): T;
}
