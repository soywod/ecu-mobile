import {Toast} from "native-base"

export function showToast(text: string, type?: "danger" | "success" | "warning") {
  Toast.show({
    type,
    text,
    position: "bottom",
    buttonText: "OK",
    style: {bottom: 0, height: 55, opacity: 0.9},
    buttonStyle: {backgroundColor: "#ffffff"},
    buttonTextStyle: {color: "#000000"},
  })
}

export default {showToast}
