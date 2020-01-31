import React, {FC, Fragment} from "react"
import {ScrollView, StyleSheet} from "react-native"
import {Badge, Left, List, ListItem, Right, Text} from "native-base"
import {DateTime} from "luxon"
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

const MonthlyExpenseList: FC = () => {
  const {expenses} = useExpenses()

  function renderExpensesByDate(date: string) {
    const expenses = monthlyExpenses[date]

    return (
      <Fragment key={date}>
        <ListItem itemHeader style={styles.headerRow}>
          <Left>
            <Text style={styles.date}>{date}</Text>
          </Left>
          <Right>
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
        {keys(expenses).map(cat => renderExpensesByCat(date, cat))}
      </Fragment>
    )
  }

  function renderExpensesByCat(date: string, cat: string) {
    const expenses = monthlyExpenses[date][cat]
    const {color, backgroundColor} = genThemeStylesFromStr(cat)

    return (
      <ListItem key={date + cat} style={styles.row}>
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

  const month = (expense: Expense) => DateTime.fromJSDate(expense.date).toFormat("LLLL yyyy")
  const monthlyExpenses: MonthlyExpenses = pipe([groupBy(month), mapValues(groupBy("cat"))])(
    expenses,
  )

  return (
    <ScrollView>
      <List>{keys(monthlyExpenses).map(renderExpensesByDate)}</List>
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
  total: {color: "rgba(0, 0, 0, 0.9)", fontStyle: "italic", fontSize: 18},
  catBadge: {borderRadius: 5},
  cat: {fontSize: 14},
  amount: {color: "rgba(0, 0, 0, 0.25)", fontStyle: "italic", paddingLeft: 5, fontSize: 14},
})

export default MonthlyExpenseList
