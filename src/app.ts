import { ComponentModel } from "./models/models";
import { getUnUsedProjectComponents } from "./utils/component/componentUtils";

export function scanForUnusedComponents(projectPath: string): ComponentModel[] {
	return getUnUsedProjectComponents(projectPath);
}

export function getScanWebviewContent(_unusedComponents: ComponentModel[] | null, title: string): string {

	const noComponentsFound =
		`<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>NgBox : ${title} </title>
	</head>
	<body>
	  <h1>${title}</h1>
	  <p>No ${title} found!</p>
	</body>
	</html>`;

	const componentsFound = `<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>NgBox : ${title} </title>
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
			color: black;
		 }
		 ul {
			list-style-type: none;
			padding: 0;
			margin: 0;
		 }


	  </style>
	</head>
	<body>
	  <h1>${title}</h1>
	  <p>Number of ${title} : ${_unusedComponents?.length}</p>
	
	  <table>
		 <thead>
			<tr>
			  <th>Composant</th>
			  <th>Codes Lines</th>
			  <th>Modules</th>
			</tr>
		 </thead>
		 <tbody>
			${_unusedComponents?.map((component, index) => `
			  <tr>
				 <td>
				 <ul >
		        		<li>No : ${index + 1}</li>
		 				<li>Projet : ${component.projectSrc}</li>
		 				<li>Composant : ${component.className} </li>
						 <li>Selector : ${component.selector} </li>
		 			</ul>
				   
					<br>
					 <br>
				 </td>
				 <td>
					<ul >
		        		<li>HTML : ${component.codeNumberLines.html}</li>
		 				<li>TS : ${component.codeNumberLines.ts}</li>
		 				<li>SCSS : ${component.codeNumberLines.css}</li>
		 			</ul>
				 </td>
				 <td>
		 		   <ul >
					  <li>Modules : ${component.usedIn.modules.length}</li>
					  <li>Components : ${component.usedIn.components.length}</li>
					  <li>HTMLs : ${component.usedIn.htmls.length}</li>
					  <li>Services : ${component.usedIn.services.length}</li>
					  <li>Pipes : ${component.usedIn.pipes.length}</li>
					  <li>Directives : ${component.usedIn.directives.length}</li>
					</ul>

				 </td>
			  </tr>`).join('')
		}
		 </tbody>    
	  </table>
	</body>
	</html>`;
	if (_unusedComponents === null || _unusedComponents.length === 0) {
		return noComponentsFound;
	} else {
		return componentsFound;
	}
}

export const saveRappor = (unusedComponents: ComponentModel[] | null, title: string) => {
	const date = new Date();
	const pdfName = `${title}-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.pdf`;
	const pdfPath = `${process.cwd()}/${pdfName}`;
	const pdfContent = getScanWebviewContent(unusedComponents, title);
	const pdf = require('html-pdf');
	const options = { format: 'Letter' };
	pdf.create(pdfContent, options).toFile(pdfPath, function (err: any, res: any) {
		if (err) return console.log(err);
		console.log(res);
	}
	);
};

