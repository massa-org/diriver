import { Constructor, Initializer, Ref } from './ref_base';
export declare class GlobalRef implements Ref {
    private refDispose;
    private refContainer;
    dispose(): Promise<void>;
    resolve<T>(constructor: Initializer<T>): Promise<T>;
    resolve<T>(constructor: Constructor<T>): T;
}
