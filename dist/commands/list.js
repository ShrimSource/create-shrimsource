"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runListCommand = runListCommand;
const template_service_1 = require("../services/template-service");
const init_1 = require("./init");
const prompts_1 = require("@inquirer/prompts");
async function runListCommand() {
    const templates = await (0, template_service_1.listTemplates)();
    const choices = templates.map(t => {
        let sourceStr = '';
        if (t.source.type === 'github') {
            sourceStr = `[GitHub] ${t.source.repo}${t.source.subdir ? `/${t.source.subdir}` : ''}`;
        }
        else if (t.source.type === 'file') {
            sourceStr = `[Local] ${t.source.dir}`;
        }
        else {
            sourceStr = `[Unknown]`;
        }
        return {
            name: `${t.name} (${t.capabilities.join(', ')})`,
            value: t.name,
            description: `${t.description}\nSource: ${sourceStr}`
        };
    });
    try {
        const selectedTemplateName = await (0, prompts_1.select)({
            message: 'Select a template to initialize:',
            choices: choices,
            pageSize: 10
        });
        console.log(`\nStarting initialization for ${selectedTemplateName}...`);
        await (0, init_1.runInitCommand)(selectedTemplateName);
    }
    catch (e) {
        if (e.name === 'ExitPromptError') {
            process.exit(0);
        }
        else {
            throw e;
        }
    }
}
