import styles from "../styles/header.module.css";

export function Header() {
    return (
        <header className={styles.header}>
            <h1>Genre Detector</h1>
            <p>This is a test</p>
            <p>Please like and subscribe to friends to the end</p>
        </header>
    )
}