import React, { useRef } from 'react';
import styles from '../../styles/strategy.module.css';
import { StrategyElement, ElementType } from '../../store/strategyStore';

// Define props for the DraggableElement component
interface DraggableElementProps {
    element: StrategyElement;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onMove?: (id: string, position: { x: number; y: number }) => void;
    onStartConnection?: (sourceId: string) => void;
    onEndConnection?: (targetId: string) => void;
}

/**
 * A draggable component representing a strategy element (trigger, action, or condition)
 */
const DraggableElement: React.FC<DraggableElementProps> = ({
    element,
    isSelected,
    onSelect,
    onMove,
    onStartConnection,
    onEndConnection
}) => {
    // Refs for drag handling
    const elementRef = useRef<HTMLDivElement>(null);
    const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
    const originalPosRef = useRef<{ x: number; y: number } | null>(null);

    // Get class name based on element type
    const getElementTypeClass = (type: ElementType): string => {
        switch (type) {
            case 'trigger':
                return styles.triggerElement;
            case 'action':
                return styles.actionElement;
            case 'condition':
                return styles.conditionElement;
            default:
                return '';
        }
    };

    // Handle mouse down for drag start
    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start drag on left mouse button
        if (e.button !== 0) return;

        e.stopPropagation();
        e.preventDefault();

        onSelect(element.id);

        // Store starting position
        dragStartPosRef.current = { x: e.clientX, y: e.clientY };
        originalPosRef.current = element.position || { x: 0, y: 0 };

        // Add event listeners for drag and drop
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Handle mouse move during drag
    const handleMouseMove = (e: MouseEvent) => {
        if (!dragStartPosRef.current || !originalPosRef.current || !onMove) return;

        // Calculate new position
        const dx = e.clientX - dragStartPosRef.current.x;
        const dy = e.clientY - dragStartPosRef.current.y;

        // Update element position
        onMove(element.id, {
            x: originalPosRef.current.x + dx,
            y: originalPosRef.current.y + dy
        });
    };

    // Handle mouse up for drag end
    const handleMouseUp = () => {
        // Clean up event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Reset refs
        dragStartPosRef.current = null;
        originalPosRef.current = null;
    };

    // Handle starting a connection from this element
    const handleStartConnection = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onStartConnection) {
            onStartConnection(element.id);
        }
    };

    // Handle ending a connection at this element
    const handleEndConnection = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEndConnection) {
            onEndConnection(element.id);
        }
    };

    return (
        <div
            ref={elementRef}
            className={`${styles.draggableElement} ${getElementTypeClass(element.type)} ${isSelected ? styles.selected : ''}`}
            style={{
                transform: element.position ? `translate(${element.position.x}px, ${element.position.y}px)` : undefined
            }}
            onMouseDown={handleMouseDown}
            onClick={() => onSelect(element.id)}
        >
            <div className={styles.elementHeader}>{element.name}</div>
            <div className={styles.elementBody}>
                <p>{element.description}</p>
                {/* Additional element content can be added here */}
            </div>

            {/* Connection handles */}
            <div className={styles.elementHandles}>
                {/* Source handle (bottom) */}
                <div
                    className={`${styles.handle} ${styles.sourceHandle}`}
                    onMouseDown={handleStartConnection}
                />

                {/* Target handle (top) */}
                <div
                    className={`${styles.handle} ${styles.targetHandle}`}
                    onMouseDown={handleEndConnection}
                />
            </div>
        </div>
    );
};

export default DraggableElement;
