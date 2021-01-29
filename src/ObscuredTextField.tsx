import React from "react"

import { TextField } from "./TextField"

type Props = {
    obscured: boolean
    placeholder: string
    value: string
    onChange: (event: React.FormEvent<HTMLInputElement>) => void
    toggleObscured: () => void
}

export function ObscuredTextField(props: Props) {
    const { obscured, onChange, placeholder, toggleObscured, value } = props

    return (
        <>
            <TextField value={value} obscured={obscured} placeholder={placeholder} onChange={onChange} />
            <input type="checkbox" tabIndex={-1} checked={!obscured} onChange={toggleObscured} />
        </>
    )
}
