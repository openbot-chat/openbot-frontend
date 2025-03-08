import { useMemo, useState } from 'react';
import {
  chakra,
  Card,
  TableContainer,
  Table as ChakraTable, Tbody, Th, Thead, Tr, Td, Checkbox, Box, Skeleton,
} from '@chakra-ui/react';
import { 
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable, 
  Row,
  HeaderContext,
  CellContext,
} from "@tanstack/react-table"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"


export type TableColumn = {
  title: string;
}

type EnabledFn<T> = (row: Row<T>) => boolean;

type Updater = (old: Record<string, boolean>) => Record<string, boolean>;

export type RowSelection<T> = {
  enabled: boolean | EnabledFn<T>;
  onRowSelectionChange?: (v: Record<string, boolean> | Updater) => void;
  selection?: Record<string, boolean>;
}

export type TableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  rowSelection?: RowSelection<T>;
  loading?: boolean;
}

export function Table<T>(props: TableProps<T>) {
  const { columns: _columns, data, rowSelection, loading } = props;
  
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<T>[]>(() => {
    if (rowSelection) {
      const col = {
        id: 'select',
        enableSorting: false,
        header: ({ table }: HeaderContext<T, unknown>) => <Checkbox isChecked={table.getIsAllRowsSelected()} isIndeterminate={table.getIsSomeRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />,
        cell: ({ row }: CellContext<T, unknown>) => (
          <Checkbox 
            isChecked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            isIndeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      }

      return [col, ..._columns];
    }

    return _columns;
  }, [_columns, rowSelection]);

  const table = useReactTable({ 
    state: {
      rowSelection: rowSelection?.selection ?? {},
      sorting,
    },
    onSortingChange: setSorting,
    columns,
    data, 
    enableRowSelection: rowSelection?.enabled,
    onRowSelectionChange: rowSelection?.onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card w='full'>
      <TableContainer>
        <ChakraTable>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <Box
                        cursor={header.column.getCanSort()? "pointer" : "base"}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <chakra.span pl="4">
                          {{
                            asc: <TriangleUpIcon aria-label="sorted ascending" />,
                            desc: <TriangleDownIcon aria-label="sorted descending" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </chakra.span>
                      </Box>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {loading ? <TableLoading columnsToLoad={table.getHeaderGroups()[0].headers.length} rowsToLoad={10} /> : (
              <>
                {table.getRowModel()?.rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </>
            )}
          </Tbody>
        </ChakraTable>
      </TableContainer>
    </Card>
  );
}



const TableLoading = ({ columnsToLoad = 1, rowsToLoad = 1 }) => {
  const columns = new Array(columnsToLoad).fill(1);
  const rows = new Array(rowsToLoad).fill(1);
  return (
    <>
      {rows.map((_, index) => (
        <Tr key={index}>
          {columns.map((_, index) => (
            <Td key={index}>
              <Skeleton h="10px" rounded="lg" />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
};