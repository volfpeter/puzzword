import type { GeneratorOptions } from "./generator"

const Options = {
    parameterName: "generatorOptions",
    separator: "-",
    capitalText: "capital",
    lowerText: "lower",
    numericText: "numeric",
}
const optionsParameterName = "generatorOptions"
const separator = "+"

/**
 * Parses the generator options from the URL if it contains one.
 */
export function parseOptionsFromURL(): GeneratorOptions | undefined {
    const searchParams = new URLSearchParams(window.location.search)
    const optionsParameter = searchParams.get(optionsParameterName)
    return optionsParameter === null
        ? undefined
        : {
              capital: optionsParameter.includes(Options.capitalText),
              lower: optionsParameter.includes(Options.lowerText),
              numeric: optionsParameter.includes(Options.numericText),
          }
}

/**
 * Generates a "query" URL part from the given generator options.
 */
export function urlEncodeOptions(options: GeneratorOptions): string {
    const parts: string[] = [`${optionsParameterName}=`]
    if (options.capital) parts.push(Options.capitalText)
    if (options.lower) parts.push(Options.lowerText)
    if (options.numeric) parts.push(Options.numericText)
    return parts.length > 1 ? parts.join(separator) : ""
}
