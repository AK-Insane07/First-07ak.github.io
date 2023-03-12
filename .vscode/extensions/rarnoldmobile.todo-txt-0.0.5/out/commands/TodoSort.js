"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const AppConstants_1 = require("../utils/AppConstants");
var ToDoSort;
(function (ToDoSort) {
    let SortType;
    (function (SortType) {
        SortType["PRIORITY"] = "priority";
        SortType["CONTEXT"] = "context";
        SortType["PROJECT"] = "project";
        SortType["DUE_DATE"] = "due";
    })(SortType = ToDoSort.SortType || (ToDoSort.SortType = {}));
    function SortLines(iSortType) {
        let editor = vscode.window.activeTextEditor;
        let docObject = convertDocToList(editor.document);
        let sortedObject = sortByKey(iSortType.valueOf(), docObject);
        deleteAndPopulate(editor, sortedObject);
    }
    ToDoSort.SortLines = SortLines;
    function convertDocToList(iDoc) {
        var finalArray = new Array();
        for (var i = 0; i < iDoc.lineCount; i++) {
            let lineText = iDoc.lineAt(i).text;
            let projectFlag = parseRegexResponse(lineText.match(AppConstants_1.default.PROJECT_REGEX));
            let contextFlag = parseRegexResponse(lineText.match(AppConstants_1.default.CONTEXT_REGEX));
            let dueFlag = parseRegexResponse(lineText.match(AppConstants_1.default.DUE_REGEX));
            let priorityFlag = parseRegexResponse(lineText.match(AppConstants_1.default.PRIORITY_REGEX));
            finalArray.push({ "line": i, "lineText": lineText, "project": projectFlag, "context": contextFlag, "due": dueFlag, "priority": priorityFlag });
        }
        return finalArray;
    }
    function parseRegexResponse(regexResponse) {
        if (regexResponse != null) {
            return regexResponse.pop();
        }
        return "z";
    }
    function sortByKey(iKey, iArray) {
        var sortedArray = iArray.sort((obj1, obj2) => {
            if (obj1[iKey.toString()] > obj2[iKey.toString()]) {
                return 1;
            }
            if (obj1[iKey.toString()] < obj2[iKey.toString()]) {
                return -1;
            }
            return 0;
        });
        return sortedArray;
    }
    function deleteAndPopulate(editor, docObject) {
        editor.edit(builder => {
            for (var i = 0; i < docObject.length; i++) {
                let replaceRange = editor.document.lineAt(i).range;
                let lineText = docObject[i]["lineText"];
                builder.replace(replaceRange, lineText);
            }
        });
        editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
    }
})(ToDoSort = exports.ToDoSort || (exports.ToDoSort = {}));
//# sourceMappingURL=ToDoSort.js.map