"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveRef = void 0;
const ref_cycle_detector_1 = require("./ref_cycle_detector");
const ref_base_1 = require("./ref_base");
function isAsyncProvider(provider) {
    if ('initialize' in provider && typeof provider.initialize === 'function') {
        return true;
    }
    return false;
}
function validateConstructor(constructor) {
    if (constructor.length > 1) {
        throw new ref_base_1.DiriverError(`Constructor accepts more than one ref argument`);
    }
}
function validateInitializer(constructor) {
    if (constructor.initialize.length > 1) {
        throw new ref_base_1.DiriverError(`Initialize function accepts more than one ref argument`);
    }
}
class ResolveRef {
    constructor(refContainer, refDispose, refCycleDetector = new ref_cycle_detector_1.RefCycleDetector(), isSyncContext = false) {
        this.refContainer = refContainer;
        this.refDispose = refDispose;
        this.refCycleDetector = refCycleDetector;
        this.isSyncContext = isSyncContext;
        //
    }
    // create new context for next resolve call
    nextContext() {
        return new ResolveRef(this.refContainer, this.refDispose, this.refCycleDetector.copy(), this.isSyncContext);
    }
    wrapBuilder(constructor, create) {
        this.refCycleDetector.detectCycle(constructor);
        return this.refContainer.getOrCreate(constructor, this.refDispose.registerDispose(() => create(this.nextContext())));
    }
    initialize(constructor) {
        validateInitializer(constructor);
        // console.log(`Initialize instance of: ${constructor.name}`);
        return this.wrapBuilder(constructor, async function (next) {
            const value = await constructor.initialize(next);
            if (!(value instanceof constructor)) {
                throw new ref_base_1.DiriverError(`initialize method must return object of parrent class but return '${value}'`);
            }
            return value;
        });
    }
    construct(constructor) {
        validateConstructor(constructor);
        return this.wrapBuilder(constructor, (next) => new constructor(next));
    }
    resolve(constructor) {
        if (isAsyncProvider(constructor)) {
            if (this.isSyncContext)
                throw new ref_base_1.DiriverError('Async provider used in sync context');
            return this.initialize(constructor);
        }
        this.isSyncContext = true;
        return this.construct(constructor);
    }
}
exports.ResolveRef = ResolveRef;
