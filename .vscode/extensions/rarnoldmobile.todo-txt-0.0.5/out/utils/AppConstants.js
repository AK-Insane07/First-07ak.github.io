"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppConstants {
}
AppConstants.ACCEPTED_FILENAMES = [
    'todo.txt',
    'done.txt'
];
AppConstants.ARCHIVE_FILENAME = 'done.txt';
AppConstants.TODO_FILENAME = 'todo.txt';
AppConstants.DATE_REGEX = new RegExp(/\d{4}-\d{2}-\d{2}/g);
AppConstants.PROJECT_REGEX = new RegExp(/\B\+\w+/g);
AppConstants.CONTEXT_REGEX = new RegExp(/\B\@\w+/g);
AppConstants.PRIORITY_REGEX = new RegExp(/[(][A-Z][)]/g);
AppConstants.DUE_REGEX = new RegExp(/due\s*:\d{4}-\d{2}-\d{2}/g);
exports.default = AppConstants;
//# sourceMappingURL=AppConstants.js.map