import React, { CSSProperties, useMemo } from "react"
import { Avatar } from '@readyplayerme/visage'
import { Agent } from 'src/types'
import { useAgent } from "../../context/AgentContext"

type AvatarProps = NonNullable<Agent['avatar']> & {
	options: {
		modelSrc: string
		poseSrc?: string
		animationSrc?: string
		animations?: {
      idle?: string
      talking?: string
      show?: string
    }
    cameraTarget?: number
		cameraInitialDistance?: number
		scale?: number
		style?: CSSProperties
		emotion?: {
			browInnerUp?: number
			browOuterUpLeft?: number
			eyeSquintLeft?: number
			eyeSquintRight?: number
			mouthShrugUpper?: number
			mouthSmileLeft?: number
			mouthSmileRight?: number
		}
	}
}

export const ThreeDAvatar: React.FC<AvatarProps> = ({ options }) => {
  const { state } = useAgent()
  const animationSrc = useMemo(() => (options.animations ?? {})[state ?? 'idle'], [options.animations, state])

  return (
		<Avatar
			modelSrc={`${options.modelSrc}?quality=low`}
			poseSrc={options.poseSrc}
			animationSrc={animationSrc}
			cameraTarget={options.cameraTarget ?? 1.65}
			cameraInitialDistance={options.cameraInitialDistance ?? 2.5}
			scale={options.scale ?? 1}
			halfBody={false}
			style={options.style ?? {
				background: 'transparent',
				height: '100%',
			}}
			emotion={{
				browInnerUp: options.emotion?.browInnerUp ?? 0.3,
				browOuterUpLeft: options.emotion?.browOuterUpLeft ?? 0.37,
				eyeSquintLeft: options.emotion?.eyeSquintLeft ?? 0.4,
				eyeSquintRight: options.emotion?.eyeSquintRight ?? 0.2,
				mouthShrugUpper: options.emotion?.mouthShrugUpper ?? 0.27,
				mouthSmileLeft: options.emotion?.mouthSmileLeft ?? 0.37,
				mouthSmileRight: options.emotion?.mouthSmileRight ?? 0.36,
			}}
		/>
	)
}