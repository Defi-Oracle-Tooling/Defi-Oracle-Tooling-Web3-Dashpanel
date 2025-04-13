import React, { useState, useEffect } from 'react';
import styles from '../../styles/strategy.module.css';
import useStrategyStore, { StrategyState } from '../../store/strategyStore';

interface StrategyPreviewProps {
    isOpen?: boolean;
    onClose?: () => void;
}

/**
 * Enhanced component that displays the strategy as a formatted JSON structure
 * with visualization, validation, and export options
 */
const StrategyPreview: React.FC<StrategyPreviewProps> = ({
    isOpen = false,
    onClose
}) => {
    // States for different UI interactions
    const [copySuccess, setCopySuccess] = useState(false);
    const [activeView, setActiveView] = useState<'json' | 'visual' | 'validation'>('json');
    const [fileFormat, setFileFormat] = useState<'json' | 'yaml'>('json');
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<{ valid: boolean, errors: string[] }>({ valid: true, errors: [] });
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        elements: true,
        connections: true
    });

    // Get strategy data from store
    const { strategyName, description, elements, connections, validateStrategy } = useStrategyStore();

    // Create a clean version of the strategy without internal state and functions
    const strategyData = {
        strategyName,
        description,
        elements: elements.map(({ id, type, name, description, parameters, position }) => ({
            id,
            type,
            name,
            description,
            parameters,
            position
        })),
        connections: connections.map(({ id, sourceId, targetId, label }) => ({
            id,
            sourceId,
            targetId,
            label
        }))
    };

    // Format the JSON with indentation for readability
    const formattedJson = JSON.stringify(strategyData, null, 2);

    // Initialize validation when preview opens
    useEffect(() => {
        if (isOpen) {
            // Perform initial validation
            handleValidate();
        }
    }, [isOpen]);

    // Validates the strategy using the store's validator
    const handleValidate = () => {
        setIsValidating(true);
        
        // Simulate async validation
        setTimeout(() => {
            const result = validateStrategy();
            setValidationResult(result);
            setIsValidating(false);
            
            // If there are errors, switch to the validation view
            if (!result.valid) {
                setActiveView('validation');
            }
        }, 500);
    };

    // Handle copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    // Handle exporting the strategy as a file
    const handleExport = () => {
        // Create file content based on selected format
        let fileContent = '';
        let mimeType = '';
        let fileExtension = '';
        
        if (fileFormat === 'json') {
            fileContent = formattedJson;
            mimeType = 'application/json';
            fileExtension = 'json';
        } else {
            // Simple YAML conversion for demo purposes
            // In a real app, you'd use a proper YAML library
            const yamlContent = formattedJson
                .replace(/{/g, '')
                .replace(/}/g, '')
                .replace(/\[/g, '')
                .replace(/\]/g, '')
                .replace(/"/g, '')
                .replace(/,/g, '')
                .replace(/:/g, ': ')
                .split('\n')
                .map(line => {
                    const trimmed = line.trim();
                    if (trimmed && !trimmed.includes(':')) {
                        return `- ${trimmed}`;
                    }
                    return line;
                })
                .join('\n');
            
            fileContent = yamlContent;
            mimeType = 'application/yaml';
            fileExtension = 'yml';
        }
        
        // Create a download link and trigger the download
        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${strategyName || 'strategy'}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Toggle expanded state for a section
    const toggleSection = (section: string) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    if (!isOpen) return null;

    // Get element by ID helper function
    const getElementById = (id: string) => elements.find(el => el.id === id);

    return (
        <div className={styles.previewOverlay}>
            <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                    <h3>Strategy Preview: {strategyName || 'Untitled Strategy'}</h3>
                    <div className={styles.previewControls}>
                        {/* View switcher */}
                        <div className={styles.viewTabs}>
                            <button 
                                className={`${styles.viewTab} ${activeView === 'json' ? styles.activeViewTab : ''}`}
                                onClick={() => setActiveView('json')}
                            >
                                JSON
                            </button>
                            <button 
                                className={`${styles.viewTab} ${activeView === 'visual' ? styles.activeViewTab : ''}`}
                                onClick={() => setActiveView('visual')}
                            >
                                Visual Summary
                            </button>
                            <button 
                                className={`${styles.viewTab} ${activeView === 'validation' ? styles.activeViewTab : ''}`}
                                onClick={() => setActiveView('validation')}
                            >
                                Validation {!validationResult.valid && '⚠️'}
                            </button>
                        </div>
                        
                        <div className={styles.actionButtons}>
                            {activeView === 'json' && (
                                <>
                                    <select 
                                        value={fileFormat}
                                        onChange={(e) => setFileFormat(e.target.value as 'json' | 'yaml')}
                                        className={styles.formatSelect}
                                    >
                                        <option value="json">JSON</option>
                                        <option value="yaml">YAML</option>
                                    </select>
                                    <button
                                        className={styles.exportButton}
                                        onClick={handleExport}
                                    >
                                        Export
                                    </button>
                                    <button
                                        className={styles.copyButton}
                                        onClick={handleCopy}
                                    >
                                        {copySuccess ? 'Copied!' : 'Copy'}
                                    </button>
                                </>
                            )}
                            
                            {activeView === 'validation' && (
                                <button
                                    className={`${styles.validateButton} ${isValidating ? styles.validating : ''}`}
                                    onClick={handleValidate}
                                    disabled={isValidating}
                                >
                                    {isValidating ? 'Validating...' : 'Revalidate'}
                                </button>
                            )}
                            
                            {onClose && (
                                <button
                                    className={styles.closeButton}
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className={styles.previewContent}>
                    {/* JSON View */}
                    {activeView === 'json' && (
                        <div className={styles.jsonView}>
                            <div className={styles.jsonStructure}>
                                <div 
                                    className={styles.jsonSection}
                                    onClick={() => toggleSection('metadata')}
                                >
                                    <span className={styles.sectionToggle}>
                                        {expandedSections.metadata ? '▼' : '▶'}
                                    </span>
                                    <span className={styles.sectionKey}>Metadata</span>
                                </div>
                                
                                {expandedSections.metadata && (
                                    <div className={styles.sectionContent}>
                                        <div className={styles.jsonProperty}>
                                            <span className={styles.jsonKey}>strategyName:</span>
                                            <span className={styles.jsonValue}>"{strategyName || 'Untitled Strategy'}"</span>
                                        </div>
                                        {description && (
                                            <div className={styles.jsonProperty}>
                                                <span className={styles.jsonKey}>description:</span>
                                                <span className={styles.jsonValue}>"{description}"</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div 
                                    className={styles.jsonSection}
                                    onClick={() => toggleSection('elements')}
                                >
                                    <span className={styles.sectionToggle}>
                                        {expandedSections.elements ? '▼' : '▶'}
                                    </span>
                                    <span className={styles.sectionKey}>elements</span>
                                    <span className={styles.sectionCount}>[{elements.length}]</span>
                                </div>
                                
                                {expandedSections.elements && elements.map(element => (
                                    <div key={element.id} className={styles.jsonElement}>
                                        <div className={styles.jsonProperty}>
                                            <span className={styles.jsonKey}>type:</span>
                                            <span className={`${styles.jsonValue} ${styles.jsonType}`}>{element.type}</span>
                                        </div>
                                        <div className={styles.jsonProperty}>
                                            <span className={styles.jsonKey}>name:</span>
                                            <span className={styles.jsonValue}>"{element.name}"</span>
                                        </div>
                                    </div>
                                ))}
                                
                                <div 
                                    className={styles.jsonSection}
                                    onClick={() => toggleSection('connections')}
                                >
                                    <span className={styles.sectionToggle}>
                                        {expandedSections.connections ? '▼' : '▶'}
                                    </span>
                                    <span className={styles.sectionKey}>connections</span>
                                    <span className={styles.sectionCount}>[{connections.length}]</span>
                                </div>
                                
                                {expandedSections.connections && connections.map(connection => {
                                    const source = getElementById(connection.sourceId);
                                    const target = getElementById(connection.targetId);
                                    
                                    return (
                                        <div key={connection.id} className={styles.jsonConnection}>
                                            <div className={styles.jsonProperty}>
                                                <span className={styles.jsonKey}>from:</span>
                                                <span className={styles.jsonValue}>"{source?.name || connection.sourceId}"</span>
                                            </div>
                                            <div className={styles.jsonProperty}>
                                                <span className={styles.jsonKey}>to:</span>
                                                <span className={styles.jsonValue}>"{target?.name || connection.targetId}"</span>
                                            </div>
                                            {connection.label && (
                                                <div className={styles.jsonProperty}>
                                                    <span className={styles.jsonKey}>label:</span>
                                                    <span className={styles.jsonValue}>"{connection.label}"</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <pre className={styles.jsonRaw}>
                                {formattedJson}
                            </pre>
                        </div>
                    )}
                    
                    {/* Visual Summary View */}
                    {activeView === 'visual' && (
                        <div className={styles.visualView}>
                            <div className={styles.strategyStats}>
                                <div className={styles.statCard}>
                                    <div className={styles.statValue}>{elements.length}</div>
                                    <div className={styles.statLabel}>Elements</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statValue}>{connections.length}</div>
                                    <div className={styles.statLabel}>Connections</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statValue}>{elements.filter(e => e.type === 'trigger').length}</div>
                                    <div className={styles.statLabel}>Triggers</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statValue}>{elements.filter(e => e.type === 'action').length}</div>
                                    <div className={styles.statLabel}>Actions</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statValue}>{elements.filter(e => e.type === 'condition').length}</div>
                                    <div className={styles.statLabel}>Conditions</div>
                                </div>
                            </div>
                            
                            {/* Flow diagram (simplified) */}
                            <div className={styles.flowDiagram}>
                                <h4>Strategy Flow</h4>
                                {elements.length === 0 ? (
                                    <p className={styles.emptyState}>No elements in this strategy yet.</p>
                                ) : (
                                    <ul className={styles.flowList}>
                                        {elements.filter(e => e.type === 'trigger').map(trigger => (
                                            <li key={trigger.id} className={styles.flowItem}>
                                                <div className={`${styles.flowNode} ${styles.triggerNode}`}>
                                                    🔔 {trigger.name}
                                                </div>
                                                
                                                {/* Find connections from this trigger */}
                                                {connections
                                                    .filter(c => c.sourceId === trigger.id)
                                                    .map(conn => {
                                                        const targetElement = getElementById(conn.targetId);
                                                        if (!targetElement) return null;
                                                        
                                                        return (
                                                            <div key={conn.id} className={styles.flowConnection}>
                                                                <div className={styles.flowArrow}>↓ {conn.label || ''}</div>
                                                                <div className={`${styles.flowNode} ${
                                                                    targetElement.type === 'condition' 
                                                                        ? styles.conditionNode 
                                                                        : styles.actionNode
                                                                }`}>
                                                                    {targetElement.type === 'condition' ? '❓' : '▶️'} 
                                                                    {targetElement.name}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Validation View */}
                    {activeView === 'validation' && (
                        <div className={styles.validationView}>
                            <div className={`${styles.validationStatus} ${
                                validationResult.valid ? styles.validSuccess : styles.validError
                            }`}>
                                {validationResult.valid ? (
                                    <>
                                        <div className={styles.validIcon}>✓</div>
                                        <div>
                                            <h4>Strategy is valid</h4>
                                            <p>The strategy passes all validation checks and is ready for execution.</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.validIcon}>⚠️</div>
                                        <div>
                                            <h4>Validation Issues Found</h4>
                                            <p>Please address the following issues:</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {!validationResult.valid && (
                                <ul className={styles.errorList}>
                                    {validationResult.errors.map((error, index) => (
                                        <li key={index} className={styles.errorItem}>{error}</li>
                                    ))}
                                </ul>
                            )}
                            
                            {validationResult.valid && (
                                <div className={styles.validationChecks}>
                                    <div className={styles.checkItem}>
                                        <span className={styles.checkPass}>✓</span>
                                        <span>Required elements present</span>
                                    </div>
                                    <div className={styles.checkItem}>
                                        <span className={styles.checkPass}>✓</span>
                                        <span>All connections are valid</span>
                                    </div>
                                    <div className={styles.checkItem}>
                                        <span className={styles.checkPass}>✓</span>
                                        <span>No circular dependencies</span>
                                    </div>
                                    <div className={styles.checkItem}>
                                        <span className={styles.checkPass}>✓</span>
                                        <span>All required parameters are set</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StrategyPreview;

export default StrategyPreview;
