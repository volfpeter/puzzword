import React from "react"
import { createUseStyles, useTheme } from "react-jss"

import type { Theme } from "./theme"

type Props = {
    disabled?: boolean
    obscured?: boolean
    placeholder?: string
    value: string
    onChange?: (event: React.FormEvent<HTMLInputElement>) => void
    onMouseOut?: React.MouseEventHandler
    onMouseOver?: React.MouseEventHandler
}

const useStyles = createUseStyles<Theme>(theme => ({
    textField: {
        background: `${theme.surface}25`,
        borderColor: `${theme.surfaceText}aa`,
        borderStyle: "none none solid none",
        borderWidth: "2px",
        color: theme.surfaceText,
        fontSize: "1rem",
        outline: "none",
        transition: ".5s",
        "&:focus": {
            background: `${theme.surface}0b`,
            borderColor: `${theme.primary}aa`,
        },
    },
}))

export function TextField(props: Props) {
    const { disabled, obscured, onChange, onMouseOut, onMouseOver, placeholder, value } = props
    const theme = useTheme()
    const styles = useStyles(theme)

    return (
        <input
            value={value}
            placeholder={placeholder}
            className={styles.textField}
            disabled={disabled}
            size={50}
            type={obscured ? "password" : undefined}
            onChange={onChange}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
        />
    )
}
