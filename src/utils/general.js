const nonCapitalizableWords = [
  "y",
  "el",
  "la",
  "en",
  "del",
  "con",
  "de",
  "las",
  "los",
]

const titleCaseWord = (word, alwaysCapitalize = false) => {
  if (word === word.toUpperCase()) {
    return word
  }
  word = word.toLowerCase()
  const matches = word.match(/^(.*?)(\w)(.*)$/)
  const [pre, upper, post] = [matches?.[1], matches?.[2], matches?.[3]]
  if (
    !matches ||
    (!alwaysCapitalize && nonCapitalizableWords.includes(upper + post))
  ) {
    return word
  }
  return pre + upper.toUpperCase() + post
}

const generalUtils = {
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  debounce: (func) => {
    setTimeout(func, 0)
  },
  capitalize: (string) => {
    return string.replace(/^\w/, (c) => c.toUpperCase())
  },
  titleCase: (string) => {
    return generalUtils.capitalize(
      string
        .split(" ")
        .map((word) => titleCaseWord(word))
        .join(" "),
    )
  },
}

export default generalUtils
