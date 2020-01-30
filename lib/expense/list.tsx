import React from "react"
import {TouchableNativeFeedback, FlatList, StyleSheet} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Button, Container, Footer, FooterTab, Icon, Tab, Tabs, Text, View} from "native-base"
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
      <Tabs tabBarUnderlineStyle={styles.tabBarUnderlineStyle}>
        <Tab
          heading="Daily"
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          textStyle={styles.textStyle}
          activeTextStyle={styles.activeTextStyle}
        >
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
                    {expense.desc || expense.cat}
                  </Text>
                  <Text style={styles.amount}>{toEuro(expense.amount)}</Text>
                </View>
              </TouchableNativeFeedback>
            )}
          />
        </Tab>
        <Tab
          heading="Monthly"
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          textStyle={styles.textStyle}
          activeTextStyle={styles.activeTextStyle}
        >
          <Text>TODO</Text>
        </Tab>
        <Tab
          heading="Yearly"
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          textStyle={styles.textStyle}
          activeTextStyle={styles.activeTextStyle}
        >
          <Text>TODO</Text>
        </Tab>
      </Tabs>
      <Footer>
        <FooterTab>
          <Button light onPress={() => navigate("ExpenseEdit")}>
            <Icon type="MaterialIcons" name="add" />
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  )
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
  date: {color: "#b0b0b0", paddingRight: 10},
  desc: {flex: 1},
  amount: {fontStyle: "italic", fontWeight: "bold", paddingLeft: 5},
  add: {zIndex: 999, backgroundColor: "#3f51b5"},
  profileIcon: {color: "rgba(0, 0, 0, 0.9)"},
  tabStyle: {backgroundColor: "#ffffff"},
  activeTabStyle: {backgroundColor: "#ffffff"},
  tabBarUnderlineStyle: {backgroundColor: "#3f51b5"},
  textStyle: {color: "rgba(0, 0, 0, 0.5)"},
  activeTextStyle: {color: "rgba(0, 0, 0, 0.9)"},
})

ExpenseList.navigationOptions = ({navigation}) => ({
  title: "Expenses",
  headerRight: () => (
    <Button transparent rounded onPress={() => navigation.navigate("Settings")}>
      <Icon type="MaterialIcons" name="settings" style={styles.profileIcon} />
    </Button>
  ),
})

export default ExpenseList
