import { create } from 'zustand';

// Define types for strategy elements
export type ElementType = 'trigger' | 'action' | 'condition';

export interface StrategyElement {
  id: string;
  type: ElementType;
  name: string;
  description: string;
  // Additional properties could include parameters, config, etc.
  parameters?: Record<string, any>;
  position?: { x: number; y: number };
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface StrategyState {
  // Strategy metadata
  strategyName: string;
  description: string;
  
  // Strategy components
  elements: StrategyElement[];
  connections: Connection[];
  
  // UI state
  selectedElementId: string | null;
  
  // Actions
  setStrategyName: (name: string) => void;
  setDescription: (description: string) => void;
  addElement: (element: StrategyElement) => void;
  updateElement: (id: string, updates: Partial<StrategyElement>) => void;
  removeElement: (id: string) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  moveElement: (id: string, position: { x: number; y: number }) => void;
  
  // Strategy operations
  clearStrategy: () => void;
  loadStrategy: (strategy: Pick<StrategyState, 'strategyName' | 'description' | 'elements' | 'connections'>) => void;
  validateStrategy: () => { valid: boolean; errors: string[] };
}

// Create the store
const useStrategyStore = create<StrategyState>((set, get) => ({
  // Initial state
  strategyName: 'New Strategy',
  description: '',
  elements: [],
  connections: [],
  selectedElementId: null,
  
  // Actions
  setStrategyName: (name) => set({ strategyName: name }),
  setDescription: (description) => set({ description }),
  
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element] 
  })),
  
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    )
  })),
  
  removeElement: (id) => set((state) => {
    // Remove the element
    const newElements = state.elements.filter(el => el.id !== id);
    
    // Remove any connections to/from this element
    const newConnections = state.connections.filter(
      conn => conn.sourceId !== id && conn.targetId !== id
    );
    
    // Clear selection if this element was selected
    const selectedElementId = 
      state.selectedElementId === id ? null : state.selectedElementId;
    
    return { elements: newElements, connections: newConnections, selectedElementId };
  }),
  
  addConnection: (connection) => set((state) => ({
    connections: [...state.connections, connection]
  })),
  
  removeConnection: (id) => set((state) => ({
    connections: state.connections.filter(conn => conn.id !== id)
  })),
  
  setSelectedElement: (id) => set({ selectedElementId: id }),
  
  moveElement: (id, position) => set((state) => ({
    elements: state.elements.map(el => 
      el.id === id ? { ...el, position } : el
    )
  })),
  
  clearStrategy: () => set({
    strategyName: 'New Strategy',
    description: '',
    elements: [],
    connections: [],
    selectedElementId: null
  }),
  
  loadStrategy: (strategy) => set({
    ...strategy,
    selectedElementId: null
  }),
  
  validateStrategy: () => {
    const state = get();
    const errors: string[] = [];
    
    // Basic validation rules
    if (!state.strategyName.trim()) {
      errors.push('Strategy name is required');
    }
    
    if (state.elements.length === 0) {
      errors.push('Strategy must contain at least one element');
    }
    
    // Check for elements with no connections
    const connectedElementIds = new Set([
      ...state.connections.map(c => c.sourceId),
      ...state.connections.map(c => c.targetId)
    ]);
    
    const disconnectedElements = state.elements.filter(
      el => !connectedElementIds.has(el.id)
    );
    
    if (disconnectedElements.length > 0 && state.elements.length > 1) {
      errors.push('Some elements are not connected to the strategy flow');
    }
    
    // Additional validation rules can be added as needed
    
    return { 
      valid: errors.length === 0,
      errors 
    };
  }
}));

export default useStrategyStore;
