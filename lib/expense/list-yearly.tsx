import React, {Fragment} from "react"
import {ScrollView, StyleSheet} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Left, List, ListItem, Right, Text} from "native-base"
import {DateTime} from "luxon"
import groupBy from "lodash/fp/groupBy"
import keys from "lodash/fp/keys"
import values from "lodash/fp/values"

import {toEuro} from "../app/currency"
import useExpenses from "./context"
import {Expense} from "./model"
import pipe from "lodash/fp/pipe"
import mapValues from "lodash/fp/mapValues"

type YearlyExpenses = {
  [year: string]: {
    [month: string]: Expense[]
  }
}

const YearlyExpenseList: NavigationStackScreenComponent = props => {
  const {expenses} = useExpenses()
  const {navigate} = props.navigation

  function showMonthlyList(year: string, month: string) {
    return () => {
      navigate("ExpenseListMonthly", {year, month})
    }
  }

  function renderExpensesByYear(year: string) {
    const expenses = yearlyExpenses[year]

    const sortMonthDesc = (monthA: string, monthB: string) => {
      const dateA = DateTime.fromFormat(monthA, "LLLL")
      const dateB = DateTime.fromFormat(monthB, "LLLL")
      if (dateA > dateB) return 1
      if (dateA < dateB) return -1
      return 0
    }

    return (
      <Fragment key={year}>
        <ListItem itemHeader style={styles.headerRow}>
          <Left>
            <Text style={styles.date}>{year}</Text>
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
          .sort(sortMonthDesc)
          .map(month => renderExpensesByMonth(year, month))}
      </Fragment>
    )
  }

  function renderExpensesByMonth(year: string, month: string) {
    const expenses = yearlyExpenses[year][month]

    return (
      <ListItem
        key={year + month}
        delayPressIn={50}
        delayPressOut={0}
        onPress={showMonthlyList(year, month)}
        style={styles.row}
      >
        <Left>
          <Text style={styles.cat}>{month}</Text>
        </Left>
        <Right>
          <Text style={styles.amount}>
            {toEuro(expenses.reduce((total, {amount}) => total + amount, 0))}
          </Text>
        </Right>
      </ListItem>
    )
  }

  const groupYear = (expense: Expense) => DateTime.fromJSDate(expense.date).toFormat("yyyy")

  const groupMonth = (expense: Expense) => DateTime.fromJSDate(expense.date).toFormat("LLLL")

  const sortYearDesc = (yearA: string, yearB: string) => {
    if (yearA > yearB) return -1
    if (yearA < yearB) return 1
    return 0
  }

  const yearlyExpenses: YearlyExpenses = pipe([groupBy(groupYear), mapValues(groupBy(groupMonth))])(
    expenses,
  )

  return (
    <ScrollView>
      <List>
        {keys(yearlyExpenses)
          .sort(sortYearDesc)
          .map(renderExpensesByYear)}
      </List>
    </ScrollView>
  )
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
  cat: {fontSize: 14},
  amount: {color: "rgba(0, 0, 0, 0.25)", fontStyle: "italic", paddingLeft: 5, fontSize: 14},
})

export default YearlyExpenseList
