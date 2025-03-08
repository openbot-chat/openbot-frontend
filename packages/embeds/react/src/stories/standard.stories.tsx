import { useCallback, useState } from 'react'
import { Standard } from '..'
import { BotProps } from '@openbot/js2'

export const Default = () => {
  return (
    // https://cdn.mindverse.com/files/zzzz202210221666432453131idle.fbx
    // https://cdn.mindverse.com/files/zzzz202210221666432453130talking1.fbx
    // https://cdn.mindverse.com/files/zzzz202210221666432453120show1.fbx
    <div style={{ height: '100%' }}>
      <Standard
        agent='d455ba15-6c86-47aa-a75c-403e546ca84f'
        showAvatar
        isPreview
      />
    </div>
  )
}

export const StartWhenIntoView = () => {
  return (
    <>
      <div style={{ height: '300vh' }} />
      <Standard
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
      />
    </>
  )
}


const botProps: BotProps[] = [
  {
    agent: {
      id: 'a4500975-ffb8-47ce-9494-00514b054146',
      name: 'Tabby',
      avatar: {
        type: '3d',
        thumbnail: 'https://models.readyplayer.me/64678f4d20c126c2e96a645c.png',
        options: {
          modelSrc: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210191666162703642634e8b89bf54f0deb32415e1.glb',
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
    },
    showAvatar: true
  },
  {
    agent: {
      id: '80d2d3c2-1c2d-43e0-9f35-bc3871b64c2a',
      name: '代码超人',
      avatar: {
        type: '3d',
        thumbnail: 'https://cdn.mindverse.com/img/zzzz202211011667292947574QwZZob3FZ.png?imageMogr2/thumbnail/312x312',
        options: {
          modelSrc: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz2022121316709082043216397ff2e9ef842b3a515bd5e.glb',
          poseSrc: ''
        }
      },
      voice: {
        provider: "azure",
        identifier: "zh-CN-XiaoyouNeural",
        options: {
          enabled: true
        }
      }
    },
    showAvatar: true
  },
  {
    agent: {
      id: '80d2d3c2-1c2d-43e0-9f35-bc3871b64c2a',
      name: '代码超人',
      avatar: {
        type: '3d',
        thumbnail: 'https://models.readyplayer.me/64678f4d20c126c2e96a645c.png',
        options: {
          modelSrc: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210191666162703642634e8b89bf54f0deb32415e1.glb',
          poseSrc: ''
        }
      },
      voice: {
        provider: "azure",
        identifier: "zh-CN-XiaoyouNeural",
        options: {
          enabled: false
        }
      }
    },
    showAvatar: true
  },
  {
    agent: {
      id: 'a4500975-ffb8-47ce-9494-00514b054146',
      name: 'Tabby',
      avatar: {
        type: '3d',
        thumbnail: 'https://cdn.mindverse.com/img/zzzz202211011667292947574QwZZob3FZ.png?imageMogr2/thumbnail/312x312',
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
    },
    showAvatar: false
  },
]

export const SwitchAgent = () => {
  const [props, setProps] = useState<BotProps>(botProps[0])
  const [key, setKey] = useState(0)

  const switchAgent = useCallback(() => {
    setKey(key + 1)
    setProps(botProps[(key + 1) % 4])
  }, [key])

  return (
    <>
      <button onClick={switchAgent}>Switch Agent</button>
      <div style={{ height: '800px' }}>
        <Standard {...props} />
      </div>
    </>
  )

}