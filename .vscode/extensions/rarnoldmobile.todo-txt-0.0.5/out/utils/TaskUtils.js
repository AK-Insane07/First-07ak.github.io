"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var TaskUtils;
(function (TaskUtils) {
    function determineEOL(eolValue) {
        if (eolValue == vscode.EndOfLine.CRLF) {
            return '\r\n';
        }
        return '\n';
    }
    TaskUtils.determineEOL = determineEOL;
    function deleteLines(lineDeletes, editor, doc) {
        let sortedLines = lineDeletes.reverse();
        if (sortedLines.length > 0) {
            editor.edit(builder => {
                sortedLines.forEach(a => {
                    builder.delete(doc.lineAt(a.valueOf()).rangeIncludingLineBreak);
                });
            }).then(() => { });
        }
    }
    TaskUtils.deleteLines = deleteLines;
    function isTaskComplete(lineText) {
        if (lineText.substring(0, 2).toLowerCase() == "x ") {
            return true;
        }
        return false;
    }
    TaskUtils.isTaskComplete = isTaskComplete;
})(TaskUtils = exports.TaskUtils || (exports.TaskUtils = {}));
//# sourceMappingURL=TaskUtils.js.map