import {createAppContainer} from "react-navigation"
import {createStackNavigator} from "react-navigation-stack"

import ExpenseList from "../expense/list"
import ExpenseEdit from "../expense/edit"
import Settings from "../settings/settings"

const navigator = createStackNavigator(
  {
    ExpenseList: {screen: ExpenseList},
    ExpenseEdit: {screen: ExpenseEdit},
    Settings: {screen: Settings},
  },
  {initialRouteKey: "ExpenseList"},
)

export default createAppContainer(navigator)
