"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (message) => console.log(`ℹ ${message}`),
    success: (message) => console.log(`✔ ${message}`),
    warn: (message) => console.warn(`⚠ ${message}`),
    error: (message) => console.error(`✖ ${message}`)
};
