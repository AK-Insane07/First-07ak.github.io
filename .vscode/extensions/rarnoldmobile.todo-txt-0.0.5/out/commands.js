'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
function ActivateCommands(context) {
    let basicHello = vscode.commands.registerCommand('extension.sayHello', () => {
        vscode.window.showInformationMessage('Hello World Refactored!a');
    });
    let basicWarning = vscode.commands.registerCommand('extension.sayNewHello', () => {
        vscode.window.showWarningMessage("This is a warning message Refactoreda");
    });
    context.subscriptions.push(basicHello);
    context.subscriptions.push(basicWarning);
}
exports.ActivateCommands = ActivateCommands;
//# sourceMappingURL=commands.js.map