import React from "react"
import { createUseStyles, useTheme } from "react-jss"

import type { Theme } from "./theme"

type Props = Omit<React.ComponentProps<"label">, "className">

const useStyles = createUseStyles<Theme>(theme => ({
    label: {
        color: theme.surfaceText,
        fontSize: "1rem",
        width: "100%",
    },
}))

export function Label(props: Props) {
    const { children, ...rest } = props
    const theme = useTheme()
    const styles = useStyles(theme)
    return (
        <label className={styles.label} {...rest}>
            {children}
        </label>
    )
}
