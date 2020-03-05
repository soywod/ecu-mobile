import React, {Fragment, useState} from "react"
import {View} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Button, Container, Content, Icon, Left, List, ListItem, Right, Text} from "native-base"
import {DateTime} from "luxon"
import filter from "lodash/fp/filter"
import groupBy from "lodash/fp/groupBy"
import keys from "lodash/fp/keys"
import pipe from "lodash/fp/pipe"

import useAsync from "../async/context"
import ScrollView from "../async/scroll-view-with-loader"
import {confirm} from "../alert"
import useExpenses from "./context"
import {Expense} from "./model"
import {toEuro} from "./currency"
import Category from "./category"

import styles from "./list.styles"

type DailyExpenses = {
  [date: string]: Expense[]
}

const DailyExpenseListView: NavigationStackScreenComponent = props => {
  const {navigate, state} = props.navigation
  const {params = {}} = state
  const defaultDate = params.date ? DateTime.fromFormat(params.date, "LLLL yyyy") : DateTime.local()
  const [isLoading, setLoading] = useAsync()
  const [date, setDate] = useState(defaultDate)
  const {expenses, ...$expense} = useExpenses(date.year, date.month)

  function editExpense(expense: Expense) {
    return () => {
      navigate("ExpenseEdit", {expense})
    }
  }

  function deleteExpense(id: string) {
    return () => {
      confirm("Confirm", "Are you sure to delete this expense?", async () => {
        setLoading(true)
        $expense.delete(id)
        navigate("ExpenseList")
      })
    }
  }

  function renderExpense(expense: Expense) {
    return (
      <ListItem
        key={expense.id}
        delayPressIn={50}
        delayPressOut={0}
        onPress={editExpense(expense)}
        onLongPress={deleteExpense(expense.id)}
        style={styles.row}
      >
        <View style={styles.cat}>
          <Category category={expense.cat} />
        </View>
        <Text numberOfLines={1} style={styles.desc}>
          {expense.desc}
        </Text>
        <Text style={styles.amount}>{toEuro(expense.amount)}</Text>
      </ListItem>
    )
  }

  function renderDailyExpenses(date: string) {
    const expenses = dailyExpenses[date]

    const sortAmount = (e1: Expense, e2: Expense) => {
      if (e1.amount > e2.amount) return -1
      if (e1.amount < e2.amount) return 1
      return 0
    }

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
        {expenses.sort(sortAmount).map(renderExpense)}
      </Fragment>
    )
  }

  const filterCat = (expense: Expense) => {
    if (params.cat === undefined) return true
    return expense.cat === params.cat
  }

  const filterDate = (expense: Expense) => {
    if (params.date === undefined) return true
    return params.date === DateTime.fromJSDate(expense.date).toFormat("LLLL yyyy")
  }

  const groupDays = (expense: Expense) => DateTime.fromJSDate(expense.date).toFormat("EEEE d")

  const dailyExpenses: DailyExpenses = pipe([
    filter(filterCat),
    filter(filterDate),
    groupBy(groupDays),
  ])(expenses)

  function changeDate(type: "minus" | "plus", val: "month" | "year") {
    if (!isLoading) {
      setDate(date[type]({[val]: 1}))
      setLoading(true)
    }
  }

  return (
    <>
      {!params.date && (
        <View style={styles.filters}>
          <Button transparent onPress={() => changeDate("minus", "month")}>
            <Text>
              <Icon type="FontAwesome" name="caret-left" style={styles.filterIcon} />
            </Text>
          </Button>
          <Text>{date.toFormat("LLLL")}</Text>
          <Button transparent onPress={() => changeDate("plus", "month")}>
            <Text>
              <Icon type="FontAwesome" name="caret-right" style={styles.filterIcon} />
            </Text>
          </Button>
          <Button transparent onPress={() => changeDate("minus", "year")}>
            <Text>
              <Icon type="FontAwesome" name="caret-left" style={styles.filterIcon} />
            </Text>
          </Button>
          <Text>{date.toFormat("yyyy")}</Text>
          <Button transparent onPress={() => changeDate("plus", "year")}>
            <Text>
              <Icon type="FontAwesome" name="caret-right" style={styles.filterIcon} />
            </Text>
          </Button>
        </View>
      )}
      <ScrollView>
        {!isLoading && <List>{keys(dailyExpenses).map(renderDailyExpenses)}</List>}
      </ScrollView>
    </>
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

export default DailyExpenseListView
