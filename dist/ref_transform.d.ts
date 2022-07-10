export declare function isPromise<T>(v: T | Promise<T>): v is Promise<T>;
export declare function mapValueOrPromise<T, R>(create: {
    (): T;
}, transform: {
    (v: T): R;
}): R;
export declare function mapValueOrPromise<T, R>(create: {
    (): Promise<T>;
}, transform: {
    (v: T): R;
}): Promise<R>;
