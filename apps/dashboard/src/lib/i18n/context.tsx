"use client"
import { useDayjsLocale } from '@/hooks/useDayjsLocale';
import React, { PropsWithChildren } from 'react';

export type TranslationContextValue = {
  lng: string;
}

export const TranslationContext = React.createContext<TranslationContextValue | undefined>(undefined);


export function TranslationProvider({ children, ...value }: PropsWithChildren<TranslationContextValue>) {
  useDayjsLocale(value.lng);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext(): TranslationContextValue {
  return React.useContext(TranslationContext) as TranslationContextValue;
}