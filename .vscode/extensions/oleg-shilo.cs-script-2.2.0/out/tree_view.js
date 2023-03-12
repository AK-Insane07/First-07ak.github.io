"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectItem = exports.ProjectTreeProvider = void 0;
/* tslint:disable */
const vscode = require("vscode");
const path = require("path");
const vscode_1 = require("vscode");
const utils = require("./utils");
class ProjectTreeProvider {
    constructor(aggregateScriptItems) {
        this.aggregateScriptItems = aggregateScriptItems;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        vscode.window.onDidChangeActiveTextEditor(editor => {
            // no need to do it so often
            // this._onDidChangeTreeData.fire();
        });
        vscode.workspace.onDidChangeTextDocument(e => {
        });
        vscode.workspace.onDidSaveTextDocument(doc => {
            this._onDidChangeTreeData.fire(undefined);
        });
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return new Promise(resolve => {
            if (element) {
                if (element.children)
                    resolve(this.getScriptRefs(element.children));
                else
                    resolve([]);
            }
            else {
                resolve(this.getScriptItems());
            }
        });
    }
    getScriptRefs(asms) {
        return asms.map(asm => {
            return new ProjectItem(asm, vscode.TreeItemCollapsibleState.None, undefined, undefined, 'assembly');
        });
    }
    getScriptItems() {
        let refsNode = new ProjectItem('References', vscode.TreeItemCollapsibleState.Collapsed, undefined, [], 'assembly_group');
        let nodes = [];
        nodes.push(refsNode);
        if (!utils.is_ready()) {
            setTimeout(() => vscode_1.commands.executeCommand('cs-script.refresh_tree'), 500);
        }
        else {
            let items = this.aggregateScriptItems();
            if (items)
                items.forEach(item => {
                    var _a;
                    if (item.startsWith('file:')) {
                        let file = item.substr(5);
                        let role = "Primary";
                        if (nodes.length > 1)
                            role = "Imported";
                        let node = new ProjectItem(path.basename(file), vscode.TreeItemCollapsibleState.None, {
                            command: 'vscode.open',
                            title: '',
                            tooltip: role + ' script: ' + file,
                            arguments: [vscode_1.Uri.file(file)],
                        }, undefined, role.toLowerCase());
                        nodes.push(node);
                    }
                    else if (item.startsWith('ref:'))
                        (_a = refsNode.children) === null || _a === void 0 ? void 0 : _a.push(item.substr(4));
                });
        }
        return nodes;
    }
}
exports.ProjectTreeProvider = ProjectTreeProvider;
class ProjectItem extends vscode.TreeItem {
    constructor(label, collapsibleState, command, children, context) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.children = children;
        this.context = context;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'images', 'icons', 'document.light.svg'),
            dark: path.join(__filename, '..', '..', 'images', 'icons', 'document.svg')
        };
        this.contextValue = 'dependency';
        if (context) {
            this.contextValue = context;
            var icon = "";
            if (context == 'imported') {
                icon = 'cs';
            }
            else if (context == 'primary') {
                icon = 'css';
            }
            else if (context == 'assembly' || context == 'assembly_group') {
                icon = 'asm';
            }
            if (icon != "") {
                this.iconPath = {
                    light: path.join(__filename, '..', '..', 'images', 'icons', icon + '.light.svg'),
                    dark: path.join(__filename, '..', '..', 'images', 'icons', icon + '.svg')
                };
            }
        }
    }
}
exports.ProjectItem = ProjectItem;
//# sourceMappingURL=tree_view.js.map