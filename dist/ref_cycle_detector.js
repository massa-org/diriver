"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefCycleDetector = void 0;
const ref_base_1 = require("./ref_base");
class RefCycleDetector {
    constructor(resolveSet = new Set(), resolveChain = []) {
        this.resolveSet = resolveSet;
        this.resolveChain = resolveChain;
    }
    detectCycle(constructor) {
        if (this.resolveSet?.has(constructor)) {
            this.resolveChain.push(constructor);
            throw new ref_base_1.DiriverError('detect cycle in resolution process: ' +
                this.resolveChain.map((e) => e.name).join(' --> '));
        }
        this.resolveSet.add(constructor);
        this.resolveChain.push(constructor);
    }
    copy() {
        return new RefCycleDetector(new Set(this.resolveSet), [
            ...this.resolveChain,
        ]);
    }
}
exports.RefCycleDetector = RefCycleDetector;
