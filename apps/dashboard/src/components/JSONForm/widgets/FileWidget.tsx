import { useCallback, useMemo, useEffect, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { CircularProgressLabel, CircularProgress, Flex, Box, Text, Stack, FlexProps, Icon, Button, Image } from '@chakra-ui/react';
import { dataURItoBlob, WidgetProps } from '@rjsf/utils';
import { FiUploadCloud } from 'react-icons/fi';
import { DownloadIcon } from '@chakra-ui/icons';
import { useS3Upload } from '@openbot/next-upload';
import { IFramelyViewer } from '../../IFramelyViewer';


function addNameToDataURL(dataURL: string, name: string) {
  if (dataURL === null) {
    return null;
  }
  return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
}

type FileInfoType = {
  url?: string;
  dataURL?: string;
  result?: string;
  name: string;
  size: number;
  type: string;
};

function processFile(file: File, resultType: 'dataURL' | 'JSON'): Promise<FileInfoType> {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve({
          name,
          size,
          type,
          result: resultType === 'JSON' ? result : null,
          dataURL: resultType === 'dataURL' ? addNameToDataURL(result, name) : null
        });
      } else {
        resolve({
          name,
          size,
          type
        });
      }
    };
    if (resultType === 'dataURL') {
      reader.readAsDataURL(file);
    }
    if (resultType === 'JSON') {
      reader.readAsText(file, 'UTF-8');
    }
  });
}

function processFiles(files: File[], resultType: 'dataURL' | 'JSON'): Promise<FileInfoType[]> {
  return Promise.all(Array.from(files).map((file: File) => processFile(file, resultType)));
}

function FilesInfo({ filesInfo, mode }: { filesInfo: { url?: string; name: string; size: number; type: string; }[]; mode: string; }) {
  if (filesInfo.length === 0) {
    return null;
  }

  return (
    <Stack>
      {filesInfo.map((fileInfo, key) => {
        const { url, name, size, type } = fileInfo;
        
        let filename;
        if (url) {
          const parts = url.split('/');
          filename = parts[parts.length - 1];
        }

        return (
          <Stack key={key} spacing={2}>
            <Box>
              {name ? (
                <>
                  <strong>{name}</strong> ({type}, {size} bytes)
                </>
              ) : (
                url && <a href={url} target="_blank">{filename}</a>
              )}
            </Box>
            {mode === 'smart' && url && <Box w="240px" position="relative"><IFramelyViewer url={url} /></Box>}
          </Stack>
        );
      })}
    </Stack>
  );
}

function extractFileInfo(dataURLs: string[]) {
  const res = dataURLs
    .filter((dataURL) => typeof dataURL !== 'undefined')
    .map((dataURL) => {
      const { blob, name } = dataURItoBlob(dataURL);
      return {
        name: name,
        size: blob.size,
        type: blob.type
      };
    });
  return res;
}

type Options = {
  accept?: Accept // https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
  maxFiles?: number // Maximum accepted number of files The default value is 0 which means there is no limitation to how many files are accepted.
  maxSize?: number
  multiple?: boolean // Allow drag 'n' drop (or selection from the file dialog) of multiple files
  tips?: string
  flexProps?: FlexProps
  showDownload?: boolean
  mode?: 'general' | 'image' | 'smart'
  resultType?: 'dataURL' | 'JSON' | 'fileinfo' | 'url'
};

export interface FileWidgetProps extends WidgetProps {
  options: Options;
}

export type FileWidgetUIOptions = {
  'ui:widget': (props: FileWidgetProps) => JSX.Element;
  'ui:options': Options;
}


export const FileWidget: React.FC<FileWidgetProps> = ({
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
    mode = 'general', 
    resultType = 'url', 
    accept, 
    maxFiles = 0, 
    maxSize,
    multiple = false, 
    tips = '', 
    flexProps = {}, 
    showDownload = false, 
  } = options;

  const [filesInfo, setFilesInfo] = useState<FileInfoType[]>([]);
  const { uploadToS3, files, resetFiles } = useS3Upload();
  const [loading, setLoading] = useState(false);

  const progress = useMemo(() => {
    if (!files || files.length === 0) return 0;
    const lastFile = files[files.length - 1];

    if (lastFile.size === 0) return 0;

    return Math.ceil(lastFile.uploaded * 100 / lastFile.size);
  }, [files]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) {
        return;
      }

      const file = acceptedFiles[0];
      if (!!maxSize && file.size > maxSize) {
        alert(`file size must be less than ${maxSize}`);
        return;
      }

      if (resultType === 'url' || resultType === 'fileinfo') {
        setLoading(true);
        console.log('drop: ', file.name, file.type);

        uploadToS3(file)
          .then(({ url }) => {
            const fileInfo = {
              url,
              name: file.name,
              size: file.size,
              type: file.type,
            };

            setFilesInfo([fileInfo]);

            if (resultType === 'url') {
              onChange?.(url);
            } else if (resultType === 'fileinfo') {
              onChange?.(fileInfo);
            }
          })
          .finally(() => {
            setLoading(false);
            resetFiles();
          });
      } else if (resultType === 'dataURL' || resultType === 'JSON') {
        processFiles(acceptedFiles, resultType).then((filesInfoEvent) => {
          const newValue = filesInfoEvent.map((fileInfo) => {
            if (resultType === 'dataURL') {
              setFilesInfo(filesInfoEvent);
              return fileInfo.dataURL;
            } else {
              return fileInfo.result;
            }
          });

          if (multiple) {
            onChange?.(newValue);
          } else {
            onChange?.(newValue[0]);
          }
        });

        resetFiles();
      }
    },
    [multiple, onChange, maxSize, resetFiles, resultType, uploadToS3]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles,
    multiple,
    accept: accept ? accept : undefined,
    disabled: resultType === 'JSON' && value
  });

  useEffect(() => {
    if (!value) {
      setFilesInfo([]);
      resetFiles();
      return;
    }

    if (resultType === 'dataURL') {
      Array.isArray(value) ? setFilesInfo(extractFileInfo(value)) : setFilesInfo(extractFileInfo([value]));
    } else if (resultType === 'url') {
      const newFilesInfo = Array.isArray(value) ? value.map(it => { it }) : [{ url: value }];
      setFilesInfo((prevState) => 
        newFilesInfo.map(it => {
          const old = prevState.find(it1 => it1.url = it.url);
          return { ...old, ...it };
        })
      );
    }
  }, [value]);

  return (
    <Flex flexDir="column" alignItems="center">
      <Flex
        w="100%"
        h="100px"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        border="1px solid #eee"
        mb="20px"
        p={2}
        cursor="pointer"
        {...getRootProps({ className: 'dropzone' })}
        {...flexProps}
      >
        <input id={id} name={id} autoFocus={autofocus} {...getInputProps()} disabled={loading} />
        {loading ? (
          <CircularProgress isIndeterminate value={progress} color='green.400'>
            <CircularProgressLabel>{progress}%</CircularProgressLabel>
          </CircularProgress>
        ) : mode !== 'image' ? (
          <>
            <Icon mb="5px" boxSize={6} as={FiUploadCloud} color="#aaa" />
            <Text fontSize="14px" color="#aaa">
              {tips}
            </Text>
          </>
        ) : (
          <>
            {tips && !value && (
              <>
                <Icon mb="5px" boxSize={6} as={FiUploadCloud} color="#aaa" />
                <Text fontSize="14px" color="#aaa">
                  {tips}
                </Text>
              </>
            )}
            {mode === 'image' && value && <Image h="100%" src={value} alt="" />}
          </>
        )}
      </Flex>
      <FilesInfo filesInfo={filesInfo} mode={mode} />

      {showDownload && (
        <Button
          mt={2}
          size="md"
          rightIcon={<DownloadIcon />}
          onClick={() => {
            if (value) {
              const link = document.createElement('a');
              if (Array.isArray(value)) {
                value.forEach((dataURL) => {
                  const { blob, name } = dataURItoBlob(dataURL);
                  link.href = window.URL.createObjectURL(blob);
                  link.download = name;
                  link.click();
                });
              } else {
                const { blob, name } = dataURItoBlob(value);
                link.href = window.URL.createObjectURL(blob);
                link.download = name;
                link.click();
              }
            }
          }}
        >
          Download File
        </Button>
      )}
  </Flex>
  );
}

