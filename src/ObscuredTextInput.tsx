import React from "react"

type Props = {
    obscured: boolean
    placeholder: string
    value: string
    onChange: (event: React.FormEvent<HTMLInputElement>) => void
    toggleObscured: () => void
}

export function ObscuredTextInput(props: Props) {
    const { obscured, onChange, placeholder, toggleObscured, value } = props
    return (
        <>
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={obscured ? "password" : undefined}
                size={50}
            />
            <input type="checkbox" tabIndex={-1} checked={obscured} onChange={toggleObscured} />
        </>
    )
}
