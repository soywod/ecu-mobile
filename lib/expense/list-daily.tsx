import React, {Fragment} from "react"
import {View, ScrollView, StyleSheet} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Badge, Container, Content, Left, List, ListItem, Right, Text} from "native-base"
import {DateTime} from "luxon"
import filter from "lodash/fp/filter"
import groupBy from "lodash/fp/groupBy"
import keys from "lodash/fp/keys"
import pickBy from "lodash/fp/pickBy"
import pipe from "lodash/fp/pipe"

import {genThemeStylesFromStr} from "../app/color"
import {confirm} from "../app/alert"
import {showToast} from "../app/toast"
import {toEuro} from "../app/currency"
import useExpenses from "./context"
import {Expense} from "./model"

type DailyExpenses = {
  [date: string]: Expense[]
}

const DailyExpenseListView: NavigationStackScreenComponent = props => {
  const {navigate, state} = props.navigation
  const {params = {}} = state
  const {expenses, ...$expense} = useExpenses()

  function editExpense(expense: Expense) {
    return () => {
      navigate("ExpenseEdit", {expense})
    }
  }

  function deleteExpense(id: string) {
    return () => {
      confirm("Confirm", "Are you sure to delete this expense?", async () => {
        $expense.delete(id)
        showToast("Expense successfully deleted!")
        navigate("ExpenseList")
      })
    }
  }

  function renderExpense(expense: Expense) {
    const {color, backgroundColor} = genThemeStylesFromStr(expense.cat || "")

    return (
      <ListItem
        key={expense.id}
        delayPressIn={0}
        delayPressOut={0}
        onPress={editExpense(expense)}
        onLongPress={deleteExpense(expense.id)}
        style={styles.row}
      >
        <Text numberOfLines={1} style={styles.desc}>
          {expense.desc}
        </Text>
        <View style={styles.catView}>
          {expense.cat ? (
            <Badge style={{...styles.catBadge, backgroundColor}}>
              <Text numberOfLines={1} style={{...styles.cat, color}}>
                {expense.cat}
              </Text>
            </Badge>
          ) : null}
        </View>
        <Text style={styles.amount}>{toEuro(expense.amount)}</Text>
      </ListItem>
    )
  }

  function renderDailyExpenses(date: string) {
    const expenses = dailyExpenses[date]

    return (
      <Fragment key={date}>
        <ListItem itemHeader style={styles.headerRow}>
          <Left>
            <Text style={styles.date}>{date}</Text>
          </Left>
          <Right>
            <Text style={styles.total}>
              {toEuro(expenses.reduce((total, {amount}) => total + amount, 0))}
            </Text>
          </Right>
        </ListItem>
        {expenses.map(renderExpense)}
      </Fragment>
    )
  }

  const day = (expense: Expense) => DateTime.fromJSDate(expense.date).toFormat("dd/LL/yy")

  const date = (_: Expense[], date: string) => {
    if (!params.date || !params.cat) return true
    return params.date === DateTime.fromFormat(date, "dd/LL/yy").toFormat("LLLL yyyy")
  }

  const cat = (expense: Expense) => {
    if (params.cat === undefined) return true
    return expense.cat === params.cat
  }

  const dailyExpenses: DailyExpenses = pipe([filter(cat), groupBy(day), pickBy(date)])(expenses)

  return (
    <ScrollView>
      <List>{keys(dailyExpenses).map(renderDailyExpenses)}</List>
    </ScrollView>
  )
}

export const DailyExpenseListScreen: NavigationStackScreenComponent = props => (
  <Container>
    <Content>
      <DailyExpenseListView {...props} />
    </Content>
  </Container>
)

DailyExpenseListScreen.navigationOptions = {
  title: "Daily expenses",
}

const styles = StyleSheet.create({
  headerRow: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  row: {paddingTop: 7.5, paddingRight: 10, paddingBottom: 7.5, paddingLeft: 10, marginLeft: 0},
  date: {color: "rgba(0, 0, 0, 0.9)", fontSize: 18},
  total: {color: "rgba(0, 0, 0, 0.9)", fontStyle: "italic", fontSize: 18},
  catView: {flex: 2},
  catBadge: {borderRadius: 5},
  cat: {fontSize: 14},
  desc: {color: "rgba(0, 0, 0, 0.9)", flex: 3, fontSize: 14, paddingLeft: 5},
  amount: {color: "rgba(0, 0, 0, 0.25)", fontStyle: "italic", paddingLeft: 5, fontSize: 14},
})

export default DailyExpenseListView
