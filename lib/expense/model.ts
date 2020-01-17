import {DateTime} from "luxon"

export type Expense = {
  id: string
  amount: number
  date: DateTime
  cat?: string
  desc?: string
}

export const emptyExpense: Expense = {
  id: "",
  amount: 0,
  date: DateTime.utc(),
}
