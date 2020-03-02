import React, {Fragment} from "react"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Left, List, ListItem, Right, Text} from "native-base"
import {DateTime} from "luxon"
import groupBy from "lodash/fp/groupBy"
import keys from "lodash/fp/keys"
import values from "lodash/fp/values"

import ScrollView from "../_shared/async/scroll-view"
import {toEuro} from "../app/currency"
import useExpenses from "./context"
import {Expense} from "./model"
import pipe from "lodash/fp/pipe"
import mapValues from "lodash/fp/mapValues"

import styles from "./list.styles"

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
        {keys(expenses).map(month => renderExpensesByMonth(year, month))}
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
          <Text style={styles.desc}>{month}</Text>
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

  const yearlyExpenses: YearlyExpenses = pipe([groupBy(groupYear), mapValues(groupBy(groupMonth))])(
    expenses,
  )

  return (
    <ScrollView>
      <List>{keys(yearlyExpenses).map(renderExpensesByYear)}</List>
    </ScrollView>
  )
}

export default YearlyExpenseList
