import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  CellContext,
} from '@tanstack/react-table'
import {
  chakra,
  Card,
  TableContainer,
  Table as ChakraTable, Tbody, Th, Thead, Tr, Td, Box, Input, Select, Switch, IconButton,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react'
import { PlusIcon } from '../icons';


type QueryParameter = {
  name: string
}

const Cell: React.FC<CellContext<unknown, unknown>> = ({ getValue, row: { index }, column: { id }, table }) => {
  const initialValue = getValue()
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (id === 'type') {
    return (
      <Select
        variant="unstyled"
      >
        <option value="string">string</option>
        <option value="number">number</option>
        <option value="boolean">boolean</option>
        <option value="integer">integer</option>
      </Select>
    )
  } else if (id === 'required') {
    return (
      <Switch
      />
    )
  }

  return (
    <Input
      p={2}
      variant="unstyled"
      value={value as string}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
    />
  )
}

const defaultColumn: Partial<ColumnDef<QueryParameter>> = {
  cell: Cell,
}



type Props = {
  data: QueryParameter[]
}

export const QueryParametersTable = ({
  data: _data,
}: Props) => {
  const columns = useMemo<ColumnDef<QueryParameter>[]>(() => 
    [
      {
        header: 'Field Name',
        accessorKey: 'name',
      },
      {
        header: 'Field Type',
        accessorKey: 'type',
      },
      {
        header: 'Required',
        accessorKey: 'required',
      },
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        header: 'Default Value',
        accessorKey: 'defaultValue',
      },
      {
        header: 'Test Value',
        accessorKey: 'testValue',
      },
    ]
  , [])

  const [data, setData] = useState([])
  useEffect(() => {
    setData(_data)
  }, [_data])

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        // skipAutoResetPageIndex()
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    }
  })

  return (
    <>
      <TableContainer>
        <ChakraTable size='sm' variant='unstyled'>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id} borderColor="gray.300">
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
                      </Box>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows?.map((row, i) => (
              <>
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} p={0}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                  <Td>
                    {table.getRowModel().rows?.length - 1 === i && (
                      <IconButton aria-label='Plus' icon={<PlusIcon/>}/>
                    )}
                  </Td>
                </Tr>
              </>
            ))}
          </Tbody>
        </ChakraTable>
      </TableContainer>
    </>
  )
}




const QueryParameterEditableRow = () => {
  return (
    <>
      ha
    </>
  )
}