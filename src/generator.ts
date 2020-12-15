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

export type GeneratorOptions = { capital: boolean; lower: boolean; numeric: boolean }

export class MiddleSquareGenerator {
    /**
     * The basic configuration of the generator.
     */
    protected readonly config = {
        /**
         * Base 2 logarithm of the number of expansion rounds to execute.
         */
        cost: 10,

        /**
         * Base 2 logarithm of the number of expansion rounds to execute on the key.
         */
        keyCost: 6,

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
    public get configuration() {
        const { cost, keyCost, sequenceOffset, sequenceMod } = this.config
        return `$MS$${keyCost.toString(16)}$${cost}$${sequenceOffset.toString(16)}$${sequenceMod.toString(16)}$`
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
    generatePassword = (password: string, key: string, options: GeneratorOptions) => {
        const chars = getCharacterOptions(options)
        if (password.length === 0 || key.length === 0 || chars.length === 0) return ""

        const hashedKey = this.hash(key, password, chars, this.config.keyCost)
        return this.hash(password, hashedKey, chars, this.config.cost)
    }

    /**
     * Hashes the given password and key combination.
     *
     * @param password  The password to generate the pseudo-random string from. The length of the generated
     *                  string will be the same as the length of `password`.
     * @param key  The key to mix `password` with, to generate different strings for different
     *             `password` - `key` pairs.
     * @param chars  The array of strings (typically single characters) the result is allowed to contain.
     * @param cost  Base 2 logarithm of the number of expansion rounds to execute.
     */
    hash(password: string, key: string, chars: string[], cost: number) {
        const numChars = chars.length
        if (password.length === 0 || key.length === 0 || numChars === 0) return ""

        const sequence = this.generateSequence(password, key, cost)
        return sequence.map(i => chars[i % numChars]).join("")
    }

    /**
     * Returns an array of pseudo-random numbers that are generated from the given `password` and `key`.
     *
     * @param password  The password to generate the sequence from. The length of the sequence will
     *                  be the same as the length of `password`.
     * @param key  The key to mix `password` with, to generate different sequences for different
     *             `password` - `key` pairs.
     * @param cost  Base 2 logarithm of the number of expansion rounds to execute.
     */
    protected generateSequence = (password: string, key: string, cost: number) => {
        let w = 0
        let x = 0
        const keyLength = key.length
        const pwLength = password.length
        const result: number[] = []
        const rounds = Math.pow(2, cost)

        for (let r = 0; r < rounds; r++) {
            const isLastRound = r === rounds - 1
            for (let i = 0; i < pwLength; i++) {
                ;[x, w] = this.middleSquare(
                    x + password.charCodeAt(i) + key.charCodeAt((r * pwLength + i) % keyLength),
                    w,
                )
                if (isLastRound) result.push(x)
            }
        }
        return result
    }

    /**
     * Middle square calculator.
     *
     * @param x The "squared" component.
     * @param w The current value of the base sequence that will be used as an offset.
     *
     * @returns A tuple whose first item is the calculated value and the second is the next
     *          value in the base sequence (`w`).
     */
    protected middleSquare = (x: number, w: number): [number, number] => {
        w = (w + this.config.sequenceOffset) % this.config.sequenceMod
        x = x * x + w
        const xAsString = x.toString()
        const xLength = xAsString.length
        return [parseInt(xAsString.substr(Math.floor(xLength / 4), Math.ceil(xLength / 2))), w]
    }
}
