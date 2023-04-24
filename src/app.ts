import { ComponentModel } from "./models/models";
import { getUnUsedProjectComponents } from "./utils/component/componentUtils";

export function scanForUnusedComponents(projectPath: string): ComponentModel[] {
   return getUnUsedProjectComponents(projectPath, "not-used");
}

export function getScanWebviewContent(_unusedComponents: ComponentModel[]): string {
   return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>NgBox : Unused Components</title>
		<style>
			table {
				border-collapse: collapse;
				width: 100%;
			}

			th, td {
				text-align: left;
				padding: 8px;
			}

			th {
				background-color: #4CAF50;
				color: white;
			}

			tr:nth-child(even) {
				background-color: #f2f2f2;
				color: black
			}
		</style>
	</head>
	<body>
		<h1>Unused Components</h1>
		<table>
			<thead>
				<tr>
					<th>Project</th>
					<th>Component</th>
					<th>Codes Lines</th>

				</tr>
			</thead>
			<tbody>
				${_unusedComponents.map(component => `
						<tr>
						<td>  ${component.projectSrc} </td>
						<td> 
                  ${component.className} <br>
                  ${component.selector} <br>
                  </td>
			
						<td>
						  css  :${component.codeNumberLines.css} </br> 
						  html :${component.codeNumberLines.html} </br> 
						  ts   :${component.codeNumberLines.ts} </br> 
						</td>
						</tr>
`).join('')}
			</tbody>		
        </table>
	</body>
	</html>`;
}

