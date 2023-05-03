/* eslint-disable curly */
import * as vscode from 'vscode';
import { getScanWebviewContent, scanForUnusedComponents } from './app';
import { compareProjectComponents, orderAllComponents } from './utils/component/componentUtils';
import { saveInJson } from './common/pdf';
import { Loader } from './utils/vscod-utils';


export function activate(context: vscode.ExtensionContext) {
	/**
	 * @description This method is called to scan for unused components
	 * @param context 
	 * @returns unused components list in a webview panel 
	 */
	const scanForUnusedComponentsCommand = vscode.commands.registerCommand('ngbox.scan.components', async () => {
		// const statusBarItem = vscode.window.setStatusBarMessage('Scanning for unused components...');
		//show status bar text while scanning
		Loader.show();
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
				{
					enableScripts: true,
					enableCommandUris: true,

				},
			);
			const htmlContent = getScanWebviewContent(unusedComponents, "Unused Components");
			panel.webview.html = htmlContent;
			Loader.hide();

		} catch (error) {
			Loader.hide();
			vscode.window.showErrorMessage(`Error scanning for unused components: ${error}`);
		}
	});
	context.subscriptions.push(scanForUnusedComponentsCommand);


	/**
	 * @description This method is called to get unused modules
	 * @param context
	 */
	const getUnusedModulesCommand = vscode.commands.registerCommand('ngbox.compare.projects', async () => {
		Loader.show();
		const result = await vscode.window.showInputBox({ prompt: 'Please enter two arguments separated by a comma' });
		if (result) {
			try {
				const [project1, project2] = result.split(",");
				const results = await compareProjectComponents(project1.trim(), project2.trim());
				console.log(results);
				const panel = vscode.window.createWebviewPanel(
					'comparedComponents',
					'Compared Components',
					vscode.ViewColumn.Two,
					{
						enableScripts: true,
					},
				);
				panel.webview.html = getScanWebviewContent(results["project1"], "Compared Components 1");

				const panel2 = vscode.window.createWebviewPanel(
					'comparedComponents2',
					'Compared Components 2',
					vscode.ViewColumn.Two,
					{
						enableScripts: true,
					},
				);
				panel2.webview.html = getScanWebviewContent(results["project2"], "Compared Components 2");
				Loader.hide();
			} catch (error) {
				Loader.hide();
				vscode.window.showErrorMessage(`Error comparing projects: ${error}`);
			}
		}
	});
	context.subscriptions.push(getUnusedModulesCommand);


	const orderAllComponentsCommand = vscode.commands.registerCommand('ngbox.order.components', async () => {
		Loader.show();
		try {
			const projectPath = getWorkingDirectory();
			if (!projectPath) {
				return;
			}
			const unusedComponents = await orderAllComponents(projectPath);
			const panel = vscode.window.createWebviewPanel(
				'OderedComponents',
				'Odered Components',
				vscode.ViewColumn.Two,
				{},
			);
			panel.webview.html = getScanWebviewContent(unusedComponents, "Ordered Components");
			Loader.hide();
		}
		catch (error) {
			Loader.hide();
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
