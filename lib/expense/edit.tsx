import React from "react"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Container, Text} from "native-base"

const ExpenseEdit: NavigationStackScreenComponent = () => {
  return (
    <Container>
      <Text>Edit</Text>
    </Container>
  )
}

ExpenseEdit.navigationOptions = {
  title: "Edit",
}

export default ExpenseEdit
