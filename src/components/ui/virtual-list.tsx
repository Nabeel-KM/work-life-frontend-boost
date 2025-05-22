
import React, { useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface VirtualListProps<T> {
  items: T[];
  height: number;
  width?: string | number;
  estimateSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey?: (index: number) => string | number;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  height,
  width = '100%',
  estimateSize = 50,
  renderItem,
  itemKey,
  overscan = 5,
  className,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: itemKey
  });

  if (!isMounted) {
    // SSR fallback - show a few items
    return (
      <div style={{ height, width }} className={className}>
        {items.slice(0, 5).map((item, index) => (
          <div key={itemKey ? itemKey(index) : index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      style={{ height, width, overflow: 'auto' }}
      className={className}
      role="list"
    >
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            role="listitem"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
