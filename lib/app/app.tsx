import React, {FC} from "react"
import {NativeRouter, Route, Redirect} from "react-router-native"

import ExpenseList from "../expense/list"
import ExpenseEdit from "../expense/edit"

const App: FC = () => {
  return (
    <NativeRouter>
      <Route path="/expenses/:id" component={ExpenseEdit} />
      <Route path="/expenses" component={ExpenseList} />
      <Redirect to="/expenses" />
    </NativeRouter>
  )
}

export default App
