/**
 * Relace the specified substring in a given string 
 * @param {*} string The main string String
 * @param {*} substringsToReplace Object substrings to be replaced and what to replace them with
 * @returns String New string with substrings replaced
 */
export function parse(string, substringsToReplace) {
  if (substringsToReplace && typeof substringsToReplace !== 'object' && substringsToReplace.constructor !== Object) {
    throw new Error(`dynamic-string-parser.parse() expects ${substringsToReplace} to be an Object.`)
  }

  const substringsToReplaceKeys = Object.keys(substringsToReplace)
  const patterns = substringsToReplaceKeys.map((substring) => `{${substring}}`).join('|')

  let regularExpr = new RegExp(`(${patterns})`, 'g')

  const newString = string.replace(regularExpr, m => {
    const matchWithoutBraces = m.replace(/[{}]/g, '')
    return substringsToReplace[matchWithoutBraces]
  })
  return newString
}