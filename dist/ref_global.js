"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalRef = void 0;
const ref_container_1 = require("./ref_container");
const ref_dispose_1 = require("./ref_dispose");
const ref_resolver_1 = require("./ref_resolver");
class GlobalRef {
    constructor() {
        this.refDispose = new ref_dispose_1.RefDispose();
        this.refContainer = new ref_container_1.RefContainer();
    }
    async dispose() {
        await this.refDispose.dispose();
    }
    resolve(constructor) {
        const ref = new ref_resolver_1.ResolveRef(this.refContainer, this.refDispose);
        return ref.resolve(constructor);
    }
}
exports.GlobalRef = GlobalRef;
