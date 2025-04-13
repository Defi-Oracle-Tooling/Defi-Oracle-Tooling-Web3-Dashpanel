import React, { useState, useEffect } from 'react';
import useStrategyStore from '../store/strategyStore';
import StrategyPreview from '../components/strategy/StrategyPreview';
import styles from '../styles/demo.module.css';

const StrategyDemoPage: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    initializeStrategy,
    setStrategyName,
    setDescription,
    addElement,
    addConnection
  } = useStrategyStore();

  // Initialize the strategy with demo data when the component mounts
  useEffect(() => {
    // Clear any existing strategy first
    initializeStrategy();

    // Set basic metadata
    setStrategyName('DeFi Price Alert & Swap Strategy');
    setDescription('Monitors asset price changes and executes swaps when thresholds are met');

    // Create IDs first
    const triggerId = 'trigger-' + Math.random().toString(36).substr(2, 9);
    const conditionId = 'condition-' + Math.random().toString(36).substr(2, 9);
    const actionId = 'action-' + Math.random().toString(36).substr(2, 9);

    // Add some elements (nodes)
    addElement({
      id: triggerId,
      type: 'trigger',
      name: 'Price Change Monitor',
      description: 'Triggers when asset price changes by specified percentage',
      parameters: {
        asset: 'ETH',
        percentage: 5,
        direction: 'both',
        interval: 60 // seconds
      },
      position: { x: 100, y: 150 }
    });

    addElement({
      id: conditionId,
      type: 'condition',
      name: 'Balance Check',
      description: 'Verifies sufficient balance before executing swap',
      parameters: {
        minBalance: 0.5,
        asset: 'ETH'
      },
      position: { x: 400, y: 150 }
    });

    addElement({
      id: actionId,
      type: 'action',
      name: 'Swap Assets',
      description: 'Executes a token swap on specified DEX',
      parameters: {
        dex: 'Uniswap',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        slippageTolerance: 0.5,
        amount: 0.25
      },
      position: { x: 700, y: 150 }
    });

    // Connect the elements
    addConnection({
      id: 'connection-' + Math.random().toString(36).substr(2, 9),
      sourceId: triggerId,
      targetId: conditionId,
      label: 'On threshold reached'
    });

    addConnection({
      id: 'connection-' + Math.random().toString(36).substr(2, 9),
      sourceId: conditionId,
      targetId: actionId,
      label: 'If sufficient balance'
    });
  }, []);

  // Toggle the preview modal
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <div className={styles.demoContainer}>
      <header className={styles.demoHeader}>
        <h1>Strategy Builder Demo</h1>
        <p>This demo showcases how to use the StrategyPreview component to display your strategy configuration.</p>
      </header>

      <section className={styles.demoContent}>
        <div className={styles.demoDescription}>
          <h2>What is a DeFi Strategy?</h2>
          <p>
            A DeFi strategy is a sequence of automated actions triggered by specific events in the
            blockchain ecosystem. These strategies allow users to execute complex operations like
            swaps, loans, and position management without manual intervention.
          </p>

          <h3>Components of a Strategy:</h3>
          <ul>
            <li><strong>Triggers:</strong> Events that initiate the strategy (price changes, time intervals, etc.)</li>
            <li><strong>Conditions:</strong> Logic gates that determine if the next steps should execute</li>
            <li><strong>Actions:</strong> Operations performed on the blockchain (swaps, deposits, etc.)</li>
            <li><strong>Connections:</strong> Define the flow between components</li>
          </ul>
        </div>

        <div className={styles.demoActions}>
          <h3>Demo Strategy: Price-Based Asset Swap</h3>
          <p>We've created a simple demo strategy that monitors ETH price and performs a swap when conditions are met.</p>

          <button
            className={styles.previewButton}
            onClick={togglePreview}
          >
            View Strategy Preview
          </button>

          <p className={styles.demoHint}>
            Click the button above to open the Strategy Preview component. Explore the different tabs:
          </p>
          <ul className={styles.featureList}>
            <li><strong>JSON:</strong> View the raw strategy data</li>
            <li><strong>Visual Summary:</strong> See a simplified representation of your strategy</li>
            <li><strong>Validation:</strong> Check if your strategy meets all requirements for execution</li>
          </ul>
        </div>
      </section>

      <section className={styles.demoInstructions}>
        <h2>How to Use the StrategyPreview Component</h2>

        <div className={styles.codeExample}>
          <h3>Import and Render:</h3>
          <pre>
            {`import StrategyPreview from '../components/strategy/StrategyPreview';

// In your component:
const [isPreviewOpen, setIsPreviewOpen] = useState(false);

// Toggle function
const togglePreview = () => setIsPreviewOpen(!isPreviewOpen);

// In your JSX:
<button onClick={togglePreview}>View Strategy</button>
<StrategyPreview 
  isOpen={isPreviewOpen} 
  onClose={togglePreview} 
/>`}
          </pre>
        </div>

        <div className={styles.tipsList}>
          <h3>Key Features:</h3>
          <ul>
            <li>View strategy as formatted JSON</li>
            <li>Copy to clipboard with one click</li>
            <li>Export as JSON or YAML files</li>
            <li>Interactive visual summary</li>
            <li>Strategy validation with detailed feedback</li>
            <li>Expandable/collapsible sections for better readability</li>
          </ul>
        </div>
      </section>

      {/* Render the StrategyPreview component */}
      <StrategyPreview
        isOpen={isPreviewOpen}
        onClose={togglePreview}
      />
    </div>
  );
};

export default StrategyDemoPage;
