'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const ToDoSort_1 = require("./commands/ToDoSort");
const ToDoTasks_1 = require("./commands/ToDoTasks");
function ActivateCommands(context) {
    let toggleCompletion = vscode.commands.registerCommand('extension.toggleCompletion', () => {
        ToDoTasks_1.ToDoTasks.toggleCompletedTasks();
    });
    let archiveTasks = vscode.commands.registerCommand('extension.archiveTasks', () => {
        ToDoTasks_1.ToDoTasks.bulkArchiveTasks();
    });
    let reactivateCompletedTask = vscode.commands.registerCommand('extension.reactivateTask', () => {
        ToDoTasks_1.ToDoTasks.reactivateTask();
    });
    let sortByProject = vscode.commands.registerCommand('extension.sortProject', () => {
        ToDoSort_1.ToDoSort.SortLines(ToDoSort_1.ToDoSort.SortType.PROJECT);
    });
    let sortByPriority = vscode.commands.registerCommand('extension.sortPriority', () => {
        ToDoSort_1.ToDoSort.SortLines(ToDoSort_1.ToDoSort.SortType.PRIORITY);
    });
    let sortByDueDate = vscode.commands.registerCommand('extension.sortDueDate', () => {
        ToDoSort_1.ToDoSort.SortLines(ToDoSort_1.ToDoSort.SortType.DUE_DATE);
    });
    let sortByContext = vscode.commands.registerCommand('extension.sortContext', () => {
        ToDoSort_1.ToDoSort.SortLines(ToDoSort_1.ToDoSort.SortType.CONTEXT);
    });
    context.subscriptions.push(toggleCompletion);
    context.subscriptions.push(archiveTasks);
    context.subscriptions.push(reactivateCompletedTask);
    context.subscriptions.push(sortByProject);
    context.subscriptions.push(sortByPriority);
    context.subscriptions.push(sortByDueDate);
}
exports.ActivateCommands = ActivateCommands;
//# sourceMappingURL=ToDoCommands.js.map