import { createContext, useContext } from 'react';

// Context cho Accordion cha (quản lý ID của panel đang active)
export interface AccordionContextType {
  activeId: string | null;
  toggleItem: (id: string) => void;
  collapsible: boolean;
}

export const AccordionContext = createContext<AccordionContextType | null>(null);

// Hook an toàn để dùng AccordionContext trong các component con
export function useAccordionContext(): AccordionContextType {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Lỗi cấu trúc Compound Component: Các component con của Accordion (Accordion.Item, Accordion.Header, Accordion.Panel) phải được bọc bên trong <Accordion>!'
    );
  }
  return context;
}

// Context cho từng Accordion.Item cụ thể (cung cấp ID và trạng thái isOpen của item đó)
export interface AccordionItemContextType {
  id: string;
  isOpen: boolean;
  disabled?: boolean;
}

export const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

// Hook an toàn để dùng trong Accordion.Header hoặc Accordion.Panel
export function useAccordionItemContext(): AccordionItemContextType {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      'Lỗi cấu trúc Compound Component: Accordion.Header và Accordion.Panel phải được đặt bên trong một <Accordion.Item>!'
    );
  }
  return context;
}
