import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    VSCodeButton,
    VSCodeCheckbox,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeTextField,
    VSCodeDivider
} from '@vscode/webview-ui-toolkit/react';

// Import the JSON data using require
const toolsData = require('./tools-data.json');

interface Setting {
    name: string;
    type: string;
    default: any;
    options?: string[];
    min?: number;
    max?: number;
}

interface Tool {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    version: string;
    author: string;
    website: string;
    settings: Setting[];
}

const Inventory: React.FC = () => {
    const [tools, setTools] = React.useState<Tool[]>(toolsData);
    const [selectedTool, setSelectedTool] = React.useState<Tool | null>(null);

    console.log('Inventory component rendered');

    const handleToolClick = (tool: Tool) => {
        setSelectedTool(tool);
    };

    const handleToggleActive = (toolId: string) => {
        setTools(tools.map(tool =>
            tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
        ));
    };

    const renderSetting = (setting: Setting) => {
        switch (setting.type) {
            case 'boolean':
                return (
                    <VSCodeCheckbox checked={setting.default}>
                        {setting.name}
                    </VSCodeCheckbox>
                );
            case 'number':
                return (
                    <VSCodeTextField
                        value={setting.default.toString()}
                    >
                        {setting.name}
                    </VSCodeTextField>
                );
            case 'select':
                return (
                    <VSCodeDropdown>
                        <label slot="label">{setting.name}</label>
                        {setting.options?.map(option => (
                            <VSCodeOption key={option} value={option}>
                                {option}
                            </VSCodeOption>
                        ))}
                    </VSCodeDropdown>
                );
            default:
                return null;
        }
    };

    return (
        <div className="inventory-container">
            {/* ... rest of the component remains the same ... */}
        </div>
    );
};

ReactDOM.render(<Inventory />, document.getElementById('root'));
