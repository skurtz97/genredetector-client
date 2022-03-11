import styles from "../styles/input.module.css"


export interface InputProps {
    width?: string
}
export function Input({width}: InputProps) {
    return(
        <input className={styles.input} style={{width: width}} type="text" placeholder="This is some text"/>
    )
}