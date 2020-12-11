import React from "react"

import type { GeneratorOptions } from "./generator"
import { MiddleSquareGenerator } from "./generator"
import { Grid } from "./Grid"
import { useToggle, useObscuredText } from "./hooks"
import { LabeledCheckbox } from "./LabeledCheckbox"
import { ObscuredTextInput } from "./ObscuredTextInput"
import { parseOptionsFromURL } from "./utils"

const useAppState = (defaultOptions: GeneratorOptions | undefined) => ({
    generator: React.useMemo(() => new MiddleSquareGenerator(), []),
    capital: useToggle(defaultOptions?.capital ?? false),
    lower: useToggle(defaultOptions?.lower ?? true),
    numeric: useToggle(defaultOptions?.numeric ?? true),
    pw: useObscuredText(),
    key: useObscuredText(),
})

export function App() {
    const defaultOptions = React.useMemo(() => parseOptionsFromURL(), [])
    const { generator, capital, lower, numeric, pw, key } = useAppState(defaultOptions)

    return (
        <Grid
            style={{
                gridTemplateColumns: "max-content max-content",
                placeContent: "center",
            }}
        >
            <Grid.Item column={1} row={1}>
                <LabeledCheckbox
                    id="capitalLetters"
                    label="Capital letters"
                    checked={capital.value}
                    onChange={capital.toggle}
                />
            </Grid.Item>
            <Grid.Item column={1} row={2}>
                <LabeledCheckbox
                    id="lowercaseLetters"
                    label="Lowercase letters"
                    checked={lower.value}
                    onChange={lower.toggle}
                />
            </Grid.Item>
            <Grid.Item column={1} row={3}>
                <LabeledCheckbox
                    id="numericChars"
                    label="Numeric characters"
                    checked={numeric.value}
                    onChange={numeric.toggle}
                />
            </Grid.Item>

            <Grid.Item column={2} row={1}>
                <ObscuredTextInput
                    obscured={pw.obscured.value}
                    placeholder="Password"
                    value={pw.text.value}
                    onChange={pw.text.onChange}
                    toggleObscured={pw.obscured.toggle}
                />
            </Grid.Item>
            <Grid.Item column={2} row={2}>
                <ObscuredTextInput
                    obscured={key.obscured.value}
                    placeholder="Key"
                    value={key.text.value}
                    onChange={key.text.onChange}
                    toggleObscured={key.obscured.toggle}
                />
            </Grid.Item>
            <Grid.Item column={2} row={3}>
                <label>
                    {generator.generatePassword(pw.text.value, key.text.value, {
                        capital: capital.value,
                        lower: lower.value,
                        numeric: numeric.value,
                    })}
                </label>
            </Grid.Item>
        </Grid>
    )
}
