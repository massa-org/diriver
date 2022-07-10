import { Provider } from './ref_base';
export declare class RefContainer {
    private cacheContainer;
    getOrCreate<T>(constructor: Provider<T>, create: {
        (): Promise<T>;
    }): Promise<T>;
    getOrCreate<T>(constructor: Provider<T>, create: {
        (): T;
    }): T;
}
