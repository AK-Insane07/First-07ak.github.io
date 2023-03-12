"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const AppConstants_1 = require("../utils/AppConstants");
const TaskUtils_1 = require("../utils/TaskUtils");
var ToDoTasks;
(function (ToDoTasks) {
    function toggleCompletedTasks() {
        // Get the current line and find the first 2 characters
        const editor = vscode.window.activeTextEditor;
        let currLine = editor.selection.start.line;
        let currDoc = editor.document;
        if (TaskUtils_1.TaskUtils.isTaskComplete(currDoc.lineAt(currLine).text)) {
            editor.edit(builder => {
                builder.delete(new vscode.Range(new vscode.Position(currLine, 0), new vscode.Position(currLine, 2)));
                editor.selection = new vscode.Selection(new vscode.Position(currLine, 3), new vscode.Position(currLine, 3));
            });
        }
        else {
            editor.edit(builder => {
                builder.insert(new vscode.Position(currLine, 0), "x ");
            });
        }
        editor.selection = new vscode.Selection(new vscode.Position(currLine, 0), new vscode.Position(currLine, 0));
    }
    ToDoTasks.toggleCompletedTasks = toggleCompletedTasks;
    function bulkArchiveTasks() {
        const editor = vscode.window.activeTextEditor;
        let window = vscode.window;
        let currDoc = editor.document;
        let destinationFileName = path.dirname(currDoc.fileName) + path.sep + AppConstants_1.default.ARCHIVE_FILENAME;
        let lineDeletes = [];
        if (path.basename(currDoc.fileName) != AppConstants_1.default.TODO_FILENAME) {
            vscode.window.showInformationMessage("Archive only available for the " + AppConstants_1.default.TODO_FILENAME + " file");
            return;
        }
        if (window.activeTextEditor != undefined) {
            // Only Decorate Document if it's in the classic filenaming convention
            let fileName = path.basename(window.activeTextEditor.document.fileName);
            let eol = TaskUtils_1.TaskUtils.determineEOL(vscode.window.activeTextEditor.document.eol);
            let totalLines = window.activeTextEditor.document.lineCount;
            for (var i = 0; i <= totalLines - 1; i++) {
                let lineObject = window.activeTextEditor.document.lineAt(i);
                if (TaskUtils_1.TaskUtils.isTaskComplete(currDoc.lineAt(i).text)) {
                    fs.appendFileSync(destinationFileName, lineObject.text + eol);
                    lineDeletes.push(i);
                }
            }
            TaskUtils_1.TaskUtils.deleteLines(lineDeletes, editor, currDoc);
            editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        }
    }
    ToDoTasks.bulkArchiveTasks = bulkArchiveTasks;
    function reactivateTask() {
        const editor = vscode.window.activeTextEditor;
        let currLine = editor.selection.start.line;
        let currDoc = editor.document;
        if (path.basename(currDoc.fileName) != AppConstants_1.default.ARCHIVE_FILENAME) {
            vscode.window.showInformationMessage("Reactivate only available for the " + AppConstants_1.default.ARCHIVE_FILENAME + " file");
            return;
        }
        /*
        * Migrate the task to the main file
        */
        let destinationFileName = path.dirname(currDoc.fileName) + path.sep + AppConstants_1.default.TODO_FILENAME;
        let lineObject = editor.document.lineAt(currLine);
        let eol = TaskUtils_1.TaskUtils.determineEOL(vscode.window.activeTextEditor.document.eol);
        let lineText = lineObject.text;
        if (lineText.substring(0, 2).toLowerCase() == 'x ') {
            lineText = lineText.substring(2);
        }
        fs.appendFileSync(destinationFileName, eol + lineText + eol);
        let lineDeletes = [currLine];
        TaskUtils_1.TaskUtils.deleteLines(lineDeletes, editor, currDoc);
    }
    ToDoTasks.reactivateTask = reactivateTask;
})(ToDoTasks = exports.ToDoTasks || (exports.ToDoTasks = {}));
//# sourceMappingURL=ToDoTasks.js.map