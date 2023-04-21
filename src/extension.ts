/* eslint-disable curly */
import * as vscode from 'vscode';
import { getUnUsedProjectComponents } from "./utils/component/componentUtils";
import { ComponentModel } from "./models/models";


export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('ngbox.scan', () => {
		// find the current workspace folder
		const currentWorkspace = vscode.workspace.workspaceFolders?.[0];
		const projectPath = currentWorkspace?.uri.fsPath;
		//log(vscode.workspace.workspaceFolders);
		if (projectPath) {
			const unusedComponents = scanForUnusedComponents(projectPath);
			const panel = vscode.window.createWebviewPanel(
				'unusedComponents',
				'Unused Components',
				vscode.ViewColumn.Two,
				{},
			);
			panel.webview.html = getWebviewContent(unusedComponents);
		}
		else {
			vscode.window.showErrorMessage('No Angular project found in workspace!');
		}
	});
	context.subscriptions.push(disposable);
}

function scanForUnusedComponents(projectPath: string): ComponentModel[] {
	return getUnUsedProjectComponents(projectPath, "not-used");
}

function getWebviewContent(_unusedComponents: ComponentModel[]): string {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Unused Components</title>
	</head>
	<body>
		<h1>Unused Components</h1>
		<table>
			<thead>
				<tr>
					<th>Component</th>
				</tr>
			</thead>
			<tbody>
				${_unusedComponents.map(component => `
						<tr><td>${component.className}</td></tr>
`).join('')}
			</tbody>		
        </table>
	</body>
	</html>`;

}
