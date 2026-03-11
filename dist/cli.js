"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = runCli;
const init_1 = require("./commands/init");
const env_setup_1 = require("./commands/env-setup");
const list_1 = require("./commands/list");
const logger_1 = require("./utils/logger");
async function runCli(argv) {
    const args = argv.slice(2);
    const command = args[0];
    if (command === 'env' && args[1] === 'setup') {
        await (0, env_setup_1.runEnvSetupCommand)();
    }
    else if (command === 'list') {
        await (0, list_1.runListCommand)();
    }
    else if (command === 'help' || command === '--help' || command === '-h') {
        logger_1.logger.info('Usage:');
        logger_1.logger.info('  create-shrimsource [template-name]    Initialize a new project');
        logger_1.logger.info('  create-shrimsource list               List available templates');
        logger_1.logger.info('  create-shrimsource env setup          Reconfigure environment variables');
    }
    else {
        // Treat the first argument as template name if not recognized
        const templateName = command; // undefined if no args
        await (0, init_1.runInitCommand)(templateName);
    }
}
