import { useMemo } from "react";
import { Integration } from 'models';
import { trpc } from "@/utils/trpc-client";


const defaultDataProviders: Integration[] = [
  {
    name: 'Text',
    description: 'Paste some text',
    identifier: 'text',
  },
  {
    name: 'File',
    description: 'PDF, CSV, JSON, Text, PowerPiont, Word, Excel',
    identifier: 'file',
  },
  {
    name: 'Web Page',
    description: 'Crawl text from a web page',
    identifier: 'web_page',
  },
  {
    name: 'Web Site',
    description: 'Crawl all pages of a web site',
    identifier: 'website',
  },
  {
    name: 'Google Docs',
    description: 'Google Docs',
    identifier: 'google_docs',
  },
  {
    name: 'Lark',
    description: 'Lark',
    identifier: 'lark',
  },
  {
    name: 'Evernote',
    description: 'Evernote',
    identifier: 'evernote',
  },
  {
    name: 'MySQL',
    description: 'Collect data from Mysql Table',
    identifier: 'mysql',
  },
  {
    name: 'MongoDB',
    description: 'Collect data from MongoDB collection',
    identifier: 'mongodb',
  },
  {
    name: 'Postgres',
    description: 'Collect data from Postgres collection',
    identifier: 'postgres',
  },
  {
    name: 'Youdao',
    description: 'Youdao',
    identifier: 'youdao',
  },
];



export function useDataProviders() {
  const query = trpc.integration.list.useQuery({
    catalog: ['datasource'],
  });

  const dataProviders = useMemo(() => query.data ? [...defaultDataProviders, ...query.data.items] : defaultDataProviders, [query.data]);


  return {
    data: dataProviders,
    isLoading: query.isLoading,
  }
}



export function useDataProvider(identifier: string) {
  const query = trpc.integration.by_identifier.useQuery(identifier, {
    enabled: !!identifier,
  });

  const dataProvider = useMemo(() => query.data ?? defaultDataProviders.find(it => it.identifier === identifier), [query.data, identifier]);

  return {
    data: dataProvider,
    isLoading: query.isLoading,
  }
}