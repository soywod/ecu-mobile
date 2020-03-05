import {Toast} from "native-base"

export function showToast(text: string, type?: "danger" | "success" | "warning") {
  Toast.show({
    type,
    text,
    position: "bottom",
    buttonStyle: {backgroundColor: "#ffffff"},
    buttonTextStyle: {color: "#000000"},
    duration: 4000,
  })
}

export default {showToast}
