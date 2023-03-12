"use strict";
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSScriptDefinitionProvider = exports.CSScriptRenameProvider = exports.CSScriptReferenceProvider = exports.CSScriptSignatureHelpProvider = exports.CSScriptCodeActionProvider = exports.CSScriptLinkProvider = exports.CSScriptDocFormattingProvider = exports.CSScriptCompletionItemProvider = exports.process_snippet_cursor_placeholders = exports.CSScriptHoverProvider = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';
const vscode_1 = require("vscode");
const utils = require("./utils");
const syntaxer_1 = require("./syntaxer");
const utils_1 = require("./utils");
const cs_script_1 = require("./cs-script");
function isWorkspace() { return vscode_1.workspace.rootPath != undefined; }
function isCssDirective(document, position) {
    return getCssDirective(document, position) != null;
}
function getCssDirective(document, position) {
    let word_range = document.getWordRangeAtPosition(position);
    if (word_range) {
        let word_start = word_range.start;
        var word = document.getText(word_range).lines()[0];
        if (word.startsWith('css_') && word_start.character >= 2) {
            // "//css_include"
            let prefix_range = new vscode_1.Range(word_start.translate(0, -word_start.character), word_start);
            let prefix = document.getText(prefix_range).lines()[0];
            let directive = (prefix + word).trim();
            if (directive.startsWith('//css_'))
                return directive;
        }
    }
    return null;
}
function trimWordDelimiters(word) {
    if (word.startsWith('//'))
        return word.substring(2);
    else
        return word;
}
// let help_map: { [id: string]: HelpSection; };
// function parseSyntaxHelp(help: string): void {
//     if (help) {
//         let section_r = /-+\r?\n\/\/css_/g;
//         let trim_r = /-+\r?\n/g;
//         let match;
//         let prev_index: number;
//         help_map = {};
//         while (match = section_r.exec(help)) {
//             if (prev_index) {
//                 let section = help.substr(prev_index, match.index - prev_index).split(trim_r)[1];
//                 let section_lines = section.lines(5);
//                 let id = section_lines[0].split(' ', 1)[0]; // '//css_include <file>;'
//                 let alt_id = section_lines
//                     .where(x => x.startsWith('Alias - //css'))
//                     .select(x => x.replace('Alias - ', '').trim())
//                     .firstOrDefault() as string;
//                 if (alt_id)
//                     help_map[alt_id] = { docOffset: prev_index, text: section };
//                 help_map[id] = { docOffset: prev_index, text: section };
//             }
//             prev_index = match.index;
//         }
//     }
// }
class CSScriptHoverProvider {
    provideHover(document, position, token) {
        // Some info: https://github.com/Microsoft/vscode-docker/blob/00ed8c801d9a36c81efc2cf22dfd686294d08656/dockerHoverProvider.ts
        let result;
        let is_workspace = isWorkspace();
        let is_css_directive = isCssDirective(document, position);
        if (!is_workspace || is_css_directive) {
            return new Promise((resolve, reject) => syntaxer_1.Syntaxer.getTooltip(document.getText(), document.fileName, document.offsetAt(position), (data) => {
                if (!data.startsWith("<null>") && !data.startsWith("<error>")) {
                    // data = data.replace(/\${r}\${n}/g, "\n")
                    //            .replace(/\${n}/g, "\n");
                    result = new vscode_1.Hover(data);
                }
                resolve(result);
            }));
        }
        return null;
    }
}
exports.CSScriptHoverProvider = CSScriptHoverProvider;
function process_snippet_cursor_placeholders(startLine, endLine) {
    let editor = vscode_1.window.activeTextEditor;
    for (let index = startLine; index < endLine; index++) {
        let line_text = editor.document.lineAt(index).text;
        let cursor_pos = line_text.indexOf("$0");
        if (cursor_pos != -1) {
            editor
                .edit(editBuilder => editBuilder.replace(new vscode_1.Range(index, cursor_pos, index, cursor_pos + 2), ''))
                .then(() => editor.selection = new vscode_1.Selection(index, cursor_pos, index, cursor_pos));
            break;
        }
    }
}
exports.process_snippet_cursor_placeholders = process_snippet_cursor_placeholders;
class CSScriptCompletionItemProvider {
    provideCompletionItems(document, position, token) {
        let items = [];
        let is_workspace = isWorkspace();
        let is_css_directive = isCssDirective(document, position);
        let eol = document.eol == vscode_1.EndOfLine.CRLF ? "\r\n" : "\n";
        if (!is_workspace || is_css_directive) {
            return new Promise((resolve, reject) => syntaxer_1.Syntaxer.getCompletions(document.getText(), document.fileName, document.offsetAt(position), (data) => {
                if (!data.startsWith("<null>") && !data.startsWith("<error>")) {
                    let line_indent = utils.get_line_indent(document.lineAt(position.line).text);
                    let lines = data.lines();
                    lines.forEach(line => {
                        // "$|$" is a Syntaxer specific caret position placeholder after completion is accepted.
                        // It does interfere with |-split so it needs to be escaped in one or another way.
                        // 
                        // VSCode supposed to respect snippet's placeholders (e.g. "$0") suitable for placing the cursor after 
                        // accepting the suggestion. However this feature is undocumented and as of 19-Apr-2018 it just does not work.
                        // The undocumented placeholders (to move cursor) supposed to work - https://github.com/Microsoft/vscode/issues/3210
                        // 
                        // Thus implementing post-event cursor placement with 'cs-script.on_completion_accepted' extension command.
                        // escaping |-delimiter, setting up the cursor placeholder, splitting completion display text fom the completion data
                        let parts = line.replace("$|$", "$0").split("\t");
                        // splitting completion data into logical parts
                        let info = parts[1].split("|");
                        let completionText = utils.css_unescape_linebreaks(info[1], eol);
                        // remove word delimiters (e.g. '//') otherwise they will get duplicated on insertion
                        completionText = trimWordDelimiters(completionText);
                        // trim start of the line by the size of line_indent, which will be injected by VSCode on insertion anyway
                        let pattern = new RegExp("\\n\\s{" + line_indent + "}", 'g');
                        completionText = completionText.replace(pattern, "\n");
                        // note, documentation is optional so it may not be present in the data
                        let doc;
                        if (info.length > 2)
                            doc = utils.css_unescape_linebreaks(info[2], eol);
                        let command;
                        let memberKind;
                        switch (info[0]) {
                            case "method":
                                memberKind = vscode_1.CompletionItemKind.Method;
                                break;
                            case "extension_method":
                                memberKind = vscode_1.CompletionItemKind.Method;
                                break;
                            case "constructor":
                                memberKind = vscode_1.CompletionItemKind.Constructor;
                                break;
                            case "field":
                                memberKind = vscode_1.CompletionItemKind.Field;
                                break;
                            case "property":
                                memberKind = vscode_1.CompletionItemKind.Property;
                                break;
                            case "event":
                                {
                                    // CompletionItem.additionalTextEdits cannot be used as it will overlap with the primary edit 
                                    // and also it may be executed before the primary edit, not after. So use command custom command instead
                                    command = {
                                        title: "",
                                        command: "cs-script.on_completion_accepted",
                                        arguments: [() => {
                                                process_snippet_cursor_placeholders(position.line, position.line + completionText.lines().length);
                                            }]
                                    };
                                    memberKind = vscode_1.CompletionItemKind.Event;
                                    break;
                                }
                            default:
                                memberKind = vscode_1.CompletionItemKind.Text;
                                break;
                        }
                        items.push({
                            label: parts[0],
                            kind: memberKind,
                            documentation: doc,
                            insertText: completionText,
                            command: command,
                            // additionalTextEdits: postInsertEdits,
                            sortText: '01'
                        });
                    });
                }
                resolve(items);
            }));
        }
        return null;
    }
}
exports.CSScriptCompletionItemProvider = CSScriptCompletionItemProvider;
let syntaxer_navigate_selectedLine = -1;
vscode_1.window.onDidChangeActiveTextEditor(editor => {
    // 'new Location(...' in CSScriptDefinitionProvider does scrolling correctly but does not do the selection
    if (syntaxer_navigate_selectedLine != -1) {
        let line = syntaxer_navigate_selectedLine;
        setTimeout(() => {
            utils_1.select_line(line);
        }, 100);
        syntaxer_navigate_selectedLine = -1;
    }
});
class CSScriptDocFormattingProvider {
    provideDocumentFormattingEdits(document, options, token) {
        let result = [];
        let is_workspace = isWorkspace();
        let enabled = utils_1.vsc_config.get("cs-script.enable_code_formatting", true);
        if (!is_workspace && enabled)
            return new Promise((resolve, reject) => {
                let editor = vscode_1.window.activeTextEditor;
                let position = editor.selection.start;
                syntaxer_1.Syntaxer.doDocFormat(document.getText(), document.fileName, document.offsetAt(position), (data) => {
                    if (!data.startsWith("<null>") && !data.startsWith("<error>")) {
                        // <position>\n<formatted text>   (note '\n' is a hard codded separator)
                        let info = data.lines(2);
                        let newText = data.substring(info[0].length + 1);
                        let wholeDoc = new vscode_1.Range(document.positionAt(0), document.positionAt(document.getText().length));
                        result.push(new vscode_1.TextEdit(wholeDoc, newText));
                        // Syntaxer also returns a new mapped offset but it seems like VSCode is doing a really good job by setting the new 
                        // offset of the formatted test without any syntaxer assistance. Thus the offset management is disabled.
                        // setTimeout(()=>
                        // {
                        //     let newPosition = document.positionAt(Number(info[0]));
                        //     let newSelection = new Selection(newPosition, newPosition)
                        //     editor.selection = newSelection;
                        //     editor.revealRange(editor.selection);
                        // }, 300);
                    }
                    resolve(result);
                });
            });
        else
            return null;
    }
}
exports.CSScriptDocFormattingProvider = CSScriptDocFormattingProvider;
class CSScriptLinkProvider {
    constructor() {
        this._linkPattern = /.*?\(.*?\):/g; // VS classic link pattern <file>(<line>,<column>): <info>
    }
    provideDocumentLinks(document, token) {
        let result = [];
        let enabled = utils_1.vsc_config.get("cs-script.decorate_file_links_in_output", true);
        if (enabled)
            return new Promise((resolve, reject) => {
                const text = document.getText();
                let match;
                while ((match = this._linkPattern.exec(text))) {
                    let matchText = match[0];
                    let info = utils_1.ErrorInfo.parse(matchText);
                    let targetPosUri = vscode_1.Uri.file(info.file)
                        .with({ fragment: `${1 + info.range.start.line}` });
                    let linkEnd = document.positionAt(this._linkPattern.lastIndex - 1);
                    let linkStart = document.positionAt(this._linkPattern.lastIndex - 1 - matchText.length);
                    result.push(new vscode_1.DocumentLink(new vscode_1.Range(linkStart, linkEnd), targetPosUri));
                }
                resolve(result);
            });
        else
            return null;
    }
}
exports.CSScriptLinkProvider = CSScriptLinkProvider;
class CSScriptCodeActionProvider {
    provideCodeActions(document, range, context, token) {
        let result = [];
        let is_workspace = isWorkspace();
        if (!is_workspace) {
            return new Promise((resolve, reject) => {
                let offset = document.offsetAt(range.end) - 1; // to ensure it is at word
                let word_range = document.getWordRangeAtPosition(document.positionAt(offset));
                let word = document.getText(word_range);
                if (word != "")
                    syntaxer_1.Syntaxer.suggestUsings(document.getText(), document.fileName, word, (data) => {
                        if (!data.startsWith("<null>") && !data.startsWith("<error>")) {
                            let eol = document.eol == vscode_1.EndOfLine.CRLF ? "\r\n" : "\n";
                            let lastCssDirective;
                            let usings = [];
                            for (let index = 0; index <= range.start.line; index++) {
                                let line = document.lineAt(index);
                                if (line.text.trim().startsWith("using "))
                                    usings.push(line);
                                else if (line.text.trim().startsWith("//css_"))
                                    lastCssDirective = line;
                            }
                            function find_using_placement(text) {
                                if (usings.any())
                                    return usings.firstOrDefault().range.start;
                                else
                                    return lastCssDirective ? new vscode_1.Position(lastCssDirective.range.end.line + 1, 0) : new vscode_1.Position(0, 0);
                            }
                            let new_usings = [];
                            let new_replacements = [];
                            let lines = data.lines();
                            // abort if any missing 'using' is already handled; If this var is not checked the user 
                            // will be presented with alternative handling/'using' options  
                            let already_handled = false;
                            lines.forEach(line => {
                                if (!already_handled) {
                                    let insert_action;
                                    let replace_action;
                                    let new_using = `using ${line};`;
                                    let already_present = usings.any(x => x.text == new_using);
                                    if (!already_present) {
                                        let insertion_pos = find_using_placement(new_using);
                                        if (insertion_pos) {
                                            insert_action = new vscode_1.CodeAction(`Add "${new_using}"`);
                                            insert_action.kind = vscode_1.CodeActionKind.RefactorRewrite;
                                            insert_action.edit = new vscode_1.WorkspaceEdit();
                                            insert_action.edit.insert(vscode_1.Uri.file(document.fileName), insertion_pos, new_using + eol);
                                        }
                                    }
                                    else
                                        already_handled = true;
                                    let replacement_word = `${line}.${word}`;
                                    let already_fully_specified = false;
                                    // checking if the word is already (a part of) the whole replacement_word
                                    let start_of_expression = (word_range === null || word_range === void 0 ? void 0 : word_range.end.character) - replacement_word.length;
                                    if (start_of_expression >= 0) {
                                        let whole_word_range = new vscode_1.Range(new vscode_1.Position(word_range.start.line, start_of_expression), word_range.end);
                                        let whole_word = document.getText(whole_word_range);
                                        if (whole_word == replacement_word) {
                                            already_fully_specified = true;
                                            already_handled = true;
                                        }
                                    }
                                    if (!already_fully_specified && !already_present) {
                                        replace_action = new vscode_1.CodeAction(`Change "${word}" to "${line}.${word}"`);
                                        replace_action.kind = vscode_1.CodeActionKind.RefactorRewrite;
                                        replace_action.edit = new vscode_1.WorkspaceEdit();
                                        replace_action.edit.replace(vscode_1.Uri.file(document.fileName), word_range, replacement_word);
                                    }
                                    if (insert_action != undefined && replace_action != undefined) {
                                        new_usings.push(insert_action);
                                        new_replacements.push(replace_action);
                                    }
                                }
                            });
                            if (!already_handled) {
                                new_usings.forEach(x => result.push(x));
                                let enable_grouping = utils_1.vsc_config.get("cs-script.group_suggested_code_actions", true);
                                if (enable_grouping)
                                    result.push(new vscode_1.CodeAction(`--------------------------`));
                                new_replacements.forEach(x => result.push(x));
                            }
                        }
                        resolve(result);
                    });
            });
        }
        return null;
    }
}
exports.CSScriptCodeActionProvider = CSScriptCodeActionProvider;
class CSScriptSignatureHelpProvider {
    provideSignatureHelp(document, position, token) {
        // let res = new SignatureHelp();
        // let sig = new SignatureInformation('*TestMethod* (int param_a, int param_a)');
        // sig.documentation = "General description";
        // sig.parameters.push(new ParameterInformation('param_a', "param_a description"));
        // sig.parameters.push(new ParameterInformation('param_b', "param_b description"));
        // res.signatures.push(sig);
        // res.activeSignature = 0;
        // res.activeParameter = 1;
        // return res;
        let result;
        let is_workspace = isWorkspace();
        if (!is_workspace) {
            let eol = document.eol == vscode_1.EndOfLine.CRLF ? "\r\n" : "\n";
            return new Promise((resolve, reject) => syntaxer_1.Syntaxer.getSignatureHelp(document.getText(), document.fileName, document.offsetAt(position), (data) => {
                if (!data.startsWith("<null>") && !data.startsWith("<error>")) {
                    let lines = data.lines();
                    // #/# - <signature index>/<parameter index>
                    let bestMatch = lines[0].split('/');
                    let bestSigIndex = Number(bestMatch[0]);
                    let bestParamIndex = Number(bestMatch[1]);
                    result = new vscode_1.SignatureHelp();
                    for (let i = 1; i < lines.length; i++) {
                        let sig_info = utils.css_unescape_linebreaks(lines[i], eol);
                        let sig = utils.toSignatureInfo(sig_info);
                        result.signatures.push(sig);
                    }
                    // script.user    
                    // must be set after result.signatures are added
                    result.activeSignature = bestSigIndex;
                    if (bestSigIndex != -1) {
                        // do not set it if params are not matched (== -1)  as the syntaxer algorithm for detecting current
                        // param was note verified yet 
                        result.activeParameter = bestParamIndex;
                    }
                }
                resolve(result);
            }));
        }
        return null;
    }
}
exports.CSScriptSignatureHelpProvider = CSScriptSignatureHelpProvider;
class CSScriptReferenceProvider {
    provideReferences(document, position, context, token) {
        let result = [];
        let is_workspace = isWorkspace();
        if (!is_workspace) {
            return new Promise((resolve, reject) => 
            // cannot call with await as provideReferences cannot be declared with
            // async as it is overloaded 
            syntaxer_1.Syntaxer.getRefrences(document.getText(), document.fileName, document.offsetAt(position), (data) => {
                if (!data.startsWith("<null>") && !data.startsWith("<error>")) {
                    let lines = data.lines();
                    lines.forEach(line => {
                        let info = utils_1.ErrorInfo.parse(line);
                        result.push(new vscode_1.Location(vscode_1.Uri.file(info.file), info.range));
                    });
                }
                resolve(result);
            }));
        }
        return null;
    }
}
exports.CSScriptReferenceProvider = CSScriptReferenceProvider;
class CSScriptRenameProvider {
    provideRenameEdits(document, position, newName, token) {
        let is_workspace = isWorkspace();
        if (!is_workspace) {
            let word = document.getWordRangeAtPosition(position);
            let word_width = word.end.character - word.start.character;
            return new Promise((resolve, reject) => syntaxer_1.Syntaxer.getRenamingInfo(document.getText(), document.fileName, document.offsetAt(position), (data) => {
                let result = new vscode_1.WorkspaceEdit();
                try {
                    if (!data.startsWith("<null>") && !data.startsWith("<error>")) {
                        var changes = {};
                        let lines = data.lines();
                        lines.forEach(line => {
                            let info = utils_1.ErrorInfo.parse(line);
                            let range = new vscode_1.Range(info.range.start, new vscode_1.Position(info.range.start.line, info.range.start.character + word_width));
                            let edits = changes[info.file];
                            if (!edits) {
                                edits = [];
                                changes[info.file] = edits;
                            }
                            edits.push(new vscode_1.TextEdit(range, newName));
                        });
                        for (let file in changes) {
                            let edits = changes[file];
                            let uri = vscode_1.Uri.file(utils.clear_temp_file_suffixes(file));
                            result.set(uri, edits);
                        }
                    }
                }
                catch (_a) { }
                resolve(result);
                setTimeout(() => cs_script_1.save_script_project(false), 700);
            }));
        }
        return null;
    }
}
exports.CSScriptRenameProvider = CSScriptRenameProvider;
class CSScriptDefinitionProvider {
    provideDefinition(document, position, token) {
        syntaxer_navigate_selectedLine = -1;
        let result;
        let is_workspace = isWorkspace();
        let is_css_directive = isCssDirective(document, position);
        if (!is_workspace || is_css_directive) {
            return new Promise((resolve, reject) => syntaxer_1.Syntaxer.getDefinition(document.getText(), document.fileName, document.offsetAt(position), (data) => {
                if (!data.startsWith("<null>") && !data.startsWith("<error>")) {
                    let lines = data.lines();
                    // file:c:\Users\<user>\AppData\Roaming\Code\User\cs-script.user\new_script.cs
                    // line:25
                    let file = lines[0].substr('file:'.length);
                    let line = Number(lines[1].substr('line:'.length)) - 1;
                    if (file.length > 0) {
                        syntaxer_navigate_selectedLine = line;
                        result = new vscode_1.Location(vscode_1.Uri.file(file), new vscode_1.Range(new vscode_1.Position(line, 0), new vscode_1.Position(line, 0)));
                        // It's the same file so no doc change event will be fired on navigation.
                        // Thus so no line with the cursor will be selected in the event handler.
                        // Meaning, we have to do it explicitly.     
                        if (file.toLowerCase() == document.fileName.toLowerCase()) {
                            setTimeout(() => utils_1.select_line(syntaxer_navigate_selectedLine), 30);
                        }
                    }
                }
                resolve(result);
            }));
        }
        // utils.statusBarItem.hide();
        return null;
    }
}
exports.CSScriptDefinitionProvider = CSScriptDefinitionProvider;
//# sourceMappingURL=providers.js.map