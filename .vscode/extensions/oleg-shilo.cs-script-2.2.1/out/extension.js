"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
/* tslint:disable */
// TODO:
// - Implement saving project before run or any intellisense operations. Still waiting for VSCode feature ("API Access to "Open Editors" #15178") to be implemented:
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const cs_script = require("./cs-script");
const tree_view_1 = require("./tree_view");
const providers_1 = require("./providers");
function activate(context) {
    try {
        // Use the console to output diagnostic information (console.log) and errors (console.error)
        // This line of code will only be executed once when your extension is activated
        // console.log('"cs-script" extension is now active...');
        cs_script.ActivateDiagnostics(context);
        // done -  is a .NET Core migration indicator 
        const treeViewProvider = new tree_view_1.ProjectTreeProvider(cs_script.get_project_tree_items); // done
        vscode.window.registerTreeDataProvider('cs-script', treeViewProvider); // done
        context.subscriptions.push(vscode.languages.registerHoverProvider('csharp', new providers_1.CSScriptHoverProvider())); // done
        context.subscriptions.push(vscode.languages.registerHoverProvider('vb', new providers_1.CSScriptHoverProvider()));
        // --
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider('csharp', new providers_1.CSScriptCompletionItemProvider(), '.', '_', '=', " ")); // done
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider('vb', new providers_1.CSScriptCompletionItemProvider(), '.', '_', '='));
        // --
        context.subscriptions.push(vscode.languages.registerDefinitionProvider('csharp', new providers_1.CSScriptDefinitionProvider())); // done
        context.subscriptions.push(vscode.languages.registerDefinitionProvider('vb', new providers_1.CSScriptDefinitionProvider()));
        // --
        context.subscriptions.push(vscode.languages.registerReferenceProvider('csharp', new providers_1.CSScriptReferenceProvider())); // done
        context.subscriptions.push(vscode.languages.registerReferenceProvider('vb', new providers_1.CSScriptReferenceProvider()));
        // --
        context.subscriptions.push(vscode.languages.registerCodeActionsProvider('csharp', new providers_1.CSScriptCodeActionProvider())); // done                             // e.g. "add usings"
        context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('csharp', new providers_1.CSScriptSignatureHelpProvider(), '(', ',')); // done              // hint the signature while typing
        context.subscriptions.push(vscode.languages.registerRenameProvider('csharp', new providers_1.CSScriptRenameProvider())); // done
        context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('csharp', new providers_1.CSScriptDocFormattingProvider())); // done
        // --
        context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('code-runner-output', new providers_1.CSScriptLinkProvider())); // done
        // --
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.refresh_tree', () => treeViewProvider.refresh())); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.show_tree_data', () => cs_script.print_project())); // done
        // --
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.debug', cs_script.debug)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.run', cs_script.run)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.reset_busy', cs_script.reset_busy)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.run_in_terminal', cs_script.run_in_terminal)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.print_project', cs_script.print_project_for_document)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.load_project', cs_script.load_project)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.check', cs_script.check)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.find_references', cs_script.find_references)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.css_config', cs_script.css_config)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.about', cs_script.about)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.new_script', cs_script.new_script)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.new_script_vb', cs_script.new_script_vb));
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.engine_help', cs_script.engine_help)); //done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.build_exe', cs_script.build_exe)); // done
        context.subscriptions.push(vscode.commands.registerCommand('cs-script.on_completion_accepted', callback => callback()));
        context.subscriptions.push(vscode.commands.registerCommand("csharp.startSessionCommand", debugConfig => {
            if (Object.keys(debugConfig).length === 0) {
                return {
                    status: 'initialConfiguration'
                };
            }
        }));
    }
    catch (error) {
        console.log(error.toSting());
    }
}
exports.activate = activate;
;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map