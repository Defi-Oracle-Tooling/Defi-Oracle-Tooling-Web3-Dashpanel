import React, { useState, useEffect } from 'react';
import styles from '../../styles/strategy.module.css';
import { StrategyElement, ElementType } from '../../store/strategyStore';

interface PropertiesPanelProps {
    element: StrategyElement;
    onUpdateElement: (id: string, updates: Partial<StrategyElement>) => void;
}

/**
 * Panel for editing the properties of a selected strategy element
 */
const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onUpdateElement }) => {
    // Local state for form fields
    const [name, setName] = useState(element.name);
    const [description, setDescription] = useState(element.description);
    const [parameters, setParameters] = useState<Record<string, any>>(element.parameters || {});

    // Update local state when the element changes
    useEffect(() => {
        setName(element.name);
        setDescription(element.description);
        setParameters(element.parameters || {});
    }, [element.id, element.name, element.description, element.parameters]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
    };

    // Render different parameter fields based on element type
    const renderParameterFields = () => {
        if (!parameters) return null;

        return Object.entries(parameters).map(([key, value]) => {
            // Determine the input type based on the value type
            let inputType = 'text';
            if (typeof value === 'number') inputType = 'number';
            else if (typeof value === 'boolean') inputType = 'checkbox';

            // For type safety with checkboxes
            const isCheckbox = inputType === 'checkbox';

            return (
                <div key={key} className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                        {isCheckbox ? (
                            <input
                                type="checkbox"
                                checked={!!value}
                                onChange={(e) => handleParameterChange(key, e.target.checked)}
                                className={styles.formCheckbox}
                            />
                        ) : (
                            <input
                                type={inputType}
                                value={value}
                                onChange={(e) => handleParameterChange(
                                    key,
                                    inputType === 'number' ? parseFloat(e.target.value) : e.target.value
                                )}
                                className={styles.formInput}
                            />
                        )}
                    </label>
                </div>
            );
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

    return (
        <div className={styles.propertiesPanel}>
            <h3 className={styles.propertiesTitle}>{getTypeLabel(element.type)} Properties</h3>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.formTextarea}
                    />
                </div>

                {parameters && Object.keys(parameters).length > 0 && (
                    <>
                        <h4 className={styles.parametersTitle}>Parameters</h4>
                        {renderParameterFields()}
                    </>
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
