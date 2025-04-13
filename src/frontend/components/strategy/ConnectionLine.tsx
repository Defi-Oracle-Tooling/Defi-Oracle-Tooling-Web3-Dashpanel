import React, { useState } from 'react';
import styles from '../../styles/strategy.module.css';
import { Connection } from '../../store/strategyStore';

interface ConnectionLineProps {
    connection: Connection;
    sourcePosition: { x: number; y: number };
    targetPosition: { x: number; y: number };
    onSelect: (id: string) => void;
    isSelected: boolean;
    onDelete?: (id: string) => void;
}

/**
 * Renders a visual connection line between two strategy elements
 * with enhanced interaction and visual feedback
 */
const ConnectionLine: React.FC<ConnectionLineProps> = ({
    connection,
    sourcePosition,
    targetPosition,
    onSelect,
    isSelected,
    onDelete
}) => {
    // State for hover effect
    const [isHovered, setIsHovered] = useState(false);

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

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(connection.id);
        }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Determine stroke color and width based on state
    const strokeColor = isSelected ? '#4c84ff' : (isHovered ? '#6a7eec' : '#6c757d');
    const strokeWidth = isSelected ? 3 : (isHovered ? 2.5 : 2);

    // Custom style for delete button
    const deleteButtonStyle = {
        background: '#ff4757',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: isSelected || isHovered ? 1 : 0,
        transition: 'opacity 0.2s',
        pointerEvents: isSelected || isHovered ? 'auto' : 'none' as React.CSSProperties['pointerEvents'],
    };

    return (
        <g
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
        >
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
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={isSelected ? "none" : (isHovered ? "5,3" : "none")}
            />

            {/* Connection label if provided */}
            {(connection.label || isSelected || isHovered) && (
                <foreignObject
                    x={midX - 50}
                    y={midY - 15}
                    width="100"
                    height="30"
                    style={{
                        overflow: 'visible',
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: isSelected || isHovered ? 'rgba(255,255,255,0.9)' : 'transparent',
                            padding: isSelected || isHovered ? '3px 6px' : '0',
                            borderRadius: '4px',
                            boxShadow: isSelected || isHovered ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            color: isSelected ? '#4c84ff' : '#6c757d',
                            transition: 'all 0.2s',
                            userSelect: 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        {connection.label || 'Flow'}
                        {onDelete && (isSelected || isHovered) && (
                            <button
                                onClick={handleDelete}
                                style={deleteButtonStyle}
                                title="Delete connection"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </foreignObject>
            )}

            {/* Arrowhead marker definition */}
            <defs>
                <marker
                    id={`arrowhead-${connection.id}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                >
                    <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill={strokeColor}
                    />
                </marker>
            </defs>

            {/* Line with arrowhead */}
            <path
                d={path}
                style={{
                    fill: 'none',
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    markerEnd: `url(#arrowhead-${connection.id})`,
                    transition: 'stroke 0.2s, stroke-width 0.2s'
                }}
            />
        </g>
    );
};

export default ConnectionLine;
