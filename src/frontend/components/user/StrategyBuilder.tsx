import React, { useState, useRef } from 'react';
import styles from '../../styles/strategy.module.css';
import useStrategyStore, { StrategyElement, ElementType, Connection } from '../../store/strategyStore';
import DraggableElement from '../strategy/DraggableElement';
import ConnectionLine from '../strategy/ConnectionLine';
import PropertiesPanel from '../strategy/PropertiesPanel';
import StrategyPreview from '../strategy/StrategyPreview';

// Helper function to generate unique IDs
const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Sample preset elements for the toolbar
const presetElements: Record<ElementType, Omit<StrategyElement, 'id' | 'position'>> = {
    trigger: {
        type: 'trigger',
        name: 'Price Change',
        description: 'Triggers when asset price changes by specified percentage',
        parameters: {
            asset: 'ETH',
            percentage: 5,
            direction: 'up'
        }
    },
    action: {
        type: 'action',
        name: 'Execute Trade',
        description: 'Execute a trade on a specified DEX',
        parameters: {
            dex: 'Uniswap',
            tokenIn: 'ETH',
            tokenOut: 'USDC',
            amount: 0.1
        }
    },
    condition: {
        type: 'condition',
        name: 'Balance Check',
        description: 'Check if account balance meets criteria',
        parameters: {
            minBalance: 1.0,
            asset: 'ETH'
        }
    }
};

const StrategyBuilder: React.FC = () => {
    // Local state for connection creation
    const [connectionStart, setConnectionStart] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Reference to SVG element for connections
    const svgRef = useRef<SVGSVGElement>(null);

    // Access strategy store
    const {
        strategyName,
        elements,
        connections,
        selectedElementId,
        setStrategyName,
        addElement,
        updateElement,
        removeElement,
        addConnection,
        removeConnection,
        setSelectedElement,
        moveElement,
        clearStrategy
    } = useStrategyStore();

    // Handle adding a new element to the canvas
    const handleAddElement = (type: ElementType) => {
        const newElement: StrategyElement = {
            id: generateId(),
            position: { x: 50, y: 50 + (elements.length * 20) }, // Stack elements with offset
            ...presetElements[type]
        };

        addElement(newElement);
        setSelectedElement(newElement.id);
    };

    // Handle deletion of the selected element
    const handleDeleteSelected = () => {
        if (selectedElementId) {
            removeElement(selectedElementId);
        }
    };

    // Handle connection creation
    const handleStartConnection = (sourceId: string) => {
        setConnectionStart(sourceId);
    };

    // Handle connection completion
    const handleEndConnection = (targetId: string) => {
        if (connectionStart && connectionStart !== targetId) {
            // Create a new connection
            const newConnection: Connection = {
                id: generateId(),
                sourceId: connectionStart,
                targetId
            };

            // Add the connection to the store
            addConnection(newConnection);

            // Reset connection start
            setConnectionStart(null);
        }
    };

    // Handle removing a connection
    const handleRemoveConnection = (id: string) => {
        removeConnection(id);
    };

    // Handle saving the strategy (would connect to backend in real implementation)
    const handleSaveStrategy = () => {
        const strategy = useStrategyStore.getState();
        alert(`Strategy "${strategy.strategyName}" saved (${strategy.elements.length} elements)`);
        // In a real implementation, this would call an API to save the strategy
        console.log('Strategy data:', JSON.stringify(strategy, null, 2));
    };

    // Handle executing the strategy (would connect to backend in real implementation)
    const handleRunStrategy = () => {
        const validation = useStrategyStore.getState().validateStrategy();

        if (validation.valid) {
            alert(`Strategy "${strategyName}" is being executed...`);
            // In a real implementation, this would call an API to execute the strategy
        } else {
            alert(`Cannot run strategy: ${validation.errors.join(', ')}`);
        }
    };

    // Toggle JSON preview
    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    return (
        <section className={styles.strategySection}>
            <h2>Strategy Builder</h2>
            <p>Create trading strategies by adding and connecting elements on the canvas.</p>

            {/* Strategy controls */}
            <div className={styles.strategyControls}>
                <input
                    type="text"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    className={styles.strategyName}
                    placeholder="Strategy Name"
                />
                <div className={styles.controlButtons}>
                    <button className={`${styles.saveButton}`} onClick={handleSaveStrategy}>
                        Save Strategy
                    </button>
                    <button className={`${styles.runButton}`} onClick={handleRunStrategy}>
                        Run Strategy
                    </button>
                    <button className={`${styles.clearButton}`} onClick={clearStrategy}>
                        Clear Canvas
                    </button>
                    <button
                        onClick={togglePreview}
                        style={{ backgroundColor: '#6c757d', color: 'white' }}
                        className={styles.elementButton}
                    >
                        View JSON
                    </button>
                </div>
            </div>

            {/* Element toolbar */}
            <div className={styles.elementsToolbar}>
                <button
                    className={`${styles.elementButton} ${styles.triggerButton}`}
                    onClick={() => handleAddElement('trigger')}
                >
                    Add Trigger
                </button>
                <button
                    className={`${styles.elementButton} ${styles.actionButton}`}
                    onClick={() => handleAddElement('action')}
                >
                    Add Action
                </button>
                <button
                    className={`${styles.elementButton} ${styles.conditionButton}`}
                    onClick={() => handleAddElement('condition')}
                >
                    Add Condition
                </button>
                {selectedElementId && (
                    <button
                        className={`${styles.elementButton}`}
                        onClick={handleDeleteSelected}
                        style={{ backgroundColor: '#dc3545', color: 'white' }}
                    >
                        Delete Selected
                    </button>
                )}
                {connectionStart && (
                    <div style={{ marginLeft: 'auto', color: '#4c84ff', fontWeight: 'bold' }}>
                        Creating connection... Click on target element.
                    </div>
                )}
            </div>

            {/* Strategy canvas */}
            <div className={styles.builderCanvas} onClick={() => setSelectedElement(null)}>
                {elements.map((element) => (
                    <DraggableElement
                        key={element.id}
                        element={element}
                        isSelected={element.id === selectedElementId}
                        onSelect={setSelectedElement}
                        onMove={moveElement}
                    />
                ))}
                {/* Connection lines would be drawn here in a real implementation */}
            </div>

            {/* Properties panel (would be expanded in a real implementation) */}
            {selectedElementId && (
                <PropertiesPanel
                    element={elements.find(el => el.id === selectedElementId)!}
                    onUpdateElement={updateElement}
                />
            )}

            {/* JSON Preview Modal */}
            <StrategyPreview
                isOpen={showPreview}
                onClose={togglePreview}
            />
        </section>
    );
};

export default StrategyBuilder;
