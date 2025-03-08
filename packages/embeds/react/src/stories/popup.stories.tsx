import { Popup } from '../Popup'
import { open, toggle } from '@openbot/js2'

export const Default = () => {
  return (
    <>
      <button onClick={open}>Open modal</button>
      <button onClick={toggle}>Toggle modal</button>
      <Popup
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
        autoShowDelay={3000}
      />
    </>
  )
}
