"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapValueOrPromise = exports.isPromise = void 0;
function isPromise(v) {
    return 'then' in v && typeof v.then === 'function';
}
exports.isPromise = isPromise;
function mapValueOrPromise(create, transform) {
    const result = create();
    if (isPromise(result)) {
        return result.then(transform);
    }
    else {
        return transform(result);
    }
}
exports.mapValueOrPromise = mapValueOrPromise;
