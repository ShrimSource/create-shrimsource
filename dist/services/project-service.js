"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveProjectDir = resolveProjectDir;
exports.ensureProjectDir = ensureProjectDir;
exports.ensureShrimsourceMetaDir = ensureShrimsourceMetaDir;
const fs_1 = require("../utils/fs");
const files_1 = require("../constants/files");
const path_1 = __importDefault(require("path"));
function resolveProjectDir(templateName) {
    // MVP: just use template name as dir name in current cwd
    return path_1.default.resolve(process.cwd(), templateName);
}
async function ensureProjectDir(projectDir) {
    const dirExists = await (0, fs_1.exists)(projectDir);
    if (dirExists) {
        throw new Error(`Directory ${path_1.default.basename(projectDir)} already exists.`);
    }
    await (0, fs_1.ensureDir)(projectDir);
}
async function ensureShrimsourceMetaDir(projectDir) {
    const metaDir = path_1.default.join(projectDir, files_1.FILES.META_DIR);
    await (0, fs_1.ensureDir)(metaDir);
}
