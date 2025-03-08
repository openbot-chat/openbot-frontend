import { WidgetProps } from '@rjsf/utils';
import { CredentialsSelect } from '@/features/credentials/components/CredentialsSelect';

export type CredentialsSelectWidgetProps = WidgetProps




export const CredentialsSelectWidget: React.FC<CredentialsSelectWidgetProps> = ({
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
  const {
    type
  } = options;

  return <CredentialsSelect credentialsId={value} type={type} onSelect={onChange} />;
}