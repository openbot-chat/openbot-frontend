import { WidgetProps } from '@rjsf/utils';
import { PromptSelect } from '@/features/prompt/components/PromptSelect';

export type PromptSelectWidgetProps = WidgetProps




export const PromptSelectWidget: React.FC<PromptSelectWidgetProps> = ({
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

  return <PromptSelect label={label} promptId={value} onSelect={onChange} />;
}