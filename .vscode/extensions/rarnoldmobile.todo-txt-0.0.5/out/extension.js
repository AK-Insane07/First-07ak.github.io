'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const ToDoCommands = require("./ToDoCommands");
const ToDoController_1 = require("./ToDoController");
const ToDoDecorator_1 = require("./decorators/ToDoDecorator");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let toDoDecorator = new ToDoDecorator_1.default();
    let toDoController = new ToDoController_1.default(toDoDecorator);
    ToDoCommands.ActivateCommands(context);
    // By Default Decorate the document
    toDoDecorator.decorateDocument();
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map