import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState, useEffect } from 'react';

interface UseVirtualTableProps<T> {
  data: T[];
  rowHeight?: number;
  overscan?: number;
}

export function useVirtualTable<T>({ 
  data, 
  rowHeight = 40, 
  overscan = 5 
}: UseVirtualTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      const observer = new ResizeObserver((entries) => {
        setTableHeight(entries[0].contentRect.height);
      });
      
      observer.observe(parentRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  return {
    parentRef,
    rowVirtualizer,
    virtualRows: rowVirtualizer.getVirtualItems(),
    totalSize: rowVirtualizer.getTotalSize(),
  };
}