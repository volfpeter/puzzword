import React from "react"
import { createUseStyles } from "react-jss"

import { theme } from "./theme"

type Props = Omit<React.ComponentProps<"label">, "className">

const useStyles = createUseStyles({
    label: {
        color: theme.surfaceText,
        fontSize: "1rem",
        width: "100%",
    },
})

export function Label(props: Props) {
    const { children, ...rest } = props
    const styles = useStyles()
    return (
        <label className={styles.label} {...rest}>
            {children}
        </label>
    )
}
