import React from "react"
import {TouchableHighlight, StyleSheet} from "react-native"
import {Container, Fab, Icon, Text, View} from "native-base"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {SwipeListView} from "react-native-swipe-list-view"
import {DateTime} from "luxon"

import {toEuro} from "../app/currency"
import useExpenses from "./context"
import {Expense} from "./model"

const ExpenseList: NavigationStackScreenComponent = props => {
  const {expenses} = useExpenses()
  const {navigate} = props.navigation

  function editExpense(expense: Expense) {
    return () => navigate("ExpenseEdit", {expense})
  }

  return (
    <Container>
      <SwipeListView
        data={expenses}
        renderItem={({index, item: expense}) => (
          <TouchableHighlight onPress={editExpense(expenses[index])}>
            <View style={styles.row}>
              <Text style={styles.date}>
                {DateTime.fromJSDate(expense.date).toFormat("dd/LL/yy")}
              </Text>
              <Text numberOfLines={1} style={styles.desc}>
                {expense.desc}
              </Text>
              <Text style={styles.amount}>{toEuro(expense.amount)}</Text>
            </View>
          </TouchableHighlight>
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

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    display: "flex",
    flexDirection: "row",
  },

  date: {
    color: "#b0b0b0",
    paddingRight: 10,
  },

  desc: {
    flex: 1,
  },
  amount: {
    fontStyle: "italic",
    fontWeight: "bold",
    paddingLeft: 5,
  },
})

export default ExpenseList
