"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTemplates = getAllTemplates;
exports.findTemplateByName = findTemplateByName;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const REGISTRY_URL = 'https://raw.githubusercontent.com/ShrimSource/shrimsource-templates/main/registry.json';
// Caching the registry in memory after first fetch during a CLI run
let registryCache = null;
async function getAllTemplates() {
    if (registryCache) {
        return registryCache;
    }
    // 🕵️‍♂️ Local Debug Mode
    if (process.env.SHRIM_LOCAL_REGISTRY) {
        try {
            // It expects the path to a json file in the environment variable
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const data = await fs.readFile(process.env.SHRIM_LOCAL_REGISTRY, 'utf-8');
            registryCache = JSON.parse(data);
            return registryCache;
        }
        catch (error) {
            throw new Error(`Failed to load local registry from ${process.env.SHRIM_LOCAL_REGISTRY}: ${error.message}`);
        }
    }
    try {
        // dynamic import of node-fetch isn't strictly necessary in Node 18+ since `fetch` is native,
        // but we rely on the native `fetch` available in modern Node.js versions.
        const response = await (0, cross_fetch_1.default)(REGISTRY_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch registry: ${response.statusText}`);
        }
        const data = await response.json();
        registryCache = data;
        return registryCache;
    }
    catch (error) {
        throw new Error(`Could not load template registry from GitHub: ${error.message}`);
    }
}
async function findTemplateByName(name) {
    const registry = await getAllTemplates();
    return registry.find(t => t.name === name);
}
