import React from "react"
import {StyleSheet} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Button, Fab, Container, Icon, Tab, Tabs} from "native-base"

import DailyList from "./list-daily"
import MonthlyList from "./list-monthly"
import YearlyList from "./list-yearly"

const ExpenseList: NavigationStackScreenComponent = props => {
  const {navigate} = props.navigation

  return (
    <Container>
      <Tabs tabBarUnderlineStyle={styles.tabBarUnderlineStyle}>
        <Tab heading="Daily" {...tabStyles}>
          <DailyList {...props} />
        </Tab>
        <Tab heading="Monthly" {...tabStyles}>
          <MonthlyList {...props} />
        </Tab>
        <Tab heading="Yearly" {...tabStyles}>
          <YearlyList {...props} />
        </Tab>
      </Tabs>
      <Fab onPress={() => navigate("ExpenseEdit")} style={styles.addBtn}>
        <Icon type="MaterialIcons" name="add" style={styles.addIcon} />
      </Fab>
    </Container>
  )
}

const styles = StyleSheet.create({
  tabBarUnderlineStyle: {backgroundColor: "#3f51b5"},
  addBtn: {backgroundColor: "#3f51b5"},
  addIcon: {color: "#ffffff"},
  profileIcon: {color: "rgba(0, 0, 0, 0.9)"},
})

const tabStyles = StyleSheet.create({
  tabStyle: {backgroundColor: "#ffffff"},
  activeTabStyle: {backgroundColor: "#ffffff"},
  textStyle: {color: "rgba(0, 0, 0, 0.5)"},
  activeTextStyle: {color: "rgba(0, 0, 0, 0.9)"},
})

ExpenseList.navigationOptions = ({navigation}) => ({
  title: "Expenses",
  headerStyle: {elevation: 0},
  headerRight: () => (
    <Button transparent rounded onPress={() => navigation.navigate("Settings")}>
      <Icon type="MaterialIcons" name="settings" style={styles.profileIcon} />
    </Button>
  ),
})

export default ExpenseList
