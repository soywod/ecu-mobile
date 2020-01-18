import React, {useState} from "react"
import {NativeSyntheticEvent, TextInputChangeEventData, StyleSheet} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {DateTime} from "luxon"
import compact from "lodash/fp/compact"
import map from "lodash/fp/map"
import pipe from "lodash/fp/pipe"
import sortBy from "lodash/fp/sortBy"
import uniq from "lodash/fp/uniq"

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
  Picker,
} from "native-base"

import {confirm} from "../app/alert"
import {showToast} from "../app/toast"
import {Expense, emptyExpense} from "./model"
import useExpenses from "./context"

const ExpenseEdit: NavigationStackScreenComponent<{expense: Expense}> = props => {
  const {navigate, state} = props.navigation
  const expense = (state.params && state.params.expense) || emptyExpense
  const {expenses, ...$expense} = useExpenses()
  const cats: string[] = pipe([map("cat"), uniq, compact, sortBy("desc")])(expenses)
  const [amount, setAmount] = useState(expense.amount ? expense.amount.toString() : "")
  const [date, setDate] = useState(expense.date)
  const [cat, setCat] = useState(expense.cat || "")
  const [desc, setDesc] = useState(expense.desc || "")

  function formatDate(date: Date) {
    return DateTime.fromJSDate(date).toFormat("dd/LL/yyyy")
  }

  function handleInputChange(handler: React.Dispatch<React.SetStateAction<string>>) {
    return (evt: NativeSyntheticEvent<TextInputChangeEventData>) => handler(evt.nativeEvent.text)
  }

  function save() {
    $expense.update({...expense, amount: +amount, date, cat, desc})
    showToast(`Expense successfully ${expense.id ? "updated" : "added"}!`)
    navigate("ExpenseList")
  }

  function _delete() {
    confirm("Confirm", "Are you sure to delete this expense?", async () => {
      $expense.delete(expense.id)
      showToast("Expense successfully deleted!")
      navigate("ExpenseList")
    })
  }

  return (
    <Container>
      <Content padder>
        <Form>
          <Item>
            <Icon type="MaterialIcons" name="euro-symbol" />
            <Input
              placeholder="Amount"
              keyboardType="numeric"
              placeholderTextColor="#b0b0b0"
              value={amount}
              onChange={handleInputChange(setAmount)}
              style={styles.input}
            />
          </Item>
          <Item>
            <Icon type="MaterialCommunityIcons" name="calendar-month" />
            <DatePicker
              placeHolderText={formatDate(date)}
              placeHolderTextStyle={styles.placeholder}
              formatChosenDate={formatDate}
              defaultDate={date}
              onDateChange={setDate}
            />
          </Item>
          <Item>
            <Icon type="MaterialCommunityIcons" name="tag-outline" />
            <Input
              placeholder="Category"
              placeholderTextColor="#b0b0b0"
              value={cat}
              onChange={handleInputChange(setCat)}
              style={styles.input}
            />
            {cat === "" ? (
              <Picker
                mode="dialog"
                iosIcon={<Icon name="arrow-down" style={styles.placeholder} />}
                placeholder="Category"
                placeholderStyle={styles.placeholder}
                placeholderIconColor="#b0b0b0"
                selectedValue={null}
                onValueChange={cat => setCat(cat)}
              >
                <Picker.Item label="--" value="" color="#b0b0b0" />
                {cats.map(cat => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            ) : null}
          </Item>
          <Item last>
            <Icon type="MaterialCommunityIcons" name="text" />
            <Input
              placeholder="Description"
              placeholderTextColor="#b0b0b0"
              value={desc}
              onChange={handleInputChange(setDesc)}
              style={styles.input}
            />
          </Item>
        </Form>
      </Content>
      <Footer>
        <FooterTab>
          {(expense.id && (
            <Button danger onPress={_delete}>
              <Icon type="FontAwesome" name="trash-o" style={styles.btn} />
            </Button>
          )) ||
            null}
          <Button onPress={save}>
            <Icon type="MaterialIcons" name="save" style={styles.btn} />
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  )
}

ExpenseEdit.navigationOptions = {
  title: "Edit",
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  input: {
    fontSize: 18,
    paddingLeft: 10,
  },
  placeholder: {
    fontSize: 18,
    color: "#b0b0b0",
  },
  btn: {
    color: "#ffffff",
  },
  pickerItem: {
    fontSize: 18,
  },
})

export default ExpenseEdit
