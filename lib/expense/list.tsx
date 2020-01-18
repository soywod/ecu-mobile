import React from "react"
import {TouchableNativeFeedback, FlatList, StyleSheet} from "react-native"
import {Button, Container, Content, Fab, Icon, Text, View, Footer, FooterTab} from "native-base"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {DateTime} from "luxon"

import {confirm} from "../app/alert"
import {showToast} from "../app/toast"
import {toEuro} from "../app/currency"
import useExpenses from "./context"
import {Expense} from "./model"

const ExpenseList: NavigationStackScreenComponent = props => {
  const {expenses, ...$expense} = useExpenses()
  const {navigate} = props.navigation

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

  return (
    <Container>
      <Content>
        <FlatList
          data={expenses}
          keyExtractor={e => e.id}
          renderItem={({item: expense}) => (
            <TouchableNativeFeedback
              delayPressIn={0}
              delayPressOut={0}
              onPress={editExpense(expense)}
              onLongPress={deleteExpense(expense.id)}
            >
              <View style={styles.row}>
                <Text style={styles.date}>
                  {DateTime.fromJSDate(expense.date).toFormat("dd/LL/yy")}
                </Text>
                <Text numberOfLines={1} style={styles.desc}>
                  {expense.desc}
                </Text>
                <Text style={styles.amount}>{toEuro(expense.amount)}</Text>
              </View>
            </TouchableNativeFeedback>
          )}
        />
      </Content>
      <Footer>
        <FooterTab>
          <Button onPress={() => navigate("ExpenseEdit")}>
            <Icon type="MaterialIcons" name="add" style={styles.icon} />
          </Button>
        </FooterTab>
      </Footer>
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
  icon: {
    color: "#ffffff",
  },
  add: {
    zIndex: 999,
    backgroundColor: "#3f51b5",
  },
})

export default ExpenseList
