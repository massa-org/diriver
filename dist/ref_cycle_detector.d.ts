import { Provider } from './ref_base';
export declare class RefCycleDetector {
    private resolveSet;
    private resolveChain;
    constructor(resolveSet?: Set<Provider<unknown>>, resolveChain?: Provider<unknown>[]);
    detectCycle(constructor: Provider<unknown>): void | never;
    copy(): RefCycleDetector;
}
