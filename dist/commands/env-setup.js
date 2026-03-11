"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEnvSetupCommand = runEnvSetupCommand;
const config_service_1 = require("../services/config-service");
const env_service_1 = require("../services/env-service");
const logger_1 = require("../utils/logger");
async function runEnvSetupCommand() {
    const currentDir = process.cwd();
    try {
        const hasConfig = await (0, config_service_1.hasProjectConfig)(currentDir);
        if (!hasConfig) {
            logger_1.logger.error('No .shrimsource/config.json found. Are you in a Shrimsource project directory?');
            return;
        }
        const config = await (0, config_service_1.readProjectConfig)(currentDir);
        logger_1.logger.info(`Found project configured with template '${config.template}'.`);
        logger_1.logger.info(`Required capabilities: ${config.capabilities.join(', ')}`);
        const { values } = await (0, env_service_1.promptEnvValues)(config.capabilities);
        await (0, env_service_1.writeEnvFile)(currentDir, values);
        // Config updates could be written back here if providers changed
        // For MVP, just updating the .env is the primary goal
        logger_1.logger.success('.env updated successfully.');
    }
    catch (error) {
        logger_1.logger.error(`Env setup failed: ${error.message}`);
    }
}
