"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Syntaxer = exports.start_syntaxer = void 0;
const fs = require("fs");
const net = require("net");
const process = require("process");
const child_process = require("child_process");
const utils_1 = require("./utils");
function start_syntaxer() {
    let runtime = "dotnet";
    let SERVER = utils_1.settings.syntaxer;
    let CSCS = utils_1.settings.cscs;
    let PORT = utils_1.settings.syntaxerPort;
    let args = [SERVER, `-port:${PORT}`, "-listen", `-client:${process.pid}`, "-timeout:60000", `-cscs_path:${CSCS}`];
    child_process.execFile(runtime, args, (error, stdout, stderr) => {
        console.log(stderr);
        console.log(stdout);
    });
}
exports.start_syntaxer = start_syntaxer;
class Syntaxer {
    static init() {
    }
    static sentStopRequest() {
        let client = new net.Socket();
        client.connect(utils_1.settings.syntaxerPort, '127.0.0.1', function () {
            client.write('-exit');
        });
    }
    static send(request, onData) {
        // 18000 - Sublime Text 3
        // 18001 - Notepad++
        // 18002 - VSCode.CodeMap
        // 18003 - VSCode.CS-Script
        try {
            let client = new net.Socket();
            client.connect(utils_1.settings.syntaxerPort, '127.0.0.1', function () {
                client.write(request);
            });
            client.on('error', function (error) {
                let server_exe = utils_1.settings.syntaxer;
                if (fs.existsSync(server_exe)) { // may not started yet (or crashed)
                    start_syntaxer();
                }
            });
            client.on('data', function (data) {
                let response = data.toString();
                client.destroy();
                if (onData)
                    onData(response);
            });
        }
        catch (error) {
        }
    }
    static send_request(request, code, file, resolve, inject_source_info = true) {
        let temp_file = utils_1.save_as_temp(code, file, inject_source_info);
        Syntaxer.send(request.replace("$temp_file$", temp_file), data => {
            // possibly it is a temp file reference
            resolve(utils_1.clear_temp_file_suffixes(data));
            fs.unlink(temp_file, error => { });
        });
    }
    static getCompletions(code, file, position, resolve) {
        let request = `-client:${process.pid}\n-op:completion\n-script:$temp_file$\n-pos:${position}\n-doc`;
        Syntaxer.send_request(request, code, file, resolve);
    }
    static suggestUsings(code, file, word, resolve) {
        let request = `-client:${process.pid}\n-op:suggest_usings:${word}\n-script:$temp_file$`;
        Syntaxer.send_request(request, code, file, resolve);
    }
    static getSignatureHelp(code, file, position, resolve) {
        let request = `-client:${process.pid}\n-op:signaturehelp\n-script:$temp_file$\n-pos:${position}`;
        Syntaxer.send_request(request, code, file, resolve);
    }
    static getTooltip(code, file, position, resolve) {
        let hint = '';
        let request = `-client:${process.pid}\n-op:tooltip:${hint}\n-script:$temp_file$\n-pos:${position}`;
        Syntaxer.send_request(request, code, file, resolve);
    }
    static getRefrences(code, file, position, resolve) {
        let request = `-client:${process.pid}\n-op:references\n-script:$temp_file$\n-pos:${position}`;
        Syntaxer.send_request(request, code, file, resolve);
    }
    // Just to show that it's possible to go Thenable. Used in `find_references()`.
    // Unfortunately all intellisense providers cannot take advantage of this as their signatures are not async.  
    static getReferencesAsync(code, file, position) {
        return new Promise((resolve, reject) => {
            let request = `-client:${process.pid}\n-op:references\n-script:$temp_file$\n-pos:${position}`;
            Syntaxer.send_request(request, code, file, resolve);
        });
    }
    static getRenamingInfo(code, file, position, resolve) {
        let request = `-client:${process.pid}\n-op:references\n-context:all\n-script:$temp_file$\n-pos:${position}`;
        Syntaxer.send_request(request, code, file, resolve);
    }
    static ping(resolve) {
        let request = `-client:${process.pid}\n-op:ping`;
        let client = new net.Socket();
        client.connect(utils_1.settings.syntaxerPort, '127.0.0.1', () => client.write(request));
        client.on('data', data => {
            let response = data.toString();
            client.destroy();
            resolve(response);
        });
        client.on('error', () => resolve("error"));
    }
    static doDocFormat(code, file, position, resolve) {
        let request = `-client:${process.pid}\n-op:format\n-script:$temp_file$\n-pos:${position}`;
        Syntaxer.send_request(request, code, file, resolve, false);
    }
    static getDefinition(code, file, position, resolve) {
        let request = `-client:${process.pid}\n-op:resolve\n-script:$temp_file$\n-pos:${position}`;
        Syntaxer.send_request(request, code, file, resolve);
    }
}
exports.Syntaxer = Syntaxer;
//# sourceMappingURL=syntaxer.js.map