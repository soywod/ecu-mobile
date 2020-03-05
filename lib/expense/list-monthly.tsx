import React, {Fragment, useState} from "react"
import {View} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Button, Container, Content, Icon, Left, List, ListItem, Right, Text} from "native-base"
import {DateTime} from "luxon"
import filter from "lodash/fp/filter"
import groupBy from "lodash/fp/groupBy"
import keys from "lodash/fp/keys"
import mapValues from "lodash/fp/mapValues"
import pipe from "lodash/fp/pipe"
import values from "lodash/fp/values"

import useAsync from "../async/context"
import ScrollView from "../async/scroll-view-with-loader"
import useExpenses from "./context"
import {Expense} from "./model"
import {toEuro} from "./currency"
import Category from "./category"

import styles from "./list.styles"

type MonthlyExpenses = {
  [date: string]: {
    [cat: string]: Expense[]
  }
}

const MonthlyExpenseListView: NavigationStackScreenComponent = props => {
  const {navigate, state} = props.navigation
  const {params = {}} = state
  const [isLoading, setLoading] = useAsync()
  const [date, setDate] = useState(DateTime.local())
  const {expenses} = useExpenses(date.year)

  function showDailyList(date: string, cat: string) {
    return () => {
      navigate("ExpenseListDaily", {date, cat})
    }
  }

  function renderExpensesByDate(date: string) {
    const expenses = monthlyExpenses[date]

    const sortAmount = (catA: string, catB: string) => {
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
            <Text style={styles.date}>
              {DateTime.fromFormat(date, "LLLL yyyy").toFormat("LLLL")}
            </Text>
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
          .sort(sortAmount)
          .map(cat => renderExpensesByCat(date, cat))}
      </Fragment>
    )
  }

  function renderExpensesByCat(date: string, cat: string) {
    const expenses = monthlyExpenses[date][cat]

    return (
      <ListItem
        key={date + cat}
        delayPressIn={50}
        delayPressOut={0}
        onPress={showDailyList(date, cat)}
        style={styles.row}
      >
        <Left>
          <Category category={cat} />
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
    return expenseDate.toFormat("LLLL yyyy") === paramsDate.toFormat("LLLL yyyy")
  }

  const groupMonth = (expense: Expense) => DateTime.fromJSDate(expense.date).toFormat("LLLL yyyy")

  const monthlyExpenses: MonthlyExpenses = pipe([
    filter(filterDate),
    groupBy(groupMonth),
    mapValues(groupBy("cat")),
  ])(expenses)

  function changeDate(type: "minus" | "plus") {
    if (!isLoading) {
      setDate(date[type]({year: 1}))
      setLoading(true)
    }
  }

  return (
    <>
      {!params.year && (
        <View style={styles.filters}>
          <Button transparent onPress={() => changeDate("minus")}>
            <Text>
              <Icon type="FontAwesome" name="caret-left" style={styles.filterIcon} />
            </Text>
          </Button>
          <Text>{date.toFormat("yyyy")}</Text>
          <Button transparent onPress={() => changeDate("plus")}>
            <Text>
              <Icon type="FontAwesome" name="caret-right" style={styles.filterIcon} />
            </Text>
          </Button>
        </View>
      )}
      <ScrollView>
        <List>{keys(monthlyExpenses).map(renderExpensesByDate)}</List>
      </ScrollView>
    </>
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

export default MonthlyExpenseListView
