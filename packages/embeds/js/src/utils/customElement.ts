import {
	register,
	ComponentType as WebComponentType,
	ComponentOptions,
	PropsDefinitionInput
} from 'component-register'
import { ComponentType as ReactComponentType, createElement } from 'react'
import { createRoot } from 'react-dom/client'

function withReact<T extends object>(ComponentType: ReactComponentType<T>): WebComponentType<T> {
	return (rawProps: T, { element }: ComponentOptions) => {
		const props = rawProps as any
		const root = createRoot(element.renderRoot as any)
		root.render(createElement(ComponentType, props))

		element.addReleaseCallback(() => setTimeout(() => root.unmount()))
		element.addPropertyChangedCallback((name: string, value: any) => {
			props[name] = value
			setTimeout(() => {
				// 这里重新 render，会将更新后的 props 丢进去
				root.render(createElement(ComponentType, props))
			})
		})
	}
}

export function customElement<T extends object>(
	tag: string,
	props: PropsDefinitionInput<T>,
	ComponentType: ReactComponentType<T>
): any {
	return register<T>(tag, props as PropsDefinitionInput<T>)(withReact(ComponentType));
}