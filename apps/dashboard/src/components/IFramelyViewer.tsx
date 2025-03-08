import { Tooltip } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { Loading } from './Loading'

function isValidUrl (url: string) {
  return !!url && (url.startsWith('http://') || url.startsWith('https://'))
}

type Props = {
  url: string
}

export const IFramelyViewer = ({
  url,
}: Props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [html, setHtml] = useState({
    __html: '<div />',
  });

  console.log('NEXT_PUBLIC_IFRAMELY_KEY: ', process.env.NEXT_PUBLIC_IFRAMELY_KEY)

  useEffect(() => {
    if (url && isValidUrl(url)) {
      setError(null);

      fetch(
        `https://cdn.iframe.ly/api/iframely?url=${encodeURIComponent(url)}&api_key=${process.env.NEXT_PUBLIC_IFRAMELY_KEY}&iframe=1&omit_script=1`
      )
        .then((res) => res.json())
        .then(
          (res) => {
            setIsLoaded(true);
            if (res.html) {
              setHtml({ __html: res.html });
            } else if (res.error) {
              setError({ code: res.error, message: res.message });
            }
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    } else {
      setError({ code: 400, message: 'Provide url attribute for the element' });
    }
  }, [url]);

  useEffect(() => {
    window.iframely && window.iframely.load();
  });

  if (error) {
    return (
      <div>
        <Tooltip label={`Error: ${error.code} - ${error.message}`} hasArrow placement='top-start'>
          No Preview
        </Tooltip>
      </div>
    );
  } else if (!isLoaded) {
    return <Loading />;
  } else {
    return <div dangerouslySetInnerHTML={html} />;
  }
}
