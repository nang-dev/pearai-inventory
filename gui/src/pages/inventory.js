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
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const react_1 = require("@vscode/webview-ui-toolkit/react");
const toolsData = require('./tools-data.json');
const Inventory = () => {
    const [tools, setTools] = React.useState(toolsData);
    const [selectedTool, setSelectedTool] = React.useState(null);
    console.log('Inventory component rendered');
    const handleToolClick = (tool) => {
        setSelectedTool(tool);
    };
    const handleToggleActive = (toolId) => {
        setTools(tools.map(tool => tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool));
    };
    const renderSetting = (setting) => {
        switch (setting.type) {
            case 'boolean':
                return (React.createElement(react_1.VSCodeCheckbox, { checked: setting.default }, setting.name));
            case 'number':
                return (React.createElement(react_1.VSCodeTextField, { value: setting.default.toString(), type: "text", inputMode: "numeric", pattern: "[0-9]*" }, setting.name));
            case 'select':
                return (React.createElement(react_1.VSCodeDropdown, null,
                    React.createElement("label", { slot: "label" }, setting.name),
                    setting.options?.map(option => (React.createElement(react_1.VSCodeOption, { key: option, value: option }, option)))));
            default:
                return null;
        }
    };
    return (React.createElement("div", { className: "inventory-container" },
        React.createElement("div", { className: "tool-list" },
            React.createElement("h2", null, "Available Tools"),
            tools.map(tool => (React.createElement("div", { key: tool.id, className: "tool-item" },
                React.createElement(react_1.VSCodeCheckbox, { checked: tool.isActive, onChange: () => handleToggleActive(tool.id) }, tool.name),
                React.createElement(react_1.VSCodeButton, { onClick: () => handleToolClick(tool) }, "Details"))))),
        React.createElement(react_1.VSCodeDivider, null),
        React.createElement("div", { className: "tool-details" }, selectedTool ? (React.createElement(React.Fragment, null,
            React.createElement("h2", null, selectedTool.name),
            React.createElement("p", null, selectedTool.description),
            React.createElement("p", null,
                "Version: ",
                selectedTool.version),
            React.createElement("p", null,
                "Author: ",
                selectedTool.author),
            React.createElement("p", null,
                "Website: ",
                React.createElement("a", { href: selectedTool.website, target: "_blank", rel: "noopener noreferrer" }, selectedTool.website)),
            React.createElement("h3", null, "Settings"),
            selectedTool.settings.map(setting => (React.createElement("div", { key: setting.name, className: "setting-item" }, renderSetting(setting)))))) : (React.createElement("p", null, "Select a tool to view details")))));
};
ReactDOM.render(React.createElement(Inventory, null), document.getElementById('root'));
//# sourceMappingURL=Inventory.js.map