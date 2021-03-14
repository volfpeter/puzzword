import React, { useMemo } from "react"
import { ThemeProvider } from "react-jss"

import type { GeneratorOptions } from "./generator"
import { MiddleSquareGenerator } from "./generator"
import { Grid } from "./Grid"
import { useColorScheme, useObscuredText, useToggle } from "./hooks"
import { LabeledCheckbox } from "./LabeledCheckbox"
import { ObscuredTextField } from "./ObscuredTextField"
import { TextField } from "./TextField"
import { darkTheme, lightTheme } from "./theme"
import { parseOptionsFromURL } from "./utils"

function useAppState(defaultOptions: GeneratorOptions | undefined) {
    const colorScheme = useColorScheme()

    return {
        generator: useMemo(() => new MiddleSquareGenerator(), []),
        capital: useToggle(defaultOptions?.capital ?? false),
        lower: useToggle(defaultOptions?.lower ?? true),
        numeric: useToggle(defaultOptions?.numeric ?? true),
        pw: useObscuredText(),
        key: useObscuredText(),
        resultHidden: useToggle(true),
        theme: useMemo(
            () => ({
                value: colorScheme.value === "dark" ? darkTheme : lightTheme,
                colorScheme: colorScheme.value,
                setColorScheme: colorScheme.set,
            }),
            [colorScheme.value, colorScheme.set],
        ),
    }
}

export function App() {
    const defaultOptions = useMemo(() => parseOptionsFromURL(), [])
    const { generator, capital, lower, numeric, pw, key, resultHidden, theme } = useAppState(defaultOptions)

    return (
        <ThemeProvider theme={theme.value}>
            <Grid
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    backgroundColor: theme.value.surface,
                    gridTemplateColumns: "max-content max-content",
                    placeContent: "start center",
                }}
            >
                <Grid.Cell column={1} row={1}>
                    <LabeledCheckbox
                        id="capitalLetters"
                        label="Capital letters"
                        checked={capital.value}
                        onChange={capital.toggle}
                    />
                </Grid.Cell>
                <Grid.Cell column={1} row={2}>
                    <LabeledCheckbox
                        id="lowercaseLetters"
                        label="Lowercase letters"
                        checked={lower.value}
                        onChange={lower.toggle}
                    />
                </Grid.Cell>
                <Grid.Cell column={1} row={3}>
                    <LabeledCheckbox
                        id="numericChars"
                        label="Numeric characters"
                        checked={numeric.value}
                        onChange={numeric.toggle}
                    />
                </Grid.Cell>

                <Grid.Cell column={2} row={1}>
                    <ObscuredTextField
                        obscured={pw.obscured.value}
                        placeholder="Password"
                        value={pw.text.value}
                        onChange={pw.text.onChange}
                        toggleObscured={pw.obscured.toggle}
                    />
                </Grid.Cell>
                <Grid.Cell column={2} row={2}>
                    <ObscuredTextField
                        obscured={key.obscured.value}
                        placeholder="Key"
                        value={key.text.value}
                        onChange={key.text.onChange}
                        toggleObscured={key.obscured.toggle}
                    />
                </Grid.Cell>
                <Grid.Cell column={2} row={3}>
                    <TextField
                        disabled
                        placeholder="Generated password"
                        value={generator.generatePassword(pw.text.value, key.text.value, {
                            capital: capital.value,
                            lower: lower.value,
                            numeric: numeric.value,
                        })}
                        obscured={resultHidden.value}
                        onMouseOut={resultHidden.set}
                        onMouseOver={resultHidden.unset}
                    />
                </Grid.Cell>
            </Grid>
        </ThemeProvider>
    )
}
