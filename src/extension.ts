/* eslint-disable curly */
import * as vscode from 'vscode';
import { getScanWebviewContent, scanForUnusedComponents } from './app';


export function activate(context: vscode.ExtensionContext) {
	/**
	 * @description This method is called to scan for unused components
	 * @param context 
	 * @returns unused components list in a webview panel 
	 */
	const scanForUnusedComponentsCommand = vscode.commands.registerCommand('ngbox.scan.components', async () => {
		const statusBarItem = vscode.window.setStatusBarMessage('Scanning for unused components...');
		//show status bar text while scanning
		const statusBarItemText = vscode.window.setStatusBarMessage('Scanning for unused components...');

		const projectPath = getWorkingDirectory();
		//add ngbox name to status bar
		if (!projectPath) {
			return;
		}
		try {
			const unusedComponents = await scanForUnusedComponents(projectPath);
			const panel = vscode.window.createWebviewPanel(
				'unusedComponents',
				'Unused Components',
				vscode.ViewColumn.Two,
				{},
			);
			panel.webview.html = getScanWebviewContent(unusedComponents);
		} catch (error) {
			vscode.window.showErrorMessage(`Error scanning for unused components: ${error}`);
		} finally {
			statusBarItem.dispose();
			//statusBarItemText.dispose();
		}
	});
	context.subscriptions.push(scanForUnusedComponentsCommand);


	/**
	 * @description This method is called to get unused modules
	 * @param context
	 */
	const getUnusedModulesCommand = vscode.commands.registerCommand('ngbox.scan.modules', () => {
		vscode.window.showInformationMessage('Hello from command ngbox.scan.module!');
	});
	context.subscriptions.push(getUnusedModulesCommand);


}


export function deactivate() {

}

export const getWorkingDirectory = () => {
	const currentWorkspace = vscode.workspace.workspaceFolders?.[0];
	const projectPath = currentWorkspace?.uri.fsPath;
	if (!projectPath) {
		vscode.window.showErrorMessage('No Angular project found in workspace!');
		return;
	}
	return projectPath;
}
