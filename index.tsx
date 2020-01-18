import "intl"
import "intl/locale-data/jsonp/fr-FR"

import React, {FC} from "react"
import {AppRegistry} from "react-native"
import {Root} from "native-base"

import Navigator from "./lib/app/navigator"
import {AuthContextProvider} from "./lib/auth/context"
import {ExpenseContextProvider} from "./lib/expense/context"
import {name as appName} from "./app.json"

const App: FC = () => (
  <AuthContextProvider>
    <ExpenseContextProvider>
      <Root>
        <Navigator />
      </Root>
    </ExpenseContextProvider>
  </AuthContextProvider>
)

AppRegistry.registerComponent(appName, () => App)
