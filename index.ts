import {AppRegistry} from "react-native"

import App from "./lib/app/app"
import {name as appName} from "./app.json"

AppRegistry.registerComponent(appName, () => App)
