import React from "react"
import { createUseStyles } from "react-jss"

type Props = {
    obscured: boolean
    placeholder: string
    value: string
    onChange: (event: React.FormEvent<HTMLInputElement>) => void
    toggleObscured: () => void
}

const useStyles = createUseStyles({
    textInput: {
        background: "rgba(255, 255, 255, 0.1)",
        borderStyle: "none none solid none",
        borderWidth: "2px",
        borderColor: "#cccccc",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color .5s",
        "&:focus": {
            borderColor: "#0011dd",
        },
    },
})

export function ObscuredTextInput(props: Props) {
    const { obscured, onChange, placeholder, toggleObscured, value } = props
    const styles = useStyles()

    return (
        <>
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={obscured ? "password" : undefined}
                size={50}
                className={styles.textInput}
            />
            <input type="checkbox" tabIndex={-1} checked={obscured} onChange={toggleObscured} />
        </>
    )
}
