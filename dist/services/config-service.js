"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeProjectConfig = writeProjectConfig;
exports.readProjectConfig = readProjectConfig;
exports.hasProjectConfig = hasProjectConfig;
const files_1 = require("../constants/files");
const fs_1 = require("../utils/fs");
const path_1 = __importDefault(require("path"));
async function writeProjectConfig(projectDir, config) {
    const configPath = path_1.default.join(projectDir, files_1.FILES.CONFIG);
    await (0, fs_1.writeJsonFile)(configPath, config);
}
async function readProjectConfig(projectDir) {
    const configPath = path_1.default.join(projectDir, files_1.FILES.CONFIG);
    return (0, fs_1.readJsonFile)(configPath);
}
async function hasProjectConfig(projectDir) {
    const configPath = path_1.default.join(projectDir, files_1.FILES.CONFIG);
    return (0, fs_1.exists)(configPath);
}
