import "intl"
import "intl/locale-data/jsonp/fr-FR"

import React, {FC} from "react"
import {AppRegistry} from "react-native"
import Navigator from "./lib/app/navigator"
import {AuthContextProvider} from "./lib/auth/context"
import {ExpenseContextProvider} from "./lib/expense/context"
import {name as appName} from "./app.json"

const App: FC = () => (
  <AuthContextProvider>
    <ExpenseContextProvider>
      <Navigator />
    </ExpenseContextProvider>
  </AuthContextProvider>
)

AppRegistry.registerComponent(appName, () => App)
