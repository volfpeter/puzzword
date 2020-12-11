import React, { ReactNodeArray } from "react"

const gridStyle: React.CSSProperties = {
    display: "grid",
    columnGap: "1rem",
    rowGap: "1rem",
}

type GridItemProps = {
    children: React.ReactNode | ReactNodeArray

    column: React.CSSProperties["gridColumn"]
    row: React.CSSProperties["gridRow"]
    style?: Omit<React.CSSProperties, "gridColumn" | "gridRow">
}

function GridItem(props: GridItemProps) {
    const { style: propStyle = {}, column, row, children } = props
    const style = React.useMemo(
        () => ({
            propStyle,
            gridColumn: column,
            gridRow: row,
        }),
        [propStyle, column, row],
    )
    return <div style={style}>{children}</div>
}

type GridProps = {
    children: React.ReactNode | React.ReactNodeArray
    style: React.CSSProperties
}

function GridImpl(props: GridProps) {
    const style = React.useMemo(
        () => ({
            ...gridStyle,
            ...props.style,
        }),
        [props.style],
    )

    return <div style={style}>{props.children}</div>
}

GridImpl["Item"] = GridItem

export const Grid: React.FunctionComponent<GridProps> & {
    Item: React.FunctionComponent<GridItemProps>
} = GridImpl
