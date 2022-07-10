"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefContainer = void 0;
const ref_transform_1 = require("./ref_transform");
class RefContainer {
    constructor() {
        this.cacheContainer = new Map();
    }
    getOrCreate(constructor, create) {
        if (this.cacheContainer.has(constructor)) {
            // console.log(`Return from cache instance of : ${constructor.name}`);
            return this.cacheContainer.get(constructor);
        }
        const result = create();
        if ((0, ref_transform_1.isPromise)(result)) {
            this.cacheContainer.set(constructor, result);
            return result;
        }
        this.cacheContainer.set(constructor, result);
        return result;
    }
}
exports.RefContainer = RefContainer;
