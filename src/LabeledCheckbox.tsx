import React from "react"

import { Label } from "./Label"

type Props = {
    checked: boolean
    id: string
    label: string
    onChange: () => void
}

export function LabeledCheckbox(props: Props) {
    const { checked, id, label, onChange } = props
    return (
        <>
            <input id={id} type="checkbox" checked={checked} onChange={onChange} />
            <Label htmlFor={id}>{label}</Label>
        </>
    )
}
