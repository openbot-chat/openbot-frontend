import React from 'react';
import { Switch } from '@chakra-ui/react';
import { WidgetProps } from '@rjsf/core';



export const SwitchWidget = ({
  id,
  autofocus,
  readonly,
  required,
  disabled,
  rawErrors,
  value = '',
  label,
  onFocus,
  onBlur,
  onChange,
}: WidgetProps) => {
  return (
    <Switch  
      id={id}
      aria-label={label}
      autoFocus={autofocus}
      isReadOnly={readonly}
      isRequired={required}
      isDisabled={disabled}
      isInvalid={!!rawErrors}
      value={value}
      onFocus={() => {
        onFocus(id, value);
      }}
      onBlur={() => {
        onBlur(id, value);
      }}
      isChecked={value}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
    />
  );
};

if (process.env.NODE_ENV === 'development') {
  SwitchWidget.displayName = 'SwitchWidget';
}