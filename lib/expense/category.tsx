import React, {FC} from "react"
import {StyleSheet, TextStyle} from "react-native"
import {Badge, Text} from "native-base"
import tinycolor from "tinycolor2"

type CategoryProps = {
  category?: string
}

const Category: FC<CategoryProps> = ({category}) => {
  const {color, backgroundColor, borderColor} = genThemeStylesFromStr(category || "")

  return (
    <Badge style={{...styles.container, backgroundColor, borderColor}}>
      <Text numberOfLines={1} style={{...styles.content, color}}>
        {category}
      </Text>
    </Badge>
  )
}

const styles = StyleSheet.create({
  container: {borderRadius: 5, justifyContent: "center", height: 20, borderWidth: 1},
  content: {fontSize: 12, paddingTop: 0, paddingRight: 0, paddingBottom: 1, paddingLeft: 0},
})

// Sources: https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
function hashCode(str: string) {
  let hash = 0
  for (var i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return hash
}

function intToHexa(i: number) {
  const c = (i & 0x00ffffff).toString(16).toUpperCase()
  return "00000".substring(0, 6 - c.length) + c
}

function genThemeStylesFromStr(str: string): TextStyle {
  const bg = tinycolor(intToHexa(hashCode(str)))
    .brighten(30)
    .desaturate(20)

  const fg = bg.isLight()
    ? tinycolor(bg.toHexString()).darken(50)
    : tinycolor(bg.toHexString()).lighten(35)

  const border = tinycolor(bg.toHexString()).darken(15)

  return {
    color: fg.toHexString(),
    backgroundColor: bg.toHexString(),
    borderColor: border.toHexString(),
    borderWidth: 1,
  }
}

export default Category
