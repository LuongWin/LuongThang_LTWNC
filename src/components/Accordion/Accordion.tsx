import React, { useState, useCallback, useId } from 'react';
import {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
} from './AccordionContext';
import './Accordion.css';

// ----------------------------------------------------
// 1. Accordion (Root Component)
// ----------------------------------------------------
export interface AccordionProps {
  children: React.ReactNode;
  /** Panel mở mặc định khi khởi tạo */
  defaultActiveId?: string | null;
  /** Panel mở ở chế độ Controlled */
  activeId?: string | null;
  /** Sự kiện khi đổi panel đang mở */
  onChange?: (activeId: string | null) => void;
  /** Cho phép click vào panel đang mở để đóng lại hay không (Mặc định: true) */
  collapsible?: boolean;
  className?: string;
}

export function AccordionRoot({
  children,
  defaultActiveId = null,
  activeId: controlledActiveId,
  onChange,
  collapsible = true,
  className = '',
}: AccordionProps) {
  // Quản lý trạng thái nội bộ nếu không dùng chế độ controlled
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);

  const isControlled = controlledActiveId !== undefined;
  const currentActiveId = isControlled ? controlledActiveId : internalActiveId;

  // Logic cốt lõi: Chỉ cho phép mở duy nhất 1 panel tại một thời điểm
  const toggleItem = useCallback(
    (id: string) => {
      let nextId: string | null;

      if (currentActiveId === id) {
        // Đang mở panel này mà bấm tiếp: nếu collapsible=true thì đóng, ngược lại giữ nguyên
        nextId = collapsible ? null : id;
      } else {
        // Bấm sang panel khác: Mở panel mới, đồng thời panel cũ tự động đóng lại
        nextId = id;
      }

      if (!isControlled) {
        setInternalActiveId(nextId);
      }
      onChange?.(nextId);
    },
    [currentActiveId, collapsible, isControlled, onChange]
  );

  return (
    <AccordionContext.Provider
      value={{
        activeId: currentActiveId,
        toggleItem,
        collapsible,
      }}
    >
      <div className={`accordion-container ${className}`.trim()} data-accordion-root>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ----------------------------------------------------
// 2. Accordion.Item
// ----------------------------------------------------
export interface AccordionItemProps {
  /** ID định danh duy nhất của panel */
  id?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function AccordionItem({
  id: customId,
  children,
  disabled = false,
  className = '',
}: AccordionItemProps) {
  const autoId = useId();
  const itemId = customId || autoId;

  const { activeId } = useAccordionContext();
  const isOpen = activeId === itemId;

  return (
    <AccordionItemContext.Provider
      value={{
        id: itemId,
        isOpen,
        disabled,
      }}
    >
      <div
        className={`accordion-item ${isOpen ? 'is-open' : 'is-closed'} ${
          disabled ? 'is-disabled' : ''
        } ${className}`.trim()}
        data-accordion-item
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// ----------------------------------------------------
// 3. Accordion.Header (Trigger)
// ----------------------------------------------------
export interface AccordionHeaderProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  hideIcon?: boolean;
  className?: string;
}

export function AccordionHeader({
  children,
  icon,
  hideIcon = false,
  className = '',
}: AccordionHeaderProps) {
  const { toggleItem } = useAccordionContext();
  const { id, isOpen, disabled } = useAccordionItemContext();

  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  const handleClick = () => {
    if (!disabled) {
      toggleItem(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <h3 className="accordion-heading">
      <button
        type="button"
        id={headerId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`accordion-trigger ${isOpen ? 'is-expanded' : ''} ${className}`.trim()}
      >
        <span className="accordion-header-content">{children}</span>

        {!hideIcon && (
          <span className={`accordion-icon-wrapper ${isOpen ? 'rotate-180' : ''}`}>
            {icon ? (
              icon
            ) : (
              <svg
                className="accordion-chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </span>
        )}
      </button>
    </h3>
  );
}

// ----------------------------------------------------
// 4. Accordion.Panel (Content / Body)
// ----------------------------------------------------
export interface AccordionPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Giữ nguyên DOM khi đóng để bảo toàn state bên trong hoặc tối ưu SEO */
  keepMounted?: boolean;
}

export function AccordionPanel({
  children,
  className = '',
  keepMounted = false,
}: AccordionPanelProps) {
  const { id, isOpen } = useAccordionItemContext();

  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  if (!isOpen && !keepMounted) {
    return null;
  }

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={headerId}
      hidden={!isOpen}
      className={`accordion-panel ${isOpen ? 'is-visible' : 'is-hidden'} ${className}`.trim()}
    >
      <div className="accordion-panel-inner">{children}</div>
    </div>
  );
}

// ----------------------------------------------------
// 5. Compound Component Composition
// ----------------------------------------------------
export type AccordionComponent = typeof AccordionRoot & {
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Panel: typeof AccordionPanel;
  // Các alias thân thiện tiện lợi
  Trigger: typeof AccordionHeader;
  Content: typeof AccordionPanel;
  Body: typeof AccordionPanel;
};

export const Accordion = AccordionRoot as AccordionComponent;
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;
Accordion.Trigger = AccordionHeader;
Accordion.Content = AccordionPanel;
Accordion.Body = AccordionPanel;

export default Accordion;
