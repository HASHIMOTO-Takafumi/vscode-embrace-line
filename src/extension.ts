'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerTextEditorCommand('extension.embraceLine.embrace', (textEditor, edit) => embrace(textEditor, edit));

    context.subscriptions.push(disposable);
}

function embrace(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    textEditor.edit((editBuilder) => {
        const [start, end] = getSelection(textEditor);
        const count = getIndentCount(textEditor, start);

        editBuilder.insert(new vscode.Position(start, 0),
            generateIndent(textEditor, count) + "{\n" +
            generateIndent(textEditor, 1));
        for (let i = start + 1; i <= end; i++)
        {
            editBuilder.insert(new vscode.Position(i, 0),
                generateIndent(textEditor, 1));
        }
        editBuilder.insert(new vscode.Position(end + 1, 0),
            generateIndent(textEditor, count) + "}\n");
    });

}

function getSelection(textEditor: vscode.TextEditor): [number, number] {
    const start = textEditor.selection.start;
    const end = textEditor.selection.end;

    let startChar = start.character;
    let endChar = end.character;
    let startLine = start.line;
    let endLine = end.line;

    while (startLine < endLine)
    {
        const startLineText = textEditor.document.lineAt(startLine).text;
        if (startLineText.substr(startChar).trim() == "")
        {
            startLine++;
            startChar = 0;
        }
        else
            break;
    }

    while (startLine < endLine)
    {
        const endLineText = textEditor.document.lineAt(endLine).text;
        if (endLineText.substr(0, endChar).trim() == "")
        {
            endLine--;
            endChar = undefined;
        }
        else
            break;
    }

    return [startLine, endLine];
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
    while (text.length > 0)
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