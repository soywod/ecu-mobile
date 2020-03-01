import "intl"
import "intl/locale-data/jsonp/fr-FR"

import React, {FC} from "react"
import {AppRegistry} from "react-native"
import {Root} from "native-base"

import Navigator from "./lib/app/navigator"
import {AuthContextProvider} from "./lib/auth/context"
import {name as appName} from "./app.json"

const App: FC = () => (
  <AuthContextProvider>
    <Root>
      <Navigator />
    </Root>
  </AuthContextProvider>
)

AppRegistry.registerComponent(appName, () => App)
