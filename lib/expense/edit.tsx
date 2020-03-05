import React, {useState} from "react"
import {NativeSyntheticEvent, TextInputChangeEventData, StyleSheet} from "react-native"
import {NavigationStackScreenComponent} from "react-navigation-stack"
import {Container, Fab, Content, DatePicker, Form, Icon, Input, Item, Picker} from "native-base"
import {DateTime} from "luxon"
import compact from "lodash/fp/compact"
import isEqual from "lodash/fp/isEqual"
import map from "lodash/fp/map"
import pipe from "lodash/fp/pipe"
import uniq from "lodash/fp/uniq"

import useAsync from "../async/context"
import {confirm} from "../alert"
import {Expense, emptyExpense} from "./model"
import useExpenses from "./context"

const ExpenseEdit: NavigationStackScreenComponent<{expense?: Expense}> = props => {
  const {navigate, state} = props.navigation
  const expense = (state.params && state.params.expense) || emptyExpense
  const {expenses, ...$expense} = useExpenses()
  const setLoading = useAsync()[1]
  const [amount, setAmount] = useState(expense.amount ? expense.amount.toString() : "")
  const [date, setDate] = useState(expense.date)
  const [cat, setCat] = useState(expense.cat || "")
  const [desc, setDesc] = useState(expense.desc || "")
  const cats: string[] = pipe([map("cat"), uniq, compact])(expenses)

  function formatDate(date: Date) {
    return DateTime.fromJSDate(date).toFormat("dd/LL/yyyy")
  }

  function handleInputChange(handler: React.Dispatch<React.SetStateAction<string>>) {
    return (evt: NativeSyntheticEvent<TextInputChangeEventData>) => handler(evt.nativeEvent.text)
  }

  function save() {
    const nextExpense: Expense = {...expense, amount: +amount, date, cat: cat.toLowerCase(), desc}
    if (!isEqual(expense, nextExpense)) {
      setLoading(true)
      $expense.update(nextExpense)
    }
    navigate("ExpenseList")
  }

  function _delete() {
    confirm("Confirm", "Are you sure to delete this expense?", async () => {
      setLoading(true)
      $expense.delete(expense.id)
      navigate("ExpenseList")
    })
  }

  return (
    <Container>
      <Content>
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
          <Item style={styles.datePicker}>
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
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" style={styles.placeholder} />}
                placeholder="Category"
                placeholderStyle={styles.placeholder}
                placeholderIconColor="#b0b0b0"
                selectedValue={null}
                onValueChange={cat => setCat(cat)}
              >
                <Picker.Item label="--" value="" color="#b0b0b0" />
                {cats.sort().map(cat => (
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
      {expense.id ? (
        <Fab position="bottomLeft" onPress={_delete} style={styles.deleteBtn}>
          <Icon type="FontAwesome" name="trash-o" style={styles.btn} />
        </Fab>
      ) : null}
      <Fab position="bottomRight" onPress={save} style={styles.saveBtn}>
        <Icon type="MaterialIcons" name="check" style={styles.btn} />
      </Fab>
    </Container>
  )
}

ExpenseEdit.navigationOptions = props => ({
  title: props.navigation.state.params ? "Edit expense" : "Add expense",
})

const styles = StyleSheet.create({
  form: {flex: 1},
  datePicker: {paddingTop: 5, paddingBottom: 5},
  input: {fontSize: 16, paddingLeft: 10},
  placeholder: {fontSize: 16, color: "#b0b0b0"},
  saveBtn: {backgroundColor: "#5cb85c"},
  deleteBtn: {backgroundColor: "#d9534f"},
  btn: {color: "#ffffff"},
  pickerItem: {fontSize: 16},
})

export default ExpenseEdit
