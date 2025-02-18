import { forwardRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VirtualTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (value: any) => React.ReactNode;
  }[];
  virtualRows: any[];
  totalSize: number;
}

export const VirtualTable = forwardRef<HTMLDivElement, VirtualTableProps<any>>(
  ({ data, columns, virtualRows, totalSize }, ref) => {
    return (
      <div ref={ref} className="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey as string}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <tr style={{ height: `${totalSize}px` }}>
              <td colSpan={columns.length}>
                <div style={{ position: 'relative' }}>
                  {virtualRows.map((virtualRow) => {
                    const row = data[virtualRow.index];
                    return (
                      <TableRow
                        key={virtualRow.index}
                        data-index={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell key={column.accessorKey as string}>
                            {column.cell
                              ? column.cell(row[column.accessorKey])
                              : row[column.accessorKey]}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </div>
              </td>
            </tr>
          </TableBody>
        </Table>
      </div>
    );
  }
);

VirtualTable.displayName = 'VirtualTable';