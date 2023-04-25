/* eslint-disable curly */
import * as vscode from 'vscode';
import { getScanWebviewContent, scanForUnusedComponents } from './app';
import { orderAllComponents } from './utils/component/componentUtils';


export function activate(context: vscode.ExtensionContext) {
	/**
	 * @description This method is called to scan for unused components
	 * @param context 
	 * @returns unused components list in a webview panel 
	 */
	const scanForUnusedComponentsCommand = vscode.commands.registerCommand('ngbox.scan.components', async () => {
		// const statusBarItem = vscode.window.setStatusBarMessage('Scanning for unused components...');
		//show status bar text while scanning
		const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
		statusBarItem.text = "NgBox : $(sync~spin) Loading...";
		statusBarItem.show();
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
			panel.webview.html = getScanWebviewContent(unusedComponents, "Unused Components");
			statusBarItem.text = "NgBox : $(check) Operation successful";
			setTimeout(() => {
				statusBarItem.hide();
			}, 3000);
		} catch (error) {
			//vscode.window.showErrorMessage(`Error scanning for unused components: ${error}`);
			statusBarItem.text = "NgBox : $(error) Operation failed";
			setTimeout(() => {
				statusBarItem.hide();
			}, 3000);
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


	const orderAllComponentsCommand = vscode.commands.registerCommand('ngbox.order.components', () => {
		vscode.window.showInformationMessage('Hello from command ngbox.order.components!');
		try {
			const projectPath = getWorkingDirectory();
			if (!projectPath) {
				return;
			}
			const unusedComponents = orderAllComponents(projectPath);
			const panel = vscode.window.createWebviewPanel(
				'OderedComponents',
				'Odered Components',
				vscode.ViewColumn.Two,
				{},
			);
			panel.webview.html = getScanWebviewContent(unusedComponents, "Ordered Components");
		}
		catch (error) {
			vscode.window.showErrorMessage(`Error ordering components: ${error}`);
		}
	}
	);
	context.subscriptions.push(orderAllComponentsCommand);


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
};
