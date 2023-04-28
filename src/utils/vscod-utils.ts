import * as vscode from 'vscode';

export class Loader {
   private static loader: vscode.StatusBarItem | null = null;

   static show() {
      if (this.loader === null) {
         this.loader = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
         this.loader.text = '$(sync~spin) Loading...';
      }

      this.loader.show();
   }

   static hide() {
      if (this.loader) {
         this.loader.hide();
         this.loader.dispose();
         this.loader = null;
      }
   }
}