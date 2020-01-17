import React from "react"
import {Container, Fab, Icon, Text, View} from "native-base"
import {SwipeListView} from "react-native-swipe-list-view"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {DateTime} from "luxon"

import {Expense} from "./model"

import classes from "./list.scss"

const ExpenseList: NavigationStackScreenComponent = props => {
  const {navigate} = props.navigation

  const expenses: Expense[] = [
    {id: "1", cat: "cat", desc: "desc", amount: 54.3, date: DateTime.utc()},
  ]

  return (
    <Container>
      <SwipeListView
        data={expenses}
        renderItem={data => (
          <View className={classes.row}>
            <Text>I am {data.item.desc} in a SwipeListView</Text>
          </View>
        )}
        renderHiddenItem={() => (
          <View>
            <Text>Left</Text>
            <Text>Right</Text>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
      />
      <Fab position="bottomRight" onPress={() => navigate("ExpenseEdit")}>
        <Icon name="add" />
      </Fab>
    </Container>
  )
}

ExpenseList.navigationOptions = {
  title: "List",
}

export default ExpenseList
