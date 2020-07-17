import React from "react"

/**
 * Generators that yields mapped numbers from the [start, end) interval.
 *
 * @param start  The first number whose mapped value should be yielded.
 * @param end  The number where the generator should stop (exclusive).
 * @param mapper  Function that maps the generated number to the desired value.
 */
function* mappedRange<T>(start: number, end: number, mapper: (value: number) => T) {
    for (let i = start; i < end; i++) yield mapper(i)
}

/**
 * Generator that yields all characters from `first` to `last`.
 *
 * @param first  The first character to yield.
 * @param last  The character where the generator should stop.
 * @param inclusive  If `true` (the default), then the generator will yield `last`, otherwise it will not.
 */
function* charRange(first: string, last: string, inclusive = true) {
    yield* mappedRange(first.charCodeAt(0), last.charCodeAt(0) + (inclusive ? 1 : 0), String.fromCharCode)
}

/**
 * Returns a list of characters, depending on the received `options` object.
 *
 * @param options.capital  Whether to add capital characters to the result, `true` by default.
 * @param options.lower  Whether to add lower case characters to the result, `true` by default.
 * @param options.numeric  Whether to add numeric characters to the result, `true` by default.
 */
const getCharacterOptions = (options?: { capital?: boolean; lower?: boolean; numeric?: boolean }) => [
    ...(options?.capital ?? true ? charRange("A", "Z") : []),
    ...(options?.lower ?? true ? charRange("a", "z") : []),
    ...(options?.numeric ?? true ? charRange("0", "9") : []),
]

class MiddleSquareGenerator {
    /**
     * The basic configuration of the generator.
     */
    protected static readonly config = {
        /**
         * Base 2 logarithm of the number of expansion rounds to execute.
         */
        cost: 10,

        /**
         * The offset used to generate a sequence of numbers similar to a Weyl sequence.
         */
        sequenceOffset: 85469,

        /**
         * The modulus for the elements of the `sequenceOffset, 2*sequenceOffset, ...k*sequenceOffset` sequence.
         */
        sequenceMod: 0xffffffff,
    }

    /**
     * The string representation of the generator configuration.
     */
    public static get configuration() {
        const { cost, sequenceOffset, sequenceMod } = MiddleSquareGenerator.config
        return `$MS$${cost}$${sequenceOffset.toString(16)}$${sequenceMod.toString(16)}$`
    }

    protected static middleSquare(x: number, w: number): [number, number] {
        w = (w + MiddleSquareGenerator.config.sequenceOffset) % MiddleSquareGenerator.config.sequenceMod
        x = x * x + w
        const xAsString = x.toString()
        const xLength = xAsString.length
        return [parseInt(xAsString.substr(Math.round(xLength / 4), Math.round(xLength / 2))), w]
    }

    /**
     * Returns an array of pseudo-random numbers that are generated from the given `password` and `key`.
     *
     * @param password  The password to generate the sequence from. The length of the sequence will
     *                  be the same as the length of `password`.
     * @param key  The key to mix `password` with, to generate different sequences for different
     *             `password` - `key` pairs.
     */
    protected static generateSequence(password: string, key: string) {
        let w = 0
        let x = 0
        const keyLength = key.length
        const pwLength = password.length
        const result: number[] = []
        const rounds = Math.pow(2, MiddleSquareGenerator.config.cost)

        for (let r = 0; r < rounds; r++) {
            const isLastRound = r === rounds - 1
            for (let i = 0; i < pwLength; i++) {
                ;[x, w] = MiddleSquareGenerator.middleSquare(
                    x + password.charCodeAt(i) + key.charCodeAt((r * pwLength + i) % keyLength),
                    w,
                )
                if (isLastRound) result.push(x)
            }
        }
        return result
    }

    /**
     * Generates a pseudo-random string using the received arguments.
     *
     * @param password  The password to generate the pseudo-random string from. The length of the generated
     *                  string will be the same as the length of `password`.
     * @param key  The key to mix `password` with, to generate different strings for different
     *             `password` - `key` pairs.
     * @param options.capital  Whether capital characters can be included in the result.
     * @param options.lower    Whether lower-case characters can be included in the result.
     * @param options.numeric  Whether numeric characters can be included in the result.
     */
    static generatePassword(
        password: string,
        key: string,
        options: { capital: boolean; lower: boolean; numeric: boolean },
    ) {
        const chars = getCharacterOptions(options)
        const n = chars.length
        if (password.length === 0 || key.length === 0 || n === 0) return ""

        return MiddleSquareGenerator.generateSequence(password, key)
            .map((i) => chars[i % n])
            .join("")
    }
}

function useInput() {
    const [value, set] = React.useState("")
    return {
        value,
        set,
        onChange: (event: React.FormEvent<HTMLInputElement>) => set(event.currentTarget.value),
    }
}

function useToggle(defaultValue = false) {
    const [value, set] = React.useState(defaultValue)
    return {
        value,
        toggle: () => set(!value),
    }
}

const useToggledInput = () => ({
    text: useInput(),
    toggle: useToggle(),
})

const useAppState = () => ({
    capital: useToggle(true),
    lower: useToggle(true),
    numeric: useToggle(true),
    pw: useToggledInput(),
    key: useToggledInput(),
})

export function App() {
    const { capital, lower, numeric, pw, key } = useAppState()
    return (
        <div style={{ display: "grid", columnGap: "1rem", rowGap: "1rem", gridTemplateColumns: "min-content 50rem" }}>
            <div style={{ gridColumn: 1, gridRow: 1 }}>
                <input id="capitalLetters" type="checkbox" checked={capital.value} onChange={capital.toggle} />
                <label htmlFor="capitalLetters">Capital letters</label>
            </div>
            <div style={{ gridColumn: 1, gridRow: 2 }}>
                <input id="lowercaseLetters" type="checkbox" checked={lower.value} onChange={lower.toggle} />
                <label htmlFor="lowercaseLetters">Lowercase letters</label>
            </div>
            <div style={{ gridColumn: 1, gridRow: 3 }}>
                <input id="numericChars" type="checkbox" checked={numeric.value} onChange={numeric.toggle} />
                <label htmlFor="numericChars">Numeric characters</label>
            </div>

            <div style={{ gridColumn: 2, gridRow: 1 }}>
                <input
                    value={pw.text.value}
                    onChange={pw.text.onChange}
                    placeholder="Password"
                    type={pw.toggle.value ? undefined : "password"}
                />
                <input type="checkbox" tabIndex={-1} checked={pw.toggle.value} onChange={pw.toggle.toggle} />
            </div>
            <div style={{ gridColumn: 2, gridRow: 2 }}>
                <input
                    value={key.text.value}
                    onChange={key.text.onChange}
                    placeholder="Key"
                    type={key.toggle.value ? undefined : "password"}
                />
                <input type="checkbox" tabIndex={-1} checked={key.toggle.value} onChange={key.toggle.toggle} />
            </div>
            <div style={{ gridColumn: 2, gridRow: 3 }}>
                <label>
                    {MiddleSquareGenerator.generatePassword(pw.text.value, key.text.value, {
                        capital: capital.value,
                        lower: lower.value,
                        numeric: numeric.value,
                    })}
                </label>
            </div>
        </div>
    )
}
