"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = exists;
exports.ensureDir = ensureDir;
exports.copyDir = copyDir;
exports.writeTextFile = writeTextFile;
exports.writeJsonFile = writeJsonFile;
exports.readJsonFile = readJsonFile;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function exists(filePath) {
    try {
        await promises_1.default.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
async function ensureDir(dirPath) {
    await promises_1.default.mkdir(dirPath, { recursive: true });
}
async function copyDir(src, dest) {
    await ensureDir(dest);
    const entries = await promises_1.default.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path_1.default.join(src, entry.name);
        const destPath = path_1.default.join(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        }
        else {
            await promises_1.default.copyFile(srcPath, destPath);
        }
    }
}
async function writeTextFile(filePath, content) {
    await promises_1.default.writeFile(filePath, content, 'utf-8');
}
async function writeJsonFile(filePath, data) {
    await writeTextFile(filePath, JSON.stringify(data, null, 2));
}
async function readJsonFile(filePath) {
    const content = await promises_1.default.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}
