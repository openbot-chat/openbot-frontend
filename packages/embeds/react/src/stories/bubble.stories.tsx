import { Bubble } from '@/Bubble'
import {
  open,
  toggle,
  close,
  showPreviewMessage,
  hidePreviewMessage,
  setPrefilledVariables,
} from '@openbot/js2'
import { useState } from 'react'
import './assets/index.css'

export const Default = () => {
  const [name, setName] = useState('John')

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button onClick={toggle}>Toggle chat window</button>
        <button onClick={open}>Open chat window</button>
        <button onClick={close}>Close chat window</button>
        <button onClick={() => showPreviewMessage()}>
          Show Preview Message
        </button>
        <button onClick={hidePreviewMessage}>Close Preview Message</button>
        <div>
          <p>Predefined name:</p>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={() => setPrefilledVariables({ Name: name })}>
            Set predefined name
          </button>
        </div>
      </div>

      <Bubble
        agent={{
          id: 'a4500975-ffb8-47ce-9494-00514b054146',
          name: 'Tabby',
          avatar: {
            type: '3d',
            thumbnail: 'https://models.readyplayer.me/64678f4d20c126c2e96a645c.png',
            options: {
              modelSrc: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz2022121316709082043216397ff2e9ef842b3a515bd5e.glb',
              poseSrc: ''
            }
          },
          voice: {
            provider: "playht",
            identifier: "s3://mockingbird-prod/3rd_fox_02970d00-b133-4b94-9852-d23c416ce9f4/voices/speaker/manifest.json",
            options: {
              enabled: true
            }
          }
        }}
        showAvatar
        prefilledVariables={{
          Name: '代码超人',
        }}
        previewMessage={{
          avatarUrl: 'https://avatars.githubusercontent.com/u/16015833?v=4',
          message: 'Hello, I am a preview message',
          autoShowDelay: 3000,
        }}
        theme={{
          button: {
            backgroundColor: '#FF7537',
            iconColor: 'white',
            size: 'large',
          },
        }}
      />
    </div>
  )
}
