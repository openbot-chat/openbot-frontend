import React from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { Agent } from 'src/types'
import { PlayerAvatar } from './PlayerAvatar'
import { ThreeDAvatar } from './ThreeDAvatar'

type AvatarProps = NonNullable<Agent['avatar']>

export const Avatar: React.FC<AvatarProps> = withErrorBoundary((props) => {
	if (props.type === '3d') {
		// @ts-ignore 这里因为 @types/react 版本不同会有编译错误，直接忽略
		return <ThreeDAvatar {...props} />
	} else if (props.type === 'video') {
    // @ts-ignore 这里因为 @types/react 版本不同会有编译错误，直接忽略
    return <PlayerAvatar {...props} />
  }
	return <></>

}, { fallback: <></> })
