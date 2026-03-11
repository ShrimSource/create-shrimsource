"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInitCommand = runInitCommand;
const template_service_1 = require("../services/template-service");
const project_service_1 = require("../services/project-service");
const env_service_1 = require("../services/env-service");
const config_service_1 = require("../services/config-service");
const logger_1 = require("../utils/logger");
const prompt_1 = require("../utils/prompt");
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
async function runInitCommand(templateName) {
    try {
        // 2. Figure out which template to use
        let selectedTemplateName = templateName;
        if (!selectedTemplateName) {
            const templates = await (0, template_service_1.listTemplates)();
            const options = templates.map(t => ({
                value: t.name,
                label: `${t.name} (${t.description})`
            }));
            selectedTemplateName = await (0, prompt_1.askSelect)('Which template would you like to use?', options);
        }
        const template = await (0, template_service_1.getTemplateMeta)(selectedTemplateName);
        if (!template) {
            logger_1.logger.error(`Template '${selectedTemplateName}' not found in registry.`);
            return;
        }
        // 1. Resolve and create directory
        const projectDir = (0, project_service_1.resolveProjectDir)(template.name);
        logger_1.logger.info(`Creating project in ${projectDir}...`);
        await (0, project_service_1.ensureProjectDir)(projectDir);
        // 2. Copy template
        logger_1.logger.info(`Copying template '${template.name}'...`);
        await (0, template_service_1.copyTemplateToProject)(template, projectDir);
        // 3. Ensure .shrimsource exists
        await (0, project_service_1.ensureShrimsourceMetaDir)(projectDir);
        // 4. Prompt ENV based on capabilities
        logger_1.logger.info(`Configuring environment for capabilities: ${template.capabilities.join(', ')}`);
        const { values, providers } = await (0, env_service_1.promptEnvValues)(template.capabilities);
        // 5. Write .env
        await (0, env_service_1.writeEnvFile)(projectDir, values);
        logger_1.logger.success('.env generated');
        // 6. Write config
        await (0, config_service_1.writeProjectConfig)(projectDir, {
            template: template.name,
            capabilities: template.capabilities,
            providers
        });
        logger_1.logger.success('.shrimsource/config.json written');
        // 7. Success output
        logger_1.logger.success(`\n✔ Shrimsource project created\n`);
        // 8. Auto-install and Run
        const wantInstall = await (0, prompt_1.askConfirm)('Would you like to run `npm install` automatically?');
        if (wantInstall) {
            logger_1.logger.info('Installing dependencies...');
            await runCommandInteractive('npm', ['install'], projectDir);
            logger_1.logger.success('Dependencies installed.\n');
            const wantRun = await (0, prompt_1.askConfirm)('Would you like to start the agent now (`npm run agent`)?');
            if (wantRun) {
                logger_1.logger.info('Starting agent...');
                await runCommandInteractive('npm', ['run', 'agent'], projectDir);
                return; // Process finishes after running
            }
        }
        logger_1.logger.info(`Next steps:\n`);
        logger_1.logger.info(`  cd ${path_1.default.basename(projectDir)}`);
        if (!wantInstall)
            logger_1.logger.info(`  npm install`);
        logger_1.logger.info(`  npm run agent`);
    }
    catch (error) {
        logger_1.logger.error(`Initialization failed: ${error.message}`);
    }
}
function runCommandInteractive(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(command, args, {
            cwd,
            stdio: 'inherit',
            // Needed on Windows particularly for npm commands
            shell: true
        });
        child.on('close', (code) => {
            if (code === 0)
                resolve();
            else
                reject(new Error(`Command ${command} failed with exit code ${code}`));
        });
        child.on('error', (err) => reject(err));
    });
}
