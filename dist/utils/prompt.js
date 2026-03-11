"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askInput = askInput;
exports.askSelect = askSelect;
exports.askConfirm = askConfirm;
const prompts_1 = require("@inquirer/prompts");
async function askInput(message) {
    return await (0, prompts_1.input)({ message });
}
async function askSelect(message, options) {
    const choices = options.map(opt => ({
        name: opt.label,
        value: opt.value
    }));
    return await (0, prompts_1.select)({
        message,
        choices
    });
}
async function askConfirm(message) {
    return await (0, prompts_1.confirm)({
        message,
        default: true
    });
}
