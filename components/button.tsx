import styles from "../styles/button.module.css"

export interface ButtonProps {
    text: string
}

export function Button({text}:ButtonProps){
    return(
        <button type="button" className={styles.button}>{text}</button>
    )
}