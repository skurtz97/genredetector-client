import { ReactNode } from "react"

export interface ContainerProps {
    children?: ReactNode
}

export function Container({children}: ContainerProps) {
    return(
        <div>
            {children}
        </div>
    )
}