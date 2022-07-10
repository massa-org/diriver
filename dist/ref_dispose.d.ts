export interface Disposable {
    dispose(): Promise<void> | void;
}
export declare class RefDispose {
    private disposeSet;
    disposed: boolean;
    registerDispose<T>(create: {
        (): Promise<T>;
    }): {
        (): Promise<T>;
    };
    registerDispose<T>(create: {
        (): T;
    }): {
        (): T;
    };
    dispose(): Promise<void>;
}
