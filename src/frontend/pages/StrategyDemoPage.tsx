import React from 'react';
import styles from '../styles/user.module.css';
import StrategyBuilder from '../components/user/StrategyBuilder';

/**
 * Example page demonstrating the use of the StrategyBuilder component
 */
const StrategyDemoPage: React.FC = () => {
    return (
        <div className={styles.pageContainer}>
            <header className={styles.demoHeader}>
                <h1>DeFi Strategy Builder Demo</h1>
                <p>
                    Create automated trading strategies by adding elements, connecting them,
                    and configuring their parameters. Then preview and save your strategy.
                </p>
            </header>

            <main className={styles.mainContent}>
                {/* Strategy Builder Component */}
                <StrategyBuilder />

                {/* Usage Instructions */}
                <section className={styles.instructionsSection}>
                    <h2>How to Use the Strategy Builder</h2>
                    <ol>
                        <li>
                            <strong>Add Elements</strong> - Use the buttons at the top to add triggers,
                            conditions, and actions to your strategy.
                        </li>
                        <li>
                            <strong>Position Elements</strong> - Drag elements around the canvas to arrange them.
                        </li>
                        <li>
                            <strong>Create Connections</strong> - Click on the bottom handle of one element,
                            then click on the top handle of another element to create a connection.
                        </li>
                        <li>
                            <strong>Configure Elements</strong> - Click on an element to open its properties
                            panel where you can adjust its parameters.
                        </li>
                        <li>
                            <strong>Preview Strategy</strong> - Click "View JSON" to see the complete strategy
                            structure in JSON format.
                        </li>
                        <li>
                            <strong>Save Strategy</strong> - When your strategy is complete, give it a name
                            and click "Save Strategy".
                        </li>
                    </ol>
                    <p>
                        <em>Note: This is a demonstration version. In a production environment,
                            strategies would be saved to a database and could be executed on actual trading platforms.</em>
                    </p>
                </section>
            </main>
        </div>
    );
};

export default StrategyDemoPage;
