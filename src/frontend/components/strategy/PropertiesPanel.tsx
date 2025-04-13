import React, { useState, useEffect } from 'react';
import styles from '../../styles/strategy.module.css';
import { StrategyElement, ElementType } from '../../store/strategyStore';

interface PropertiesPanelProps {
    element: StrategyElement;
    onUpdateElement: (id: string, updates: Partial<StrategyElement>) => void;
}

/**
 * Enhanced panel for editing the properties of a selected strategy element
 * With advanced form controls, tabs, and validation
 */
const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onUpdateElement }) => {
    // Local state for form fields
    const [name, setName] = useState(element.name);
    const [description, setDescription] = useState(element.description);
    const [parameters, setParameters] = useState<Record<string, any>>(element.parameters || {});
    const [activeTab, setActiveTab] = useState<'general' | 'parameters' | 'advanced'>('general');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [parametersExpanded, setParametersExpanded] = useState<Record<string, boolean>>({});

    // Initialize expanded state for all parameters
    useEffect(() => {
        if (element.parameters) {
            const expanded: Record<string, boolean> = {};
            Object.keys(element.parameters).forEach(key => {
                expanded[key] = true; // Default to expanded
            });
            setParametersExpanded(expanded);
        }
    }, [element.id]);

    // Update local state when the element changes
    useEffect(() => {
        setName(element.name);
        setDescription(element.description);
        setParameters(element.parameters || {});
        setFormErrors({});
    }, [element.id, element.name, element.description, element.parameters]);

    // Handle form submission with validation
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const errors: Record<string, string> = {};

        if (!name.trim()) {
            errors.name = 'Name is required';
        }

        // Validate parameters based on their types
        if (parameters) {
            Object.entries(parameters).forEach(([key, value]) => {
                if (typeof value === 'number' && isNaN(value)) {
                    errors[`param_${key}`] = `${key} must be a valid number`;
                }
                if (typeof value === 'string' && key.includes('required') && !value.trim()) {
                    errors[`param_${key}`] = `${key} is required`;
                }
            });
        }

        // If there are errors, show them and stop submission
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Clear any previous errors
        setFormErrors({});

        // Submit the form
        onUpdateElement(element.id, {
            name,
            description,
            parameters
        });
    };

    // Handle parameter change
    const handleParameterChange = (key: string, value: any) => {
        setParameters({
            ...parameters,
            [key]: value
        });

        // Clear error for this field if it exists
        if (formErrors[`param_${key}`]) {
            const newErrors = { ...formErrors };
            delete newErrors[`param_${key}`];
            setFormErrors(newErrors);
        }
    };

    // Toggle parameter expanded state
    const toggleParameterExpanded = (key: string) => {
        setParametersExpanded({
            ...parametersExpanded,
            [key]: !parametersExpanded[key]
        });
    };

    // Get appropriate title based on element type
    const getTypeLabel = (type: ElementType): string => {
        switch (type) {
            case 'trigger': return 'Trigger';
            case 'action': return 'Action';
            case 'condition': return 'Condition';
            default: return 'Element';
        }
    };

    // Get appropriate color based on element type
    const getTypeColor = (type: ElementType): string => {
        switch (type) {
            case 'trigger': return '#ff6b6b';
            case 'action': return '#4ecdc4';
            case 'condition': return '#ffd166';
            default: return '#6c757d';
        }
    };

    // Render parameter fields based on their types
    const renderParameterFields = () => {
        if (!parameters) return null;

        return Object.entries(parameters).map(([key, value]) => {
            // Determine the input type based on the value type
            let inputType = 'text';
            if (typeof value === 'number') inputType = 'number';
            else if (typeof value === 'boolean') inputType = 'checkbox';

            // For type safety with checkboxes
            const isCheckbox = inputType === 'checkbox';

            // For select dropdowns (if the parameter name suggests it could be a dropdown)
            const isDropdown = key.toLowerCase().includes('type') ||
                key.toLowerCase().includes('option') ||
                key.toLowerCase().includes('direction');

            // Simple options for demonstration - in a real app, these would be dynamic
            const dropdownOptions = key.toLowerCase().includes('direction')
                ? ['up', 'down', 'both']
                : ['option1', 'option2', 'option3'];

            return (
                <div key={key} className={styles.formGroup}>
                    <div
                        className={styles.parameterHeader}
                        onClick={() => toggleParameterExpanded(key)}
                        style={{ borderLeft: `3px solid ${getTypeColor(element.type)}` }}
                    >
                        <span className={styles.parameterName}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                        <span className={styles.parameterToggle}>
                            {parametersExpanded[key] ? '▼' : '▶'}
                        </span>
                    </div>

                    {parametersExpanded[key] && (
                        <div className={styles.parameterContent}>
                            {isDropdown ? (
                                <select
                                    value={value as string}
                                    onChange={(e) => handleParameterChange(key, e.target.value)}
                                    className={styles.formSelect}
                                >
                                    {dropdownOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : isCheckbox ? (
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={!!value}
                                        onChange={(e) => handleParameterChange(key, e.target.checked)}
                                        className={styles.formCheckbox}
                                    />
                                    <span className={styles.checkboxText}>Enabled</span>
                                </label>
                            ) : (
                                <input
                                    type={inputType}
                                    value={value}
                                    onChange={(e) => handleParameterChange(
                                        key,
                                        inputType === 'number' ? parseFloat(e.target.value) : e.target.value
                                    )}
                                    className={`${styles.formInput} ${formErrors[`param_${key}`] ? styles.inputError : ''}`}
                                />
                            )}

                            {formErrors[`param_${key}`] && (
                                <div className={styles.errorText}>{formErrors[`param_${key}`]}</div>
                            )}

                            <div className={styles.parameterHint}>
                                {getParameterHint(key)}
                            </div>
                        </div>
                    )}
                </div>
            );
        });
    };

    // Helper function to generate hints based on parameter key
    const getParameterHint = (key: string): string => {
        const hints: Record<string, string> = {
            asset: 'The cryptocurrency ticker symbol',
            percentage: 'Threshold percentage for triggering',
            direction: 'Price movement direction to monitor',
            amount: 'Amount of cryptocurrency to trade',
            minBalance: 'Minimum account balance required',
            dex: 'Decentralized exchange to use',
            tokenIn: 'Asset to sell',
            tokenOut: 'Asset to buy'
        };

        return hints[key] || `Configure ${key} parameter`;
    };

    return (
        <div className={styles.propertiesPanel}>
            <h3 className={styles.propertiesTitle} style={{ borderBottom: `2px solid ${getTypeColor(element.type)}` }}>
                {getTypeLabel(element.type)} Properties
            </h3>

            {/* Tab navigation */}
            <div className={styles.tabNavigation}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'general' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'parameters' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('parameters')}
                    disabled={!parameters || Object.keys(parameters).length === 0}
                >
                    Parameters
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'advanced' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('advanced')}
                >
                    Advanced
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* General tab */}
                {activeTab === 'general' && (
                    <div className={styles.tabContent}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (formErrors.name) {
                                        const newErrors = { ...formErrors };
                                        delete newErrors.name;
                                        setFormErrors(newErrors);
                                    }
                                }}
                                className={`${styles.formInput} ${formErrors.name ? styles.inputError : ''}`}
                                required
                            />
                            {formErrors.name && (
                                <div className={styles.errorText}>{formErrors.name}</div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={styles.formTextarea}
                            />
                        </div>

                        <div className={styles.formInfo}>
                            <div className={styles.infoItem}>
                                <span>Type:</span> {element.type}
                            </div>
                            <div className={styles.infoItem}>
                                <span>ID:</span> <code>{element.id.substring(0, 8)}...</code>
                            </div>
                        </div>
                    </div>
                )}

                {/* Parameters tab */}
                {activeTab === 'parameters' && (
                    <div className={styles.tabContent}>
                        {parameters && Object.keys(parameters).length > 0 ? (
                            renderParameterFields()
                        ) : (
                            <p className={styles.emptyState}>No configurable parameters for this element.</p>
                        )}
                    </div>
                )}

                {/* Advanced tab */}
                {activeTab === 'advanced' && (
                    <div className={styles.tabContent}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Element Position:</label>
                            <div className={styles.positionInputs}>
                                <div>
                                    <label>X:</label>
                                    <input
                                        type="number"
                                        value={element.position?.x || 0}
                                        className={styles.formInput}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label>Y:</label>
                                    <input
                                        type="number"
                                        value={element.position?.y || 0}
                                        className={styles.formInput}
                                        disabled
                                    />
                                </div>
                            </div>
                            <p className={styles.advancedHint}>
                                Position is managed automatically through drag and drop.
                            </p>
                        </div>

                        <div className={styles.jsonPreview}>
                            <h4>Element JSON:</h4>
                            <pre>
                                {JSON.stringify(
                                    {
                                        id: element.id,
                                        type: element.type,
                                        name,
                                        description,
                                        parameters
                                    },
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.updateButton}
                >
                    Update {getTypeLabel(element.type)}
                </button>
            </form>
        </div>
    );
};

export default PropertiesPanel;
