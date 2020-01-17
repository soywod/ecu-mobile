import React, {FC} from "react"
import {Body, Button, Container, View, Content, Header, Icon, Right, Text, Title} from "native-base"
import {SwipeListView} from "react-native-swipe-list-view"
import {DateTime} from "luxon"

import {Expense} from "./model"

import classes from "./list.scss"

const ExpenseList: FC = () => {
  const expenses: Expense[] = [
    {id: "1", cat: "cat", desc: "desc", amount: 54.3, date: DateTime.utc()},
  ]

  return (
    <Container>
      <Header>
        <Body>
          <Title>List</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon name="menu" />
          </Button>
        </Right>
      </Header>
      <Content>
        <SwipeListView
          data={expenses}
          renderItem={data => (
            <View className={classes.row}>
              <Text>I am {data.item.desc} in a SwipeListView</Text>
            </View>
          )}
          renderHiddenItem={() => (
            <View>
              <Text>Left</Text>
              <Text>Right</Text>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      </Content>
    </Container>
  )
}

export default ExpenseList
