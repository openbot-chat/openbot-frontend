import React from "react"
import { Agent } from 'src/types'
import ReactPlayer from 'react-player'


type AvatarProps = NonNullable<Agent['avatar']> & {
	options: {
		url: string
	}
}

export const PlayerAvatar: React.FC<AvatarProps> = ({ options }) => {
  return (
    <div style="width:100%;height:100%">
      <ReactPlayer
        className='react-player'
        url={options?.url}
        width='100%'
        height='100%'
        controls={false}
        playing
        config={{
          file: {
            forceHLS: true,
          }
        }}
      />
    </div>
	)
}