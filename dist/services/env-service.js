"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequiredEnvKeys = getRequiredEnvKeys;
exports.promptEnvValues = promptEnvValues;
exports.serializeEnv = serializeEnv;
exports.writeEnvFile = writeEnvFile;
const capability_map_1 = require("../providers/capability-map");
const llm_providers_1 = require("../providers/llm-providers");
const search_providers_1 = require("../providers/search-providers");
const embed_providers_1 = require("../providers/embed-providers");
const db_providers_1 = require("../providers/db-providers");
const email_providers_1 = require("../providers/email-providers");
const storage_providers_1 = require("../providers/storage-providers");
const browser_providers_1 = require("../providers/browser-providers");
const prompt_1 = require("../utils/prompt");
const fs_1 = require("../utils/fs");
const files_1 = require("../constants/files");
const path_1 = __importDefault(require("path"));
function getRequiredEnvKeys(capabilities) {
    const keys = new Set();
    for (const cap of capabilities) {
        const capsKeys = capability_map_1.CAPABILITY_ENV_MAP[cap] || [];
        capsKeys.forEach(k => keys.add(k));
    }
    return Array.from(keys);
}
async function promptEnvValues(capabilities) {
    const values = {};
    const providers = {};
    if (capabilities.includes('llm')) {
        const llmProviderId = await (0, prompt_1.askSelect)('Select LLM Provider:', llm_providers_1.LLM_PROVIDERS.map(p => ({ label: p.label, value: p.id })));
        providers.llm = llmProviderId;
        values['SHRIM_LLM_PROVIDER'] = llmProviderId;
        if (llmProviderId !== 'openrouter') {
            let defaultBaseUrl = '';
            if (llmProviderId === 'openai')
                defaultBaseUrl = 'https://api.openai.com/v1';
            const baseUrl = await (0, prompt_1.askInput)(`Enter Base URL for ${llmProviderId}${defaultBaseUrl ? ` (default: ${defaultBaseUrl})` : ''}:`);
            values['LLM_BASE_URL'] = baseUrl || defaultBaseUrl;
        }
        else {
            values['LLM_BASE_URL'] = 'https://openrouter.ai/api/v1';
        }
        if (llmProviderId !== 'local') {
            const apiKey = await (0, prompt_1.askInput)(`Enter ${llmProviderId} API Key:`);
            values['LLM_API_KEY'] = apiKey;
        }
        else {
            values['LLM_API_KEY'] = 'not-needed'; // Provide dummy key for local to prevent empty string errors
        }
        const model = await (0, prompt_1.askInput)(`Enter default model to use for ${llmProviderId}:`);
        values['LLM_MODEL'] = model;
    }
    if (capabilities.includes('embed')) {
        const embedProviderId = await (0, prompt_1.askSelect)('Select Embedding Provider:', embed_providers_1.EMBED_PROVIDERS.map(p => ({ label: p.label, value: p.id })));
        providers.embed = embedProviderId;
        values['SHRIM_EMBED_PROVIDER'] = embedProviderId;
        const embedKey = await (0, prompt_1.askInput)(`Enter ${embedProviderId} API Key:`);
        values['SHRIM_EMBED_KEY'] = embedKey;
    }
    if (capabilities.includes('search')) {
        const searchProviderId = await (0, prompt_1.askSelect)('Select Search Provider:', search_providers_1.SEARCH_PROVIDERS.map(p => ({ label: p.label, value: p.id })));
        providers.search = searchProviderId;
        values['SHRIM_SEARCH_PROVIDER'] = searchProviderId;
        if (searchProviderId !== 'none') {
            const searchKey = await (0, prompt_1.askInput)(`Enter ${searchProviderId} API Key:`);
            values['SHRIM_SEARCH_KEY'] = searchKey;
        }
    }
    if (capabilities.includes('db')) {
        const dbProviderId = await (0, prompt_1.askSelect)('Select Database Provider:', db_providers_1.DB_PROVIDERS.map(p => ({ label: p.label, value: p.id })));
        providers.db = dbProviderId;
        const dbUrl = await (0, prompt_1.askInput)(`Enter ${dbProviderId} Connection URL:`);
        values['SHRIM_DB_URL'] = dbUrl;
        // DB key is often optional or part of the URL, but prompted just in case framework needs it separate
        const dbKey = await (0, prompt_1.askInput)(`Enter ${dbProviderId} API Key or Password (Optional):`);
        values['SHRIM_DB_KEY'] = dbKey;
    }
    if (capabilities.includes('email')) {
        const emailProviderId = await (0, prompt_1.askSelect)('Select Email Provider:', email_providers_1.EMAIL_PROVIDERS.map(p => ({ label: p.label, value: p.id })));
        providers.email = emailProviderId;
        values['SHRIM_EMAIL_PROVIDER'] = emailProviderId;
        const emailKey = await (0, prompt_1.askInput)(`Enter ${emailProviderId} API Key:`);
        values['SHRIM_EMAIL_KEY'] = emailKey;
    }
    if (capabilities.includes('storage')) {
        const storageProviderId = await (0, prompt_1.askSelect)('Select Storage Provider:', storage_providers_1.STORAGE_PROVIDERS.map(p => ({ label: p.label, value: p.id })));
        providers.storage = storageProviderId;
        values['SHRIM_STORAGE_PROVIDER'] = storageProviderId;
        if (storageProviderId !== 'local') {
            const storageKey = await (0, prompt_1.askInput)(`Enter ${storageProviderId} API Key:`);
            values['SHRIM_STORAGE_KEY'] = storageKey;
        }
        else {
            values['SHRIM_STORAGE_KEY'] = 'not-needed';
        }
    }
    if (capabilities.includes('browser')) {
        const browserProviderId = await (0, prompt_1.askSelect)('Select Web Browser Engine:', browser_providers_1.BROWSER_PROVIDERS.map(p => ({ label: p.label, value: p.id })));
        providers.browser = browserProviderId;
        values['SHRIM_BROWSER_PROVIDER'] = browserProviderId;
    }
    return { values, providers };
}
function serializeEnv(values) {
    return Object.entries(values)
        .map(([key, val]) => `${key}=${val}`)
        .join('\n') + '\n';
}
async function writeEnvFile(projectDir, values) {
    const envPath = path_1.default.join(projectDir, files_1.FILES.ENV);
    const content = serializeEnv(values);
    await (0, fs_1.writeTextFile)(envPath, content);
}
