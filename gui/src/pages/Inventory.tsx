import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    VSCodeButton,
    VSCodeCheckbox,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeTextField,
    VSCodeDivider,
    VSCodeBadge
} from '@vscode/webview-ui-toolkit/react';
import styled from 'styled-components';

// Import toolsData
import toolsData from '/util/tools-data.json';

type BooleanSetting = {
    name: string;
    type: 'boolean';
    default: boolean;
};

type NumberSetting = {
    name: string;
    type: 'number';
    default: number;
    min: number;
    max: number;
};

type SelectSetting = {
    name: string;
    type: 'select';
    options: string[];
    default: string;
};

type Setting = BooleanSetting | NumberSetting | SelectSetting;

type Tool = {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    version: string;
    author: string;
    website: string;
    settings: Setting[];
};

interface ToolItemProps {
    tool: Tool;
    onClick: () => void;
    listType: string;
}

interface ToolListProps {
    tools: Tool[];
    listType: string;
    onToolClick: (tool: Tool) => void;
    onToolMove: (id: string, targetList: string) => void;
}

const ToolItem: React.FC<ToolItemProps> = ({ tool, onClick, listType }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TOOL',
        item: { id: tool.id, listType },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <StyledToolItem ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <ToolName>{tool.name}</ToolName>
            <VSCodeBadge>{tool.version}</VSCodeBadge>
            <VSCodeButton onClick={onClick}>Details</VSCodeButton>
        </StyledToolItem>
    );
};

const ToolList: React.FC<ToolListProps> = ({ tools, listType, onToolClick, onToolMove }) => {
    const [, drop] = useDrop(() => ({
        accept: 'TOOL',
        drop: (item: { id: string; listType: string }) => {
            if (item.listType !== listType) {
                onToolMove(item.id, listType);
            }
        },
    }));

    return (
        <StyledToolList ref={drop}>
            <h2>{listType === 'active' ? 'Active Tools' : 'Available Tools'}</h2>
            {tools.map((tool) => (
                <ToolItem
                    key={tool.id}
                    tool={tool}
                    onClick={() => onToolClick(tool)}
                    listType={listType}
                />
            ))}
        </StyledToolList>
    );
};

const Inventory: React.FC = () => {
    const [activeTools, setActiveTools] = React.useState<Tool[]>(() =>
        toolsData.filter((tool): tool is Tool => tool.isActive)
    );
    const [availableTools, setAvailableTools] = React.useState<Tool[]>(() =>
        toolsData.filter((tool): tool is Tool => !tool.isActive)
    );
    const [selectedTool, setSelectedTool] = React.useState<Tool | null>(null);

    const handleToolClick = React.useCallback((tool: Tool) => {
        setSelectedTool(tool);
    }, []);

    const handleToolMove = React.useCallback((id: string, targetList: string) => {
        const sourceList = targetList === 'active' ? availableTools : activeTools;
        const targetListState = targetList === 'active' ? activeTools : availableTools;

        const toolToMove = sourceList.find(tool => tool.id === id);
        if (toolToMove) {
            const updatedTool = { ...toolToMove, isActive: targetList === 'active' };
            const newSourceList = sourceList.filter(tool => tool.id !== id);
            const newTargetList = [...targetListState, updatedTool];

            if (targetList === 'active') {
                setActiveTools(newTargetList);
                setAvailableTools(newSourceList);
            } else {
                setAvailableTools(newTargetList);
                setActiveTools(newSourceList);
            }
        }
    }, [activeTools, availableTools]);

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
                        type="number"
                        min={setting.min.toString()}
                        max={setting.max.toString()}
                    >
                        {setting.name}
                    </VSCodeTextField>
                );
            case 'select':
                return (
                    <VSCodeDropdown>
                        <label slot="label">{setting.name}</label>
                        {setting.options.map(option => (
                            <VSCodeOption key={option} value={option}>
                                {option}
                            </VSCodeOption>
                        ))}
                    </VSCodeDropdown>
                );
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <InventoryContainer>
                <ToolList
                    tools={activeTools}
                    listType="active"
                    onToolClick={handleToolClick}
                    onToolMove={handleToolMove}
                />
                <VSCodeDivider />
                <ToolList
                    tools={availableTools}
                    listType="available"
                    onToolClick={handleToolClick}
                    onToolMove={handleToolMove}
                />
                <VSCodeDivider />
                <ToolDetails>
                    {selectedTool ? (
                        <>
                            <h2>{selectedTool.name}</h2>
                            <p>{selectedTool.description}</p>
                            <p>Version: {selectedTool.version}</p>
                            <p>Author: {selectedTool.author}</p>
                            <p>Website: <a href={selectedTool.website} target="_blank" rel="noopener noreferrer">{selectedTool.website}</a></p>
                            <h3>Settings</h3>
                            {selectedTool.settings.map(setting => (
                                <SettingItem key={setting.name}>
                                    {renderSetting(setting)}
                                </SettingItem>
                            ))}
                        </>
                    ) : (
                        <p>Select a tool to view details</p>
                    )}
                </ToolDetails>
            </InventoryContainer>
        </DndProvider>
    );
};

const InventoryContainer = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;
`;

const StyledToolList = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

const StyledToolItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid var(--vscode-editor-foreground);
    border-radius: 4px;
    cursor: move;
`;

const ToolName = styled.span`
    flex: 1;
    margin-right: 10px;
`;

const ToolDetails = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

const SettingItem = styled.div`
    margin-bottom: 10px;
`;

ReactDOM.render(<Inventory />, document.getElementById('root'));

export default Inventory;
