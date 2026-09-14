import React, { createContext, useContext, useState } from 'react';
import './Tabs.css';

// Context cho Tabs
interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Các component con của Tabs phải được đặt trong <Tabs>');
  }
  return context;
}

// 1. Root Tabs
export interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsRoot({ defaultTab, children, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`tabs-container ${className}`.trim()}>{children}</div>
    </TabsContext.Provider>
  );
}

// 2. TabList
export function TabList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`tab-list ${className}`.trim()} role="tablist">
      {children}
    </div>
  );
}

// 3. Tab (Trigger)
export interface TabProps {
  id: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function Tab({ id, children, icon, className = '' }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`tab-item ${isActive ? 'active' : ''} ${className}`.trim()}
      onClick={() => setActiveTab(id)}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// 4. TabPanels container
export function TabPanels({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`tab-panels ${className}`.trim()}>{children}</div>;
}

// 5. TabPanel (Content)
export interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className = '' }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div role="tabpanel" className={`tab-panel ${className}`.trim()}>
      {children}
    </div>
  );
}

// Gắn Subcomponents vào Tabs
export type TabsComponent = typeof TabsRoot & {
  List: typeof TabList;
  Tab: typeof Tab;
  Panels: typeof TabPanels;
  Panel: typeof TabPanel;
};

export const Tabs = TabsRoot as TabsComponent;
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

export default Tabs;
