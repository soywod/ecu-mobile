import {Alert} from "react-native"

export function confirm(title: string, msg: string, callback: (v?: string) => void) {
  Alert.alert(title, msg, [
    {text: "Cancel"},
    {
      text: "OK",
      onPress: callback,
    },
  ])
}

export default {confirm}
