import React, {useState} from "react"
import {NativeSyntheticEvent, TextInputChangeEventData} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {DateTime} from "luxon"
import {
  Button,
  Container,
  Content,
  DatePicker,
  Footer,
  FooterTab,
  Form,
  Icon,
  Input,
  Item,
  Text,
} from "native-base"

import useExpenses from "./context"

import classes from "./edit.scss"

const placeholderStyle = {
  fontSize: 18,
  color: "#b0b0b0",
}

const ExpenseEdit: NavigationStackScreenComponent = props => {
  const {navigate} = props.navigation
  const $expense = useExpenses()
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(DateTime.utc().toJSDate())
  const [cat, setCat] = useState("")
  const [desc, setDesc] = useState("")

  function formatDate(date: Date) {
    return DateTime.fromJSDate(date).toFormat("dd/LL/yyyy")
  }

  function handleInputChange(handler: React.Dispatch<React.SetStateAction<string>>) {
    return (evt: NativeSyntheticEvent<TextInputChangeEventData>) => handler(evt.nativeEvent.text)
  }

  async function addExpense() {
    await $expense.update({amount: +amount, date, cat, desc})
    navigate("ExpenseList")
  }

  return (
    <Container>
      <Content>
        <Form>
          <Item>
            <Icon type="MaterialIcons" name="euro-symbol" />
            <Input
              className={classes.input}
              autoFocus
              placeholder="Amount"
              keyboardType="numeric"
              placeholderTextColor="#b0b0b0"
              value={amount}
              onChange={handleInputChange(setAmount)}
            />
          </Item>
          <Item>
            <Icon type="MaterialCommunityIcons" name="calendar-month" />
            <DatePicker
              placeHolderText={formatDate(date)}
              placeHolderTextStyle={placeholderStyle}
              formatChosenDate={formatDate}
              defaultDate={date}
              onDateChange={setDate}
            />
          </Item>
          <Item>
            <Icon type="MaterialCommunityIcons" name="tag-outline" />
            <Input
              className={classes.input}
              placeholder="Category"
              placeholderTextColor="#b0b0b0"
              value={cat}
              onChange={handleInputChange(setCat)}
            />
          </Item>
          <Item>
            <Icon type="MaterialCommunityIcons" name="text" />
            <Input
              className={classes.input}
              placeholder="Description"
              placeholderTextColor="#b0b0b0"
              value={desc}
              onChange={handleInputChange(setDesc)}
            />
          </Item>
        </Form>
      </Content>
      <Footer>
        <FooterTab>
          <Button onPress={addExpense}>
            <Icon type="MaterialIcons" name="save" />
            <Text>Save</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  )
}

ExpenseEdit.navigationOptions = {
  title: "Edit",
}

export default ExpenseEdit
