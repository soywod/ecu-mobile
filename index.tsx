import React, {FC} from "react"
import {AppRegistry} from "react-native"

import Navigator from "./lib/app/navigator"
import {AuthContextProvider} from "./lib/auth/context"
import {name as appName} from "./app.json"

const App: FC = () => (
  <AuthContextProvider>
    <Navigator />
  </AuthContextProvider>
)

AppRegistry.registerComponent(appName, () => App)
