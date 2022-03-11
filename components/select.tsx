import styles from "../styles/select.module.css";

export interface Option {
    text: string;
    value?: string | number | readonly string[]
}

export interface SelectProps{
    options: Option[] 
}

export function Select({options}: SelectProps){
    return(
        <select className={styles.select}>
            {options.map((option) => <option className={styles.option}>{option.text}</option>)}
        </select>
    )
}