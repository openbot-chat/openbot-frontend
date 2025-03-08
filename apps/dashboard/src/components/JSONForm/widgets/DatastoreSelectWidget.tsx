import { WidgetProps } from '@rjsf/utils'
import { DatastoreSelect } from '@/features/datastore/components/DatastoreSelect'

export type DatastoreSelectWidgetProps = WidgetProps



export const DatastoreSelectWidget: React.FC<DatastoreSelectWidgetProps> = ({
  id, 
  readonly, 
  disabled, 
  required, 
  onChange, 
  label, 
  value, 
  autofocus = false, 
  options,
}) => {
  return <DatastoreSelect value={value} onSelect={onChange} />
}