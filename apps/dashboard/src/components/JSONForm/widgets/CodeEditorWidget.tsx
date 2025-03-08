import React, { useCallback, useContext, useEffect, useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import { Button, Flex, Select, Box, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night'
import { githubLight } from '@uiw/codemirror-theme-github'
import { LanguageName, loadLanguage } from '@uiw/codemirror-extensions-langs'
import { isDefined } from '@udecode/plate-common'



// https://github.com/machinefi/w3bstream-studio/blob/744b661c98e7f84f400506e2941a5c4ab4a63901/src/components/JSONFormWidgets/EditorWidget/index.tsx#L4

type Options = {
  emptyValue?: string;
  editorHeight?: string;
  editorTheme?: string;
  showLanguageSelector?: boolean;
  showCodeSelector?: { label: string; value: string; id: string }[];
  showSubmitButton?: boolean;
  readOnly?: boolean;
  onChangeLanguage?: (v: 'json' | 'text' | 'javascript') => void;
  afterSubmit?: (v: string) => void;
  lang?: string;
};

export interface CodeEditorWidgetProps extends WidgetProps {
  options: Options;
}

export type CodeEditorWidgetUIOptions = {
  'ui:widget': (props: CodeEditorWidgetProps) => JSX.Element;
  'ui:options': Options;
};

export const CodeEditorWidget = ({ id, label, options = {}, value, required, onChange }: CodeEditorWidgetProps) => {
  const [language, setLanguage] = useState('json');
  const { editorHeight = '200px', editorTheme = tokyoNight, showLanguageSelector = false, showCodeSelector = [], showSubmitButton = false, onChangeLanguage, afterSubmit, readOnly = false, lang = 'json' } = options;

  const handleChange = useCallback(
    (value) => {
      onChange(value === '' ? (options.emptyValue ? options.emptyValue : '') : value);
    },
    [onChange, options.emptyValue]
  );
  return (
    <Box pos="relative">
      <Flex pos="absolute" right={0} top="-32px" zIndex={99} justifyContent="space-between" alignItems="center">
        {showLanguageSelector && (
          <Select
            w="100px"
            h="28px"
            fontSize="12px"
            borderRadius="4px"
            onChange={(v) => {
              const language = v.target.value as 'json' | 'text' | 'javascript';
              setLanguage(language);
              onChangeLanguage && onChangeLanguage(language);
            }}
          >
            <option value="json">JSON</option>
            <option value="text">Text</option>
          </Select>
        )}
        {showCodeSelector.length != 0 && (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} ml="10px" h="30px" fontSize="12px">
              Select Code 
            </MenuButton>
            <MenuList p="8px">
              {showCodeSelector?.map((item) => {
                return (
                  <MenuItem
                    key={item.id}
                    h="20px"
                    fontSize="12px"
                    onClick={(e) => {
                      // store.curCodeLabel.save(item.label);
                      // store.curCodeId.save(item.id);
                      handleChange(item.value);
                    }}
                  >
                    {item.label}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        )}
      </Flex>
      {/* fix readonly issuse > https://github.com/suren-atoyan/monaco-react/issues/114  */}
      <Box border="1px solid #ddd">
        <CodeMirror
          data-testid="code-editor"
          value={readOnly ? (value ? value : '') : value}
          onChange={handleChange}
          theme={editorTheme}
          extensions={[loadLanguage(showLanguageSelector ? language : lang)].filter(isDefined)}
          editable={!readOnly}
          style={{
            width: '100%',
          }}
          width="100%"
          height={editorHeight}
          spellCheck={false}
          basicSetup={{
            highlightActiveLine: false,
          }}
        />
      </Box>
      {showSubmitButton && (
        <Flex mt={2} justifyContent="flex-end">
          <Button
            ml="10px"
            fontWeight={400}
            onClick={() => {
              afterSubmit && afterSubmit(value);
            }}
          >
            Save Changes
          </Button>
        </Flex>
      )}
    </Box>
  );
};