// @ts-check
import antfu from "@antfu/eslint-config"

export default antfu({
  stylistic: {
    quotes: "double",
  },
  rules: {
    "node/prefer-global/process": "off",
    "no-console": "off",
  },
})
