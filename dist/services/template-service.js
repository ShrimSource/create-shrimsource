"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateMeta = getTemplateMeta;
exports.listTemplates = listTemplates;
exports.copyTemplateToProject = copyTemplateToProject;
const giget_1 = require("giget");
const registry_1 = require("../templates/registry");
const template_resolver_1 = require("./template-resolver");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = require("../utils/fs");
async function getTemplateMeta(name) {
    return await (0, registry_1.findTemplateByName)(name);
}
async function listTemplates() {
    return await (0, registry_1.getAllTemplates)();
}
async function copyTemplateToProject(template, targetDir) {
    const source = (0, template_resolver_1.resolveTemplateSource)(template);
    await (0, giget_1.downloadTemplate)(source, {
        dir: targetDir,
        force: true // Forced copy since we already verified the path is new
    });
    await postProcessTemplate(targetDir);
}
async function postProcessTemplate(targetDir) {
    // Clean up any metadata files that come from the monorepo templates base structure
    // but shouldn't be in the instantiated project.
    const filesToDelete = ['.gitignore', 'README.md', '.github'];
    for (const file of filesToDelete) {
        const filePath = path_1.default.join(targetDir, file);
        if (await (0, fs_1.exists)(filePath)) {
            // For recursive deletion if needed (e.g. .github folder)
            await promises_1.default.rm(filePath, { recursive: true, force: true });
        }
    }
}
