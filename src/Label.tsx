import React from "react"
import { createUseStyles } from "react-jss"

type Props = Omit<React.ComponentProps<"label">, "className">

const useStyles = createUseStyles({
    label: {
        fontSize: "1rem",
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
