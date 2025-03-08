import { FormControl, FormLabel, IconButton, Table, Tbody, Tr, Td, Tfoot, Th, Thead, Button, HStack, TableCaption } from "@chakra-ui/react"
import React from 'react'
import { FieldTemplateProps, ArrayFieldTemplateProps, ArrayFieldTemplateItemType, ObjectFieldTemplateProps } from '@rjsf/utils'
import { PlusIcon } from "@/components/icons"
import { DeleteIcon } from "@chakra-ui/icons"


export const RowFieldTemplate = (props: FieldTemplateProps) => <>{props.children}</>


export const TableArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const {
    required,
    title,
  } = props

  return (
    <FormControl isRequired={required}>
      <FormLabel>{title}</FormLabel>
      <Table>
        <Thead>
          {Object.values(props.schema.items.properties).map((p, i) => <Th key={i}>{p.title}</Th>)}
        </Thead>
        <Tbody>
          {props.items.map(({ key, ...itemProps}) => (
            <TableArrayFieldItemTemplate 
              key={key} 
              {...itemProps} 
            /> 
          ))}
        </Tbody>
        <Tfoot>
          {props.canAdd && (
            <HStack p={2}>
              <Button leftIcon={<PlusIcon/>} onClick={props.onAddClick}>Add</Button>
            </HStack>
          )}
        </Tfoot>
      </Table>
    </FormControl>
  )
}

export const TableArrayFieldItemTemplate = (props: ArrayFieldTemplateItemType) => {
  const { 
    index, 
    children, 
    onDropIndexClick,
  } = props

  return (
    <Tr>
      {children}
      <Td>
        <IconButton icon={<DeleteIcon/>} aria-label="Delete" onClick={onDropIndexClick(index)} />
      </Td>
    </Tr>
  )
}

export const RowObjectFieldTemplate = ({ title, idSchema: { $id }, properties, uiSchema: { layout }, onDropIndexClick }: ObjectFieldTemplateProps) => {  
  return (
    <>
      {properties.map((element) => {
        return (
          <Td key={element.content.key} mb="10px">
            {element.content}
          </Td>
        )
      })}
    </>
  )
}