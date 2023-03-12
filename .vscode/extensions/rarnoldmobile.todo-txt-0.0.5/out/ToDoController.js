'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
class ToDoController {
    constructor(toDoDecorator) {
        let subscriptions = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        this._toDoDecorator = toDoDecorator;
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._toDoDecorator.decorateDocument();
    }
}
exports.default = ToDoController;
//# sourceMappingURL=ToDoController.js.map