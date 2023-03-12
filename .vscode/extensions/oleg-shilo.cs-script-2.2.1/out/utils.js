"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveEditorTracker = exports.ActivateDiagnostics = exports.BuiltInCommands = exports.actual_output = exports.ensure_default_config = exports.ensure_default_core_config = exports.disable_roslyn_on_osx = exports.preload_roslyn = exports.Utils = exports.Settings = exports.ErrorInfo = exports.toSignatureInfo = exports.save_as_temp = exports.select_line = exports.clear_temp_file_suffixes = exports.prepare_new_script_vb = exports.prepare_new_script = exports.compare_versions = exports.deploy_engine = exports.user_dir = exports.del_file = exports.copy_file_to_sync2 = exports.copy_dir_to_sync = exports.copy_file_to_sync = exports.copy_file_to = exports.copy_file = exports.delete_dir = exports.create_dir = exports.unlock = exports.lock = exports.run_async = exports.is_busy = exports.is_ready = exports.css_unescape_linebreaks = exports.get_line_indent = exports.with_lock = exports.UpdateFromJSON = exports.diagnosticCollection = exports.settings = exports.isWin = exports.omnisharp_dir = exports.ext_version = exports.statusBarItem = exports.ext_dir = exports.vsc_config = void 0;
/* tslint:disable */
const vscode = require("vscode");
const os = require("os");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const fsx = require("fs-extra");
const vscode_1 = require("vscode");
const syntaxer_1 = require("./syntaxer");
class vsc_config {
    static get(section_value, defaultValue) {
        let tokens = section_value.split('.');
        return vscode
            .workspace
            .getConfiguration(tokens[0])
            .get(tokens[1], defaultValue);
    }
    static set(section_value, value) {
        let tokens = section_value.split('.');
        vscode
            .workspace
            .getConfiguration(tokens[0])
            .update(tokens[1], value);
    }
}
exports.vsc_config = vsc_config;
exports.ext_dir = path.join(__dirname, "..");
let exec = require('child_process').exec;
let execSync = require('child_process').execSync;
let mkdirp = require('mkdirp');
// let ext_context: vscode.ExtensionContext;
// let min_required_mono = '5.0.1';
let ver_file;
// let cscs_exe: string;
let _user_dir;
// let _environment_compatible = false;
let _environment_ready = false;
let _ready = false;
let _busy = false;
exports.isWin = (os.platform() == 'win32');
let sources_temp_dir = path.join(os.tmpdir(), "Roslyn.Intellisense", "sources");
create_dir(sources_temp_dir);
String.prototype.lines = function (limit) {
    return this.split(/\r?\n/g, limit);
};
String.prototype.contains = function (text) {
    return this.indexOf(text) >= 0;
};
String.prototype.pathNormalize = function () {
    // zos
    return path.normalize(this.toString()).split(/[\\\/]/g).join(path.posix.sep);
};
function UpdateFromJSON(target, json) {
    var obj = JSON.parse(json);
    for (var prop in obj)
        target[prop] = obj[prop];
    return target;
}
exports.UpdateFromJSON = UpdateFromJSON;
// --------------------
// LINQ - light equivalent
Array.prototype.firstOrDefault = function (predicate) {
    for (var index = 0; index < this.length; index++) {
        var element = this[index];
        if (predicate == null || predicate(element))
            return element;
    }
    return null;
};
Array.prototype.first = function (predicate) {
    for (var index = 0; index < this.length; index++) {
        var element = this[index];
        if (predicate == null || predicate(element))
            return element;
    }
    throw new Error('The collection is empty');
};
Array.prototype.last = function (predicate) {
    for (var index = this.length - 1; index >= 0; index--) {
        var element = this[index];
        if (predicate == null || predicate(element))
            return element;
    }
    throw new Error('The collection is empty');
};
Array.prototype.lastOrDefault = function (predicate) {
    for (var index = this.length - 1; index >= 0; index--) {
        var element = this[index];
        if (predicate == null || predicate(element))
            return element;
    }
    return null;
};
Array.prototype.remove = function (item) {
    while (true) {
        var index = this.indexOf(item, 0);
        if (index > -1)
            this.splice(index, 1);
        else
            break;
    }
    return this;
};
Array.prototype.where = function (predicate) {
    return this.filter(predicate);
};
Array.prototype.cast = function () {
    return this.select(x => x);
};
Array.prototype.contains = function (item) {
    return this.any(x => x == item);
};
Array.prototype.any = function (predicate) {
    for (var i = 0; i < this.length; i++) {
        let item = this[i];
        if (predicate) {
            if (predicate(item))
                return true;
        }
        else {
            return true;
        }
    }
    return false;
};
Array.prototype.select = function (convert) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        var ci = convert(item);
        result.push(ci);
    }
    return result;
};
// -----------------
function with_lock(callback) {
    if (lock())
        try {
            callback();
        }
        catch (error) {
            unlock();
        }
}
exports.with_lock = with_lock;
function get_line_indent(text) {
    let line_indent = 0;
    let curr_line = text;
    for (; line_indent < curr_line.length; line_indent++) {
        if (curr_line.charAt(line_indent) != " ")
            break;
    }
    return line_indent;
}
exports.get_line_indent = get_line_indent;
function css_unescape_linebreaks(text, eol = "\n") {
    return text.replace(/\${r}\${n}/g, "\n").replace(/\${n}/g, eol);
}
exports.css_unescape_linebreaks = css_unescape_linebreaks;
function is_ready() {
    return _ready;
}
exports.is_ready = is_ready;
function is_busy() {
    return _busy;
}
exports.is_busy = is_busy;
function run_async(callback) {
    setTimeout(callback, 100);
}
exports.run_async = run_async;
function lock() {
    if (!_environment_ready) {
        return false;
    }
    if (!_ready) {
        vscode.window.showInformationMessage('CS-Script initialization is in progress.');
        return false;
    }
    if (_busy) {
        vscode.window.showInformationMessage('CS-Script is busy.');
        return false;
    }
    _busy = true;
    return true;
}
exports.lock = lock;
function unlock() {
    _busy = false;
}
exports.unlock = unlock;
function create_dir(dir) {
    // fs.mkdirSync can only create the top level dir but mkdirp creates all child sub-dirs that do not exist  
    const allRWEPermissions = parseInt("0777", 8);
    mkdirp.sync(dir, allRWEPermissions);
}
exports.create_dir = create_dir;
function delete_dir(dir) {
    let success = true;
    try {
        let files = fs.readdirSync(dir);
        for (let i = 0; i < files.length; i++) {
            let item_path = path.join(dir, files[i]);
            if (fs.lstatSync(item_path).isFile())
                try {
                    fs.unlinkSync(item_path);
                }
                catch (error) {
                    success = false;
                    console.log(error);
                }
            else
                delete_dir(item_path);
        }
        fs.rmdir(dir, () => { });
    }
    catch (error) {
        success = false;
        console.log(error);
    }
    return success;
}
exports.delete_dir = delete_dir;
function copy_file(src, dest) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}
exports.copy_file = copy_file;
function copy_file_to(fileName, srcDir, destDir) {
    fs.createReadStream(path.join(srcDir, fileName))
        .pipe(fs.createWriteStream(path.join(destDir, fileName)));
}
exports.copy_file_to = copy_file_to;
function copy_file_to_sync(fileName, srcDir, destDir) {
    try {
        fsx.copySync(path.join(srcDir, fileName), path.join(destDir, fileName));
    }
    catch (error) {
        console.log(error.toString());
    }
}
exports.copy_file_to_sync = copy_file_to_sync;
function copy_dir_to_sync(srcDir, destDir) {
    try {
        fsx.copySync(srcDir, destDir);
    }
    catch (error) {
        console.log(error.toString());
    }
}
exports.copy_dir_to_sync = copy_dir_to_sync;
function copy_file_to_sync2(fileName, newFileName, srcDir, destDir) {
    try {
        fsx.copySync(path.join(srcDir, fileName), path.join(destDir, newFileName));
    }
    catch (error) {
        console.log(error.toString());
    }
}
exports.copy_file_to_sync2 = copy_file_to_sync2;
function del_file(filePath) {
    fs.unlink(filePath, err => {
        if (err)
            console.log(err);
    });
}
exports.del_file = del_file;
function user_dir() {
    // ext_context.storagePath cannot be used as it is undefined if no workspace loaded
    // vscode:
    // Windows %appdata%\Code\User\settings.json
    // Mac $HOME/Library/Application Support/Code/User/settings.json
    // Linux $HOME/.config/Code/User/settings.json
    // extension location:
    //   portable:  <VSCode-dir>\data\extensions\oleg-shilo.cs-script-1.5.9\out
    //   installed: c:\Users\<user>\.vscode\extensions\oleg-shilo.cs-script-1.5.9\out
    //   debug:     <repo>\Projects\cs-script.vscode\out"
    let extensionRoot = path.dirname(path.dirname(path.dirname(__dirname)));
    let isPortable = path.basename(extensionRoot).toLowerCase() == "data" || path.basename(extensionRoot).toLowerCase() == "code-portable-data";
    if (!_user_dir) {
        if (isPortable) {
            _user_dir = path.join(extensionRoot, 'user-data', 'cs-script.user');
        }
        else {
            if (os.platform() == 'win32') { // win
                _user_dir = path.join(process.env.APPDATA, 'Code', 'User', 'cs-script.user');
            }
            else if (os.platform() == 'darwin') { // mac
                _user_dir = path.join(process.env.HOME, 'Library', 'Application Support', 'Code', 'User', 'cs-script.user');
            }
            else { // linux
                _user_dir = path.join(process.env.HOME, '.config', 'Code', 'User', 'cs-script.user');
            }
        }
    }
    create_dir(_user_dir);
    return _user_dir;
}
exports.user_dir = user_dir;
function check_syntaxer_ready(ms) {
    let attempts_count = 0;
    setTimeout(() => syntaxer_1.Syntaxer.ping((data) => {
        attempts_count++;
        if (data == "ready") {
            exports.statusBarItem.text = 'CS-Script Intellisense services are ready...';
            exports.statusBarItem.show();
            setTimeout(() => exports.statusBarItem.hide(), 5000);
        }
        else {
            exports.statusBarItem.text = 'CS-Script initializing...';
            exports.statusBarItem.show();
            let delay = 1000;
            if (attempts_count < (10000 / delay))
                check_syntaxer_ready(delay);
            else
                exports.statusBarItem.hide();
        }
    }), ms);
}
function deploy_engine() {
    try {
        // do not deploy if it is external link to css_config.dll
        // all copy_file* calls are  async operations
        let need_to_deploy = true;
        if (fs.existsSync(ver_file)) {
            try {
                let version = fs.readFileSync(ver_file, 'utf8');
                need_to_deploy = (version != exports.ext_version);
            }
            catch (error) {
            }
        }
        if (!exports.settings.cscs.startsWith(user_dir()))
            need_to_deploy = false;
        if (need_to_deploy) {
            vscode.window.showInformationMessage('Preparing new version of CS-Script for deployment.');
            exports.statusBarItem.text = '$(versions) Deploying CS-Script...';
            exports.statusBarItem.show();
            run_async(deploy_files); // will set _ready = true;
        }
        else {
            syntaxer_1.start_syntaxer();
            _ready = true;
        }
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage('CS-Script: ' + String(error));
    }
}
exports.deploy_engine = deploy_engine;
function compare_versions(a, b) {
    let parts_a = a.split('.');
    let parts_b = b.split('.');
    let i = 0;
    for (; i < Math.min(parts_a.length, parts_b.length); i++) {
        let v_a = parseInt(parts_a[i]);
        let v_b = parseInt(parts_b[i]);
        if (v_a > v_b)
            return 1;
        if (v_a < v_b)
            return -1;
    }
    if (parts_a.length > parts_b.length)
        return 1;
    if (parts_a.length < parts_b.length)
        return -1;
    else
        return 0;
}
exports.compare_versions = compare_versions;
function check_environment() {
    _environment_ready = true;
    // prev editions required some env initialization
    // this code should be removed in the future releases
    return;
}
function deploy_files() {
    try {
        let dotnet_dir = path.join(user_dir(), "dotnet");
        let syntaxer_dir = path.join(dotnet_dir, "syntaxer");
        let src_dir = path.join(exports.ext_dir, 'bin', 'dotnet');
        syntaxer_1.Syntaxer.sentStopRequest();
        let deleted_old = delete_dir(syntaxer_dir);
        deleted_old = deleted_old && delete_dir(dotnet_dir);
        copy_dir_to_sync(src_dir, dotnet_dir);
        ensure_default_config(path.join(user_dir(), 'dotnet', 'cscs.dll'));
        syntaxer_1.start_syntaxer(); // will also deploy embedded Roslyn binaries
        check_syntaxer_ready(500);
        fs.writeFileSync(ver_file, exports.ext_version, { encoding: 'utf8' });
        if (deleted_old)
            vscode.window.showInformationMessage('New version of CS-Script binaries has been deployed.');
        else
            vscode.window.showInformationMessage('New version of CS-Script binaries has been deployed.\n' +
                'However "' + dotnet_dir + '" directory was not cleaned properly because it was locked.\n' +
                'It is recommended that you close VSCode and remove the directory manually.');
        _ready = true;
        // commands.executeCommand('cs-script.refresh_tree');
        // vscode.window.showErrorMessage('CS-Script: Roslyn provider has been deployed');
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage('CS-Script: ' + String(error));
    }
}
function prepare_new_script() {
    let template_file = path.join(user_dir(), 'new_script.tmpl');
    let template = 'using System;' + os.EOL +
        '$backup_comment$' + os.EOL +
        'Console.WriteLine($"Hello {user()}...");' + os.EOL +
        os.EOL +
        'string user()' + os.EOL +
        '    => Environment.UserName;';
    // if (!fs.existsSync(template_file))
    fs.writeFileSync(template_file, template, { encoding: 'utf8' });
    try {
        template = fs.readFileSync(template_file, { encoding: 'utf8' });
    }
    catch (error) {
    }
    return template;
}
exports.prepare_new_script = prepare_new_script;
function prepare_new_script_vb() {
    let template_file = path.join(user_dir(), 'new_script_vb.tmpl');
    let template = "' //css_ref System" + os.EOL +
        "' //css_ref System.web" + os.EOL +
        "' //css_ref System.Windows.Forms" + os.EOL +
        "$backup_comment$" + os.EOL +
        "Imports System" + os.EOL +
        "" + os.EOL +
        "Imports System.Windows.Forms" + os.EOL +
        "" + os.EOL +
        "Module Module1" + os.EOL +
        "    Sub Main()" + os.EOL +
        "        Console.WriteLine(\"Hello World! (VB)\")" + os.EOL +
        "        MessageBox.Show(\"Hello World! (VB)\")" + os.EOL +
        "    End Sub" + os.EOL +
        "End Module";
    if (!fs.existsSync(template_file))
        fs.writeFileSync(template_file, template, { encoding: 'utf8' });
    try {
        template = fs.readFileSync(template_file, { encoding: 'utf8' });
    }
    catch (error) {
    }
    return template;
}
exports.prepare_new_script_vb = prepare_new_script_vb;
function clear_temp_file_suffixes(content) {
    // "c:\Users\<user>\AppData\Roaming\Code\User\cs-script.user\new_script.$temp$.cs(16,9): Test();
    return content.replace(/.\$temp\$/g, '');
}
exports.clear_temp_file_suffixes = clear_temp_file_suffixes;
function select_line(line) {
    let editor = vscode.window.activeTextEditor;
    if (line != -1) {
        editor.selection = new vscode.Selection(line, editor.document.lineAt(line).text.length, line, 0);
        editor.revealRange(editor.selection);
    }
}
exports.select_line = select_line;
function save_as_temp(content, script_file, inject_source_info) {
    let id = crypto.randomBytes(16).toString("hex");
    let ext = path.extname(script_file);
    let link_info = "//css_syntaxer source:" + script_file;
    let temp_file = path.join(sources_temp_dir, id + ext);
    if (inject_source_info)
        content = link_info + "\n" + content;
    fs.writeFileSync(temp_file, content, { encoding: 'utf8' });
    return temp_file;
}
exports.save_as_temp = save_as_temp;
function toSignatureInfo(data) {
    let result;
    let sig_lines = css_unescape_linebreaks(data).lines();
    sig_lines.forEach(line => {
        if (line.length > 1) {
            if (line.startsWith("label:")) {
                result = new vscode_1.SignatureInformation(line.substr("label:".length));
            }
            else if (line.startsWith("doc:")) {
                result.documentation = line.substr("doc:".length);
            }
            else if (line.startsWith("param_label:")) {
                result.parameters.push(new vscode_1.ParameterInformation(line.substr("param_label:".length)));
            }
            else if (line.startsWith("param_doc:")) {
                let param = result.parameters.lastOrDefault();
                if (param != null) {
                    param.documentation = new vscode_1.MarkdownString(`\`${param.label}\` - ${line.substr("param_doc:".length)}`);
                }
            }
            else {
                // continuation of the previous text aggregation 
                if (result != null && result.parameters.any() && result.parameters.last().documentation != null) {
                    result.parameters.last().documentation += "\n" + line;
                }
                else if (result != null && result.parameters.any()) {
                    result.parameters.last().label += "\n" + line;
                }
                else if (result != null && result.documentation != null) {
                    result.documentation += "\n" + line;
                }
                else if (result != null) {
                    result.label += "\n" + line;
                }
            }
        }
    });
    if (result != null && result.documentation)
        result.documentation = new vscode_1.MarkdownString(`_${result.documentation}_`);
    return result;
}
exports.toSignatureInfo = toSignatureInfo;
class ErrorInfo {
    constructor(fields) {
        if (fields)
            Object.assign(this, fields);
    }
    static parse(data) {
        // E:\dev\Projects\VSCode\test2.cs(19,11): error CS1525: Unexpected symbol `.', expecting `,', `;', or `='
        // csscript.CompilerException: c:\Users\user\Desktop\New Script.cs(12,17): error CS0029: Cannot implicitly convert type `string' to `int'
        let result = new ErrorInfo();
        try {
            let cs_script_prefixes = ["csscript.CompilerException: ", "file:"];
            cs_script_prefixes.forEach(element => {
                if (data.startsWith(element))
                    data = data.replace(element, '').trim();
            });
            let parts = data.split(/\):/g, 2);
            if (parts.length != 2) {
                if (fs.existsSync(parts[0])) {
                    result.file = clear_temp_file_suffixes(parts[0]);
                    result.range = new vscode.Range(0, 0, 0, 0);
                }
                else {
                    return null;
                }
            }
            else {
                result.description = parts[1].trim();
                parts = parts[0].split('(');
                result.file = parts[0];
                let nums = parts[1].split(',', 2).map(x => Number(x));
                result.range = new vscode.Range(nums[0] - 1, nums[1] - 1, nums[0] - 1, nums[1] - 1);
                parts = result.description.split(' ');
                result.description = parts.slice(1).join(' ');
                if (parts[0] == "error")
                    result.severity = vscode.DiagnosticSeverity.Error;
                else if (parts[0] == "warning")
                    result.severity = vscode.DiagnosticSeverity.Warning;
                if (parts[0] == "info")
                    result.severity = vscode.DiagnosticSeverity.Information;
            }
        }
        catch (e) {
            return null;
        }
        return result;
    }
}
exports.ErrorInfo = ErrorInfo;
// Writable extension settings
class Settings {
    constructor() {
        this.show_load_proj_info = true;
        this.show_readme = true;
        this.need_check_roslyn_on_OSX = true;
        // alternative approach
        // let config = ext_context.globalState;
        // let val = config.get("show_load_proj_info", true);
        // config.update("show_load_proj_info", true);
    }
    static Save(_this, file) {
        // needs to be a static as for Settings.Load can possibly return json object without any methods
        let file_path = path.join(user_dir(), 'settings.json');
        if (file != null)
            file_path = file;
        else if (_this._file != null)
            file_path = _this._file;
        fs.writeFileSync(file_path, JSON.stringify(_this), { encoding: 'utf8' });
    }
    static Load(file) {
        let file_path = path.join(user_dir(), 'settings.json');
        if (file != null)
            file_path = file;
        let settings;
        try {
            settings = new Settings();
            let json = fs.readFileSync(file_path, 'utf8');
            UpdateFromJSON(settings, json);
        }
        catch (e) {
            // do nothing, just continue with the fresh settings object
        }
        settings._file = file_path;
        return settings;
    }
    get cscs() {
        let _cscs = vscode.workspace.getConfiguration("cs-script").get("engine.cscs_path", "<default>");
        if (!_cscs || _cscs == "" || _cscs == "<default>")
            _cscs = path.join(user_dir(), "dotnet", "cscs.dll");
        return _cscs;
    }
    get syntaxer() {
        let _syntaxer = vscode.workspace.getConfiguration("cs-script").get("engine.syntaxer_path", "<default>");
        if (!_syntaxer || _syntaxer == "" || _syntaxer == "<default>")
            return path.join(user_dir(), "dotnet", "syntaxer", "syntaxer.dll");
        else
            return _syntaxer;
    }
    get syntaxerPort() {
        return vscode.workspace.getConfiguration("cs-script").get("engine.syntaxer_port", 18003);
    }
}
exports.Settings = Settings;
class Utils {
    static IsScript(file) {
        if (file == undefined)
            return false;
        else
            return file.toLowerCase().endsWith('.cs') || file.toLowerCase().endsWith('.vb');
    }
    static getScriptName(projectFile) {
        if (fs.existsSync(projectFile)) {
            let lines = fs.readFileSync(projectFile, 'utf8').lines();
            for (var line of lines) {
                if (line.contains('Compile')) {
                    return line.trim()
                        .replace('<Compile Include="', '')
                        .replace('"/>', '');
                }
            }
        }
        return null;
    }
    static getScriptFiles(projectFile) {
        let files = [];
        if (fs.existsSync(projectFile)) {
            let lines = fs.readFileSync(projectFile, 'utf8').lines();
            for (var line of lines) {
                if (line.contains('Compile')) {
                    files.push(line.trim()
                        .replace('<Compile Include="', '')
                        .replace('"/>', ''));
                }
            }
        }
        return files;
    }
    // public static getSearchDirs(projectFile: string): string[] {
    //     let dirs = [];
    //     if (fs.existsSync(projectFile)) {
    //         let lines = fs.readFileSync(projectFile, 'utf8').lines();
    //         for (var line of lines) {
    //             if (line.contains('Probing')) {
    //                 dirs.push(line.trim()
    //                     .replace('<Probing Dir="', '')
    //                     .replace('"/>', ''));
    //             }
    //         }
    //     }
    //     return dirs;
    // }
    static IsSamePath(abs_path1, abs_path2) {
        if (abs_path1 != null && abs_path2 != null) {
            if (path.sep == "\\")
                return (abs_path1.toLowerCase() == abs_path2.toLowerCase()); // Windows
            else
                return (abs_path1 == abs_path2); // POSIX
        }
        return false;
    }
    static SentToDiagnostics(errors) {
        exports.diagnosticCollection.clear();
        let diagnosticMap = new Map();
        errors.forEach(error => {
            let fileUri = vscode.Uri.file(error.file);
            let canonicalFile = fileUri.toString();
            let diagnostics = diagnosticMap.get(canonicalFile);
            if (!diagnostics) {
                diagnostics = [];
            }
            diagnostics.push(new vscode.Diagnostic(error.range, error.description, error.severity));
            diagnosticMap.set(canonicalFile, diagnostics);
            diagnosticMap.forEach((diags, file) => {
                exports.diagnosticCollection.set(fileUri, diags);
            });
        });
    }
    static RunSynch(command) {
        return execSync(command).toString();
    }
    static Run(command, on_done) {
        let output = '';
        let p = exec(command);
        p.stdout.on('data', (data) => {
            let buf = data;
            output += data;
            if (buf.indexOf('Processing NuGet packages...') != -1)
                vscode.window.showInformationMessage('Restoring NuGet packages...');
        });
        p.stderr.on('data', (data) => output += data);
        p.on('close', (code) => {
            if (on_done)
                on_done(code, output);
        });
    }
    static Run2(command, on_data, on_done) {
        let output = '';
        let p = exec(command);
        p.stdout.on('data', (data) => {
            output += data;
            on_data(data);
        });
        p.stderr.on('data', (data) => output += data);
        p.on('close', (code) => {
            if (on_done)
                on_done(code, output);
        });
    }
}
exports.Utils = Utils;
function preload_roslyn() {
    try {
        let exe = path.join(user_dir(), 'mono', 'cscs.exe');
        let command = 'mono "' + exe + '" -preload';
        Utils.Run(command);
    }
    catch (error) {
    }
}
exports.preload_roslyn = preload_roslyn;
function disable_roslyn_on_osx() {
    if (os.platform() == 'darwin' && exports.settings.need_check_roslyn_on_OSX) {
        let config_file = path.join(user_dir(), 'mono', 'css_config.mono.xml');
        if (fs.existsSync(config_file)) {
            let config_data = fs.readFileSync(config_file, 'utf8');
            let patched = false;
            if (config_data.includes("<useAlternativeCompiler></useAlternativeCompiler>")) {
                config_data = config_data.replace("<useAlternativeCompiler></useAlternativeCompiler>", "<useAlternativeCompiler>none</useAlternativeCompiler>");
                patched = true;
            }
            if (config_data.includes("<useAlternativeCompiler>CSSRoslynProvider.dll</useAlternativeCompiler>")) {
                config_data = config_data.replace("<useAlternativeCompiler>CSSRoslynProvider.dll</useAlternativeCompiler>", "<useAlternativeCompiler>none</useAlternativeCompiler>");
                patched = true;
            }
            if (patched) {
                vscode_1.window.showErrorMessage("CS-Script: Due to the problems with Mono implementation of 'ICodeCompiler' on OSX the supported script syntax is reduced to C#6.");
                exports.settings.need_check_roslyn_on_OSX = false;
                Settings.Save(exports.settings);
                fs.writeFileSync(config_file, config_data, { encoding: 'utf8' });
            }
        }
    }
}
exports.disable_roslyn_on_osx = disable_roslyn_on_osx;
function ensure_default_core_config(cscs_exe, on_done) {
    let config_file = path.join(path.dirname(cscs_exe), 'css_config.xml');
    if (!fs.existsSync(config_file)) {
        let command = `dotnet "${cscs_exe}" -config:default`;
        Utils.Run(command, (code, output) => {
            fs.writeFileSync(config_file, output, { encoding: 'utf8' });
            if (on_done)
                on_done(config_file);
        });
    }
    else if (on_done)
        on_done(config_file);
}
exports.ensure_default_core_config = ensure_default_core_config;
function ensure_default_config(cscs_exe, on_done) {
    let config_file = path.join(path.dirname(cscs_exe), 'css_config.mono.xml');
    if (!fs.existsSync(config_file)) {
        // deployed file may still be unavailable so use the original one
        let original_cscs_exe = path.join(exports.ext_dir, 'bin', 'cscs.dll');
        let command = 'dotnet "' + original_cscs_exe + '" -config:default';
        Utils.Run(command, (code, output) => {
            if (on_done)
                on_done(config_file);
        });
    }
    else {
        if (on_done)
            on_done(config_file);
    }
}
exports.ensure_default_config = ensure_default_config;
function actual_output(element, index, array) {
    // ignore mono test output that comes from older releases(s)  (known Mono issue)
    return (!element.startsWith('failed to get 100ns ticks') &&
        !element.startsWith('Mono pdb to mdb debug symbol store converter') &&
        !element.startsWith('Usage: pdb2mdb assembly'));
}
exports.actual_output = actual_output;
exports.BuiltInCommands = {
    CloseActiveEditor: 'workbench.action.closeActiveEditor',
    NextEditor: 'workbench.action.nextEditor',
    Open: 'vscode.open',
    SetContext: 'setContext'
};
function ActivateDiagnostics(context) {
    var _a, _b;
    console.log("Loading CS-Script extension from " + __dirname);
    // check extension dependencies
    if (vscode.extensions.getExtension('ms-vscode.csharp') == null &&
        vscode.extensions.getExtension('ms-dotnettools.csharp') == null) {
        let message = 'The required extension "C# for Visual Studio Code" is not found. Ensure it is installed.';
        vscode.window.showErrorMessage(message);
        throw message;
    }
    // if (vscode.extensions.getExtension('ms-vscode.mono-debug') == null) {
    //     let message = 'The required extension "Mono-Debug" is not found. Ensure it is installed.';
    //     vscode.window.showErrorMessage(message);
    //     throw message;
    // }
    // _environment_compatible = true;
    exports.diagnosticCollection = vscode.languages.createDiagnosticCollection('c#');
    exports.statusBarItem = vscode.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
    context.subscriptions.push(exports.diagnosticCollection);
    // ext_context = context;
    exports.ext_version = (_a = vscode.extensions.getExtension('oleg-shilo.cs-script')) === null || _a === void 0 ? void 0 : _a.packageJSON.version;
    exports.omnisharp_dir = path.join((_b = vscode.extensions.getExtension('ms-dotnettools.csharp')) === null || _b === void 0 ? void 0 : _b.extensionPath, '.omnisharp', 'omnisharp');
    ver_file = path.join(user_dir(), 'vscode.css_version.txt');
    exports.settings = Settings.Load();
    check_environment();
    deploy_engine();
    // disable_roslyn_on_osx();
    return exports.diagnosticCollection;
}
exports.ActivateDiagnostics = ActivateDiagnostics;
class ActiveEditorTracker extends vscode_1.Disposable {
    constructor() {
        super(() => this.dispose());
        this._disposable = vscode_1.window.onDidChangeActiveTextEditor(e => this._resolver && this._resolver(e));
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    awaitClose(timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            this.close();
            return this.wait(timeout);
        });
    }
    awaitNext(timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            this.next();
            return this.wait(timeout);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode_1.commands.executeCommand(exports.BuiltInCommands.CloseActiveEditor);
        });
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode_1.commands.executeCommand(exports.BuiltInCommands.NextEditor);
        });
    }
    wait(timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            const editor = yield new Promise((resolve, reject) => {
                let timer;
                // this._resolver = (value?: TextEditor | PromiseLike<TextEditor>) => { // zos
                // @ts-ignore
                this._resolver = (value) => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = 0;
                        resolve(value);
                    }
                };
                timer = setTimeout(() => {
                    resolve(vscode_1.window.activeTextEditor);
                    timer = 0;
                }, timeout);
            });
            this._resolver = undefined;
            return editor;
        });
    }
}
exports.ActiveEditorTracker = ActiveEditorTracker;
//# sourceMappingURL=utils.js.map