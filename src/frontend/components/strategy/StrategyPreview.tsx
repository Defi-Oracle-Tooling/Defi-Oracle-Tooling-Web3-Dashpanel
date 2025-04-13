import React, { useState } from 'react';
import styles from '../../styles/strategy.module.css';
import useStrategyStore, { StrategyState } from '../../store/strategyStore';

interface StrategyPreviewProps {
    isOpen?: boolean;
    onClose?: () => void;
}

/**
 * Displays the strategy as a formatted JSON structure
 */
const StrategyPreview: React.FC<StrategyPreviewProps> = ({
    isOpen = false,
    onClose
}) => {
    const [copySuccess, setCopySuccess] = useState(false);

    // Get strategy data from store
    const { strategyName, description, elements, connections } = useStrategyStore();

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

    // Handle copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.previewOverlay}>
            <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                    <h3>Strategy JSON Preview</h3>
                    <div className={styles.previewControls}>
                        <button
                            className={styles.copyButton}
                            onClick={handleCopy}
                        >
                            {copySuccess ? 'Copied!' : 'Copy JSON'}
                        </button>
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
                <pre className={styles.jsonPreview}>
                    {formattedJson}
                </pre>
            </div>
        </div>
    );
};

export default StrategyPreview;
