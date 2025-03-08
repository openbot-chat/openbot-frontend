## Install

```bash
npm install @openbot/js2 @openbot/react
```

## Standard

```tsx
import { Standard } from '@openbot/react'

const App = () => {
  return (
    <Standard
      agent={{
        id: 'agent id',
        options: {
          avatar: {
            type: '3d',
            options: {
              modelSrc: 'https://your_model_url'
            }
          }
        }
      }}
      showAvatar
      style={{ width: '100%', height: '600px' }}
    />
  )
}
```

This code is creating a container with a 100% width (will match parent width) and 600px height.

## Popup

```tsx
import { Popup } from '@openbot/react'

const App = () => {
  return (
    <Popup 
      agent={{
        id: 'agent id',
        options: {
          avatar: {
            type: '3d',
            options: {
              modelSrc: 'https://your_model_url'
            }
          }
        }
      }}
      showAvatar
      autoShowDelay={3000}
    />
  )
}
```

This code will automatically trigger the popup window after 3 seconds.

### Open or Close a popup

You can use these commands:

```js
import {
    open
} from '@openbot/react'

open()
```

```js
import {
    close
} from '@openbot/react'

close()
```

```js
import {
    toggle
} from '@openbot/react'

toggle()
```

## Bubble

```tsx
import { Bubble } from '@openbot/react'

const App = () => {
  return (
    <Bubble
      agent={{
        id: 'agent id',
        options: {
          avatar: {
            type: '3d',
            options: {
              modelSrc: 'https://your_model_url'
            }
          }
        }
      }}
      showAvatar
      previewMessage={{
        message: 'I have a question for you!',
        autoShowDelay: 5000,
        avatarUrl: 'https://avatars.githubusercontent.com/u/16015833?v=4',
      }}
      theme={{
        button: { backgroundColor: '#0042DA', iconColor: '#FFFFFF' },
        previewMessage: { backgroundColor: '#ffffff', textColor: 'black' },
      }}
    />
  )
}
```

This code will show the bubble and let a preview message appear after 5 seconds.

### Open or close the preview message

You can use these commands:

```js
import {
    showPreviewMessage
} from '@openbot/react'

Openbot.showPreviewMessage()
```

```js
import {
    hidePreviewMessage
} from '@openbot/react'

Openbot.hidePreviewMessage()
```

### Open or close the chat window

You can use these commands:

```js
import {
    open
} from '@openbot/react'

open()
```

```js
import {
    close
} from '@openbot/react'

close()
```

```js
import {
    toggle
} from '@openbot/react'

toggle()
```
