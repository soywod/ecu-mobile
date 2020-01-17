import {AppRegistry} from "react-native"

import App from "./lib/expense/list"
import {name as appName} from "./app.json"

AppRegistry.registerComponent(appName, () => App)
