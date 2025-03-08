import React from "react"

type Props = {
  error: Error
}

export const ErrorMessage: React.FC<Props> = (props) => {
  return (
    <div className="h-full flex justify-center items-center flex-col">
      <p className="text-2xl text-center">{props.error.message}</p>
      <p className="text-center">{props.error.cause as any as string}</p>
    </div>
  )
}
