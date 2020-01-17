import {DateTime} from "luxon"

export type Expense = {
  id: string
  amount: number
  date: Date
  cat?: string
  desc?: string
}

export const emptyExpense: Expense = {
  id: "",
  amount: 0,
  date: DateTime.utc().toJSDate(),
}
