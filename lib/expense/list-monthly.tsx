import React, {Fragment} from "react"
import {ScrollView, StyleSheet} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Badge, Container, Content, Left, List, ListItem, Right, Text} from "native-base"
import {DateTime} from "luxon"
import filter from "lodash/fp/filter"
import groupBy from "lodash/fp/groupBy"
import keys from "lodash/fp/keys"
import values from "lodash/fp/values"

import {genThemeStylesFromStr} from "../app/color"
import {toEuro} from "../app/currency"
import useExpenses from "./context"
import {Expense} from "./model"
import pipe from "lodash/fp/pipe"
import mapValues from "lodash/fp/mapValues"

type MonthlyExpenses = {
  [date: string]: {
    [cat: string]: Expense[]
  }
}

const MonthlyExpenseListView: NavigationStackScreenComponent = props => {
  const {navigate, state} = props.navigation
  const {params = {}} = state
  const {expenses} = useExpenses()

  function showDailyList(date: string, cat: string) {
    return () => {
      navigate("ExpenseListDaily", {date, cat})
    }
  }

  function renderExpensesByDate(date: string) {
    const expenses = monthlyExpenses[date]

    const sortAmountDesc = (catA: string, catB: string) => {
      const amountA = expenses[catA].reduce((total, {amount}) => total + amount, 0)
      const amountB = expenses[catB].reduce((total, {amount}) => total + amount, 0)
      if (amountA > amountB) return -1
      if (amountA < amountB) return 1
      return 0
    }

    return (
      <Fragment key={date}>
        <ListItem itemHeader style={styles.headerRow}>
          <Left>
            <Text style={styles.date}>{date}</Text>
          </Left>
          <Right style={styles.totalContainer}>
            <Text style={styles.total}>
              {toEuro(
                values(expenses).reduce(
                  (total, expenses) =>
                    total + expenses.reduce((total, {amount}) => total + amount, 0),
                  0,
                ),
              )}
            </Text>
          </Right>
        </ListItem>
        {keys(expenses)
          .sort(sortAmountDesc)
          .map(cat => renderExpensesByCat(date, cat))}
      </Fragment>
    )
  }

  function renderExpensesByCat(date: string, cat: string) {
    const expenses = monthlyExpenses[date][cat]
    const {color, backgroundColor} = genThemeStylesFromStr(cat)

    return (
      <ListItem
        key={date + cat}
        delayPressIn={50}
        delayPressOut={0}
        onPress={showDailyList(date, cat)}
        style={styles.row}
      >
        <Left>
          <Badge style={{...styles.catBadge, backgroundColor}}>
            <Text style={{...styles.cat, color}}>{cat || "no category"}</Text>
          </Badge>
        </Left>
        <Right>
          <Text style={styles.amount}>
            {toEuro(expenses.reduce((total, {amount}) => total + amount, 0))}
          </Text>
        </Right>
      </ListItem>
    )
  }

  const filterDate = (expense: Expense) => {
    if (!params.month || !params.year) return true
    const expenseDate = DateTime.fromJSDate(expense.date)
    const paramsDate = DateTime.fromFormat(`${params.month} ${params.year}`, "LLLL yyyy")
    return expenseDate.toFormat("LLyy") === paramsDate.toFormat("LLyy")
  }

  const groupMonth = (expense: Expense) => DateTime.fromJSDate(expense.date).toFormat("LLLL yyyy")

  const sortDateDesc = (a: string, b: string) => {
    const dateA = DateTime.fromFormat(a, "LLLL yyyy")
    const dateB = DateTime.fromFormat(b, "LLLL yyyy")
    if (dateA > dateB) return -1
    if (dateA < dateB) return 1
    return 0
  }

  const monthlyExpenses: MonthlyExpenses = pipe([
    filter(filterDate),
    groupBy(groupMonth),
    mapValues(groupBy("cat")),
  ])(expenses)

  return (
    <ScrollView>
      <List>
        {keys(monthlyExpenses)
          .sort(sortDateDesc)
          .map(renderExpensesByDate)}
      </List>
    </ScrollView>
  )
}

export const MonthlyExpenseListScreen: NavigationStackScreenComponent = props => (
  <Container>
    <Content>
      <MonthlyExpenseListView {...props} />
    </Content>
  </Container>
)

MonthlyExpenseListScreen.navigationOptions = {
  title: "Monthly expenses",
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
  totalContainer: {flex: 1},
  total: {color: "rgba(0, 0, 0, 0.9)", fontStyle: "italic", fontSize: 18},
  catBadge: {borderRadius: 5},
  cat: {fontSize: 14},
  amount: {color: "rgba(0, 0, 0, 0.25)", fontStyle: "italic", paddingLeft: 5, fontSize: 14},
})

export default MonthlyExpenseListView
