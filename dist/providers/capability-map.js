"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAPABILITY_ENV_MAP = void 0;
exports.CAPABILITY_ENV_MAP = {
    llm: ["SHRIM_LLM_PROVIDER", "LLM_API_KEY", "LLM_MODEL", "LLM_BASE_URL"],
    search: ["SHRIM_SEARCH_PROVIDER", "SHRIM_SEARCH_KEY"],
    embed: ["SHRIM_EMBED_PROVIDER", "SHRIM_EMBED_KEY"],
    db: ["SHRIM_DB_URL", "SHRIM_DB_KEY"],
    email: ["SHRIM_EMAIL_PROVIDER", "SHRIM_EMAIL_KEY"],
    storage: ["SHRIM_STORAGE_PROVIDER", "SHRIM_STORAGE_KEY"],
    browser: ["SHRIM_BROWSER_PROVIDER"]
};
