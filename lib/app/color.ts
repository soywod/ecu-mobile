// Sources: https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
import tinycolor from "tinycolor2"

function hashCode(str: string) {
  let hash = 0
  for (var i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return hash
}

function intToHexa(i: number) {
  const c = (i & 0x00ffffff).toString(16).toUpperCase()
  return "00000".substring(0, 6 - c.length) + c
}

export function genThemeStylesFromStr(str: string) {
  const bg = tinycolor(intToHexa(hashCode(str)))
    .brighten(30)
    .desaturate(20)
  const fg = tinycolor(bg.isLight() ? "000" : "fff")
  return {color: fg.toHexString(), backgroundColor: bg.toHexString()}
}

export default genThemeStylesFromStr
