import { RefCycleDetector } from './ref_cycle_detector';
import { Constructor, Initializer, Ref } from './ref_base';
import { RefContainer } from './ref_container';
import { RefDispose } from './ref_dispose';
export declare class ResolveRef implements Ref {
    private refContainer;
    private refDispose;
    private refCycleDetector;
    private isSyncContext;
    constructor(refContainer: RefContainer, refDispose: RefDispose, refCycleDetector?: RefCycleDetector, isSyncContext?: boolean);
    private nextContext;
    private wrapBuilder;
    private initialize;
    private construct;
    resolve<T>(constructor: Constructor<T> | Initializer<T>): T | Promise<T>;
}
