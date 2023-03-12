"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const StyleConstants_1 = require("./utils/StyleConstants");
const path = require("path");
const AppConstants_1 = require("./utils/AppConstants");
class ToDoDecorator {
    constructor() {
        this.dateDecorations = [];
        this.projectDecorations = [];
        this.priorityDecorations = [];
        this.overdueDecorations = [];
        this.completedDecorations = [];
        this.contextDecorations = [];
        this.dateRegex = new RegExp(/\d{4}-\d{2}-\d{2}/g);
        this.projectRegex = new RegExp(/\B\+\w+/g);
        this.contextRegex = new RegExp(/\B\@\w+/g);
        this.priorityRegex = new RegExp(/[(][A-Z][)]/g);
        this.dateDecorationType = vscode.window.createTextEditorDecorationType({
            light: {
                color: StyleConstants_1.default.DATE_LIGHT
            },
            dark: {
                color: StyleConstants_1.default.DATE_DARK
            }
        });
        this.projectDecorationType = vscode.window.createTextEditorDecorationType({
            light: {
                color: StyleConstants_1.default.PROJECT_LIGHT
            },
            dark: {
                color: StyleConstants_1.default.PROJECT_DARK
            }
        });
        this.priorityDecorationType = vscode.window.createTextEditorDecorationType({
            light: {
                color: StyleConstants_1.default.PRIORITY_LIGHT
            },
            dark: {
                color: StyleConstants_1.default.PRIORITY_DARK
            }
        });
        this.overdueDecorationType = vscode.window.createTextEditorDecorationType({});
        this.contextDecorationType = vscode.window.createTextEditorDecorationType({
            light: {
                color: StyleConstants_1.default.CONTEXT_LIGHT
            },
            dark: {
                color: StyleConstants_1.default.CONTEXT_DARK
            }
        });
        this.completedDecorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: StyleConstants_1.default.COMPLETED_CSS
        });
    }
    decorateDocument() {
        // Clear all current decorations and set active editor
        this.clearAllDecorations();
        this.activeEditor = vscode.window.activeTextEditor;
        if (vscode_1.window.activeTextEditor != undefined) {
            // Only Decorate Document if it's in the classic filenaming convention
            let fileName = path.basename(vscode_1.window.activeTextEditor.document.fileName);
            if (AppConstants_1.default.ACCEPTED_FILENAMES.lastIndexOf(fileName) >= 0) {
                // Iterate over each line and parse accordingl∏
                let totalLines = vscode_1.window.activeTextEditor.document.lineCount;
                for (var i = 0; i <= totalLines - 1; i++) {
                    let lineObject = vscode_1.window.activeTextEditor.document.lineAt(i);
                    this.parseLineObject(lineObject);
                }
            }
            // Set final decorations
            this.setDecorations();
        }
    }
    parseLineObject(inputLine) {
        /*
            Iterate over regexes and update all arrays
        */
        this.parseRegex(this.dateRegex, this.dateDecorations, inputLine);
        this.parseRegex(this.projectRegex, this.projectDecorations, inputLine);
        this.parseRegex(this.contextRegex, this.contextDecorations, inputLine);
        this.parseRegex(this.priorityRegex, this.priorityDecorations, inputLine);
        if (inputLine.text.startsWith("x ") || inputLine.text.startsWith("X ")) {
            let decoration = { range: inputLine.range };
            this.completedDecorations.push(decoration);
        }
    }
    clearAllDecorations() {
        this.dateDecorations = [];
        this.projectDecorations = [];
        this.priorityDecorations = [];
        this.contextDecorations = [];
        this.overdueDecorations = [];
        this.completedDecorations = [];
    }
    setDecorations() {
        // Set all new decorations
        this.activeEditor.setDecorations(this.dateDecorationType, this.dateDecorations);
        this.activeEditor.setDecorations(this.projectDecorationType, this.projectDecorations);
        this.activeEditor.setDecorations(this.contextDecorationType, this.contextDecorations);
        this.activeEditor.setDecorations(this.completedDecorationType, this.completedDecorations);
        this.activeEditor.setDecorations(this.priorityDecorationType, this.priorityDecorations);
    }
    parseRegex(iRegExp, decorationOptions, inputLine) {
        let result;
        while (result = iRegExp.exec(inputLine.text)) {
            let beginPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index);
            let endPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index + result[0].length);
            let decoration = { range: new vscode_1.Range(beginPosition, endPosition) };
            decorationOptions.push(decoration);
        }
    }
}
exports.default = ToDoDecorator;
//# sourceMappingURL=ToDoDecorator.js.map