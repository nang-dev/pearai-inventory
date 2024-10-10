"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const getNonce_1 = require("./getNonce");
function activate(context) {
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
exports.activate = activate;
class AIToolsInventoryPanel {
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (AIToolsInventoryPanel.currentPanel) {
            AIToolsInventoryPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel('aiToolsInventory', 'AI Tools Inventory', column || vscode.ViewColumn.One, getWebviewOptions(extensionUri));
        AIToolsInventoryPanel.currentPanel = new AIToolsInventoryPanel(panel, extensionUri);
    }
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'inventory.js'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        const nonce = (0, getNonce_1.getNonce)();
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
    dispose() {
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
function getWebviewOptions(extensionUri) {
    return {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'out'), vscode.Uri.joinPath(extensionUri, 'media')]
    };
}
function deactivate() {
    console.log('pearai-inventory extension is deactivating');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map