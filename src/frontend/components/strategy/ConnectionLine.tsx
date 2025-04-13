import React from 'react';
import styles from '../../styles/strategy.module.css';
import { Connection } from '../../store/strategyStore';

interface ConnectionLineProps {
    connection: Connection;
    sourcePosition: { x: number; y: number };
    targetPosition: { x: number; y: number };
    onSelect: (id: string) => void;
    isSelected: boolean;
}

/**
 * Renders a visual connection line between two strategy elements
 */
const ConnectionLine: React.FC<ConnectionLineProps> = ({
    connection,
    sourcePosition,
    targetPosition,
    onSelect,
    isSelected
}) => {
    // Calculate control points for a curved line (quadratic bezier)
    const sourceX = sourcePosition.x + 100; // Assuming element width of 200px, so midpoint is +100
    const sourceY = sourcePosition.y + 50;  // Assuming element height of ~100px, so midpoint is +50
    const targetX = targetPosition.x + 100;
    const targetY = targetPosition.y + 50;

    // Determine control point for curve (perpendicular to the line between source and target)
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const curvature = Math.min(distance * 0.5, 100); // Adjust curve intensity based on distance

    // Perpendicular direction
    const perpX = -dy / distance;
    const perpY = dx / distance;

    // Control point in the middle with perpendicular offset
    const controlX = (sourceX + targetX) / 2 + perpX * curvature;
    const controlY = (sourceY + targetY) / 2 + perpY * curvature;

    // Generate path for the curved line
    const path = `M ${sourceX} ${sourceY} Q ${controlX} ${controlY}, ${targetX} ${targetY}`;

    // Calculate midpoint of the curve for label placement
    const midX = (sourceX + targetX) / 2 + perpX * curvature / 2;
    const midY = (sourceY + targetY) / 2 + perpY * curvature / 2;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(connection.id);
    };

    return (
        <g onClick={handleClick} style={{ cursor: 'pointer' }}>
            {/* Invisible wider path for easier selection */}
            <path
                d={path}
                stroke="transparent"
                strokeWidth={12}
                fill="none"
            />

            {/* Visible connection line */}
            <path
                d={path}
                className={`${styles.connectionLine} ${isSelected ? styles.selectedConnection : ''}`}
            />

            {/* Connection label if provided */}
            {connection.label && (
                <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className={styles.connectionLabel}
                    fill={isSelected ? '#4c84ff' : '#6c757d'}
                    style={{
                        fontSize: '12px',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        userSelect: 'none'
                    }}
                >
                    {connection.label}
                </text>
            )}

            {/* Arrowhead at target */}
            <marker
                id={`arrowhead-${connection.id}`}
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
            >
                <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={isSelected ? '#4c84ff' : '#6c757d'}
                />
            </marker>
        </g>
    );
};

export default ConnectionLine;
