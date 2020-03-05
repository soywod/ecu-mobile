import {createAppContainer} from "react-navigation"
import {createStackNavigator} from "react-navigation-stack"

import ExpenseList from "./expense/list"
import {DailyExpenseListScreen} from "./expense/list-daily"
import {MonthlyExpenseListScreen} from "./expense/list-monthly"
import ExpenseEdit from "./expense/edit"
import Settings from "./settings"

const App = createStackNavigator(
  {
    ExpenseList: {screen: ExpenseList},
    ExpenseListDaily: {screen: DailyExpenseListScreen},
    ExpenseListMonthly: {screen: MonthlyExpenseListScreen},
    ExpenseEdit: {screen: ExpenseEdit},
    Settings: {screen: Settings},
  },
  {initialRouteKey: "ExpenseList"},
)

export default createAppContainer(App)
