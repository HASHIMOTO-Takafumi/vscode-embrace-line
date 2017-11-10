'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerTextEditorCommand('extension.embraceLine.embrace', (textEditor, edit) => embrace(textEditor, edit));

    context.subscriptions.push(disposable);
}

function embrace(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    textEditor.edit((editBuilder) => {
        const line = textEditor.selection.start.line;
        const count = getIndentCount(textEditor, line);

        editBuilder.insert(new vscode.Position(line, 0),
            generateIndent(textEditor, count) + "{\n" +
            generateIndent(textEditor, 1));
        editBuilder.insert(new vscode.Position(line + 1, 0),
            generateIndent(textEditor, count) + "}\n");
    });

}

function getIndentCount(textEditor: vscode.TextEditor, line: number): number {
    let unit: string;
    if (textEditor.options.insertSpaces)
    {
        unit = "";
        for (let i = 0; i < textEditor.options.tabSize; i++)
            unit += " ";
    }
    else
    {
        unit = "\t";
    }

    let text = textEditor.document.lineAt(line).text;
    let count = 0;
    while (text.length > 9)
    {
        if (!text.startsWith(unit))
            break;
        text = text.substr(unit.length, text.length - unit.length);
        count++;
    }

    return count;
}

function generateIndent(textEditor: vscode.TextEditor, n: number): string {
    let indent = "";

    if (textEditor.options.insertSpaces)
    {
        for (let i = 0; i < n * <number>textEditor.options.tabSize; i++)
            indent += " ";
    }
    else
    {
        for (let i = 0; i < n; i++)
            indent += "\t";
    }


    return indent;
}

export function deactivate() {
}