import React from 'react';
// import styles from '../../styles/user.module.css'; // Optional: Add specific styles later

const StrategyBuilder: React.FC = () => {
    return (
        <section /* className={styles.strategySection} */ style={{ marginBottom: '20px' }}> {/* Added margin for spacing */}
            <h2>Strategy Builder</h2>
            <p>Drag-and-drop interface for building trading strategies will go here.</p>
            {/* Placeholder content */}
            <div style={{ border: '1px dashed grey', padding: '20px', minHeight: '150px', marginTop: '10px' }}>
                Strategy Canvas Area
            </div>
        </section>
    );
};

export default StrategyBuilder;
