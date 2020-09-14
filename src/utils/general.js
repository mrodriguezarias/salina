const generalUtils = {
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  debounce: (func) => {
    setTimeout(func, 0)
  },
}

export default generalUtils
