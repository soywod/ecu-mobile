import {createAppContainer} from "react-navigation"
import {createStackNavigator} from "react-navigation-stack"

import ExpenseList from "../expense/list"
import ExpenseEdit from "../expense/edit"

const navigator = createStackNavigator(
  {
    ExpenseList: {screen: ExpenseList},
    ExpenseEdit: {screen: ExpenseEdit},
  },
  {initialRouteKey: "ExpenseList"},
)

const App = createAppContainer(navigator)

export default App
