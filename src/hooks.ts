import React from "react"

export function useColorScheme() {
    const [colorScheme, setColorScheme] = React.useState<"dark" | "light">("dark")

    React.useEffect(() => {
        const mediaQueryList = window.matchMedia("(prefers-color-scheme: light)")
        // Don't add event listener to mediaQuery, it's enough to set the correct default.
        setColorScheme(mediaQueryList.matches ? "light" : "dark")
    }, [setColorScheme])

    return { value: colorScheme, set: setColorScheme }
}

export function useText() {
    const [value, set] = React.useState("")
    return {
        value,
        set,
        onChange: React.useCallback((event: React.FormEvent<HTMLInputElement>) => set(event.currentTarget.value), [
            set,
        ]),
    }
}

export function useToggle(defaultValue = false) {
    const [value, set] = React.useState(defaultValue)
    return {
        value,
        toggle: React.useCallback(() => set(!value), [set, value]),
        set: React.useCallback(() => set(true), [set]),
        unset: React.useCallback(() => set(false), [set]),
    }
}

export const useObscuredText = () => ({
    text: useText(),
    obscured: useToggle(true),
})
