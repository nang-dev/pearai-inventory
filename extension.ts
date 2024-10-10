import * as vscode from 'vscode';
import { getNonce } from './util/getNonce';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating pearai-inventory extension...');

    let helloWorldDisposable = vscode.commands.registerCommand('pearai-inventory.helloWorld', () => {
        console.log('Hello World command executed');
        vscode.window.showInformationMessage('Hello World from PearAI Inventory!');
    });

    let showInventoryDisposable = vscode.commands.registerCommand('pearai-inventory.showInventory', () => {
        console.log('Show Inventory command executed');
        AIToolsInventoryPanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(helloWorldDisposable, showInventoryDisposable);

    console.log('pearai-inventory extension is now active!');
}

class AIToolsInventoryPanel {
    public static currentPanel: AIToolsInventoryPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (AIToolsInventoryPanel.currentPanel) {
            AIToolsInventoryPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'aiToolsInventory',
            'AI Tools Inventory',
            column || vscode.ViewColumn.One,
            getWebviewOptions(extensionUri),
        );

        AIToolsInventoryPanel.currentPanel = new AIToolsInventoryPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'inventory.js'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>AI Tools Inventory</title>
			</head>
			<body>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

    public dispose() {
        AIToolsInventoryPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
    return {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'out'), vscode.Uri.joinPath(extensionUri, 'media')]
    };
}

export function deactivate() {
    console.log('pearai-inventory extension is deactivating');
}
