"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefDispose = void 0;
const ref_transform_1 = require("./ref_transform");
const ref_base_1 = require("./ref_base");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDisposable(object) {
    return 'dispose' in object && typeof object.dispose === 'function';
}
class RefDispose {
    constructor() {
        this.disposeSet = new Set();
        this.disposed = false;
    }
    registerDispose(create) {
        return () => {
            return (0, ref_transform_1.mapValueOrPromise)(create, (result) => {
                if (this.disposed)
                    throw new ref_base_1.DiriverError('Ref used after dispose');
                if (isDisposable(result))
                    this.disposeSet.add(result);
                return result;
            });
        };
    }
    async dispose() {
        this.disposed = true;
        await Promise.all([...this.disposeSet.values()].map((e) => e.dispose()));
    }
}
exports.RefDispose = RefDispose;
