import {CollectionReference, firestore} from "../app/firebase"
import {Expense, emptyExpense} from "./model"
import {DateTime} from "luxon"
import get from "lodash/fp/get"

type ExpenseChangedHandler = (expenses: Expense[]) => void
type ExpenseChangeParams = {
  userId: string
  year?: number
  month?: number
}

function withPeriod(params: ExpenseChangeParams, col: CollectionReference) {
  const {year, month} = params

  if (year === undefined) {
    return col
  }

  if (month === undefined) {
    const min = DateTime.local().set({
      year,
      month: 0,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    const max = min.plus({year: 1}).minus({day: 1})
    return col.where("date", ">=", min.toJSDate()).where("date", "<=", max.toJSDate())
  }

  const min = DateTime.local().set({
    year,
    month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
  const max = min.plus({month: 1}).minus({day: 1})
  return col.where("date", ">=", min.toJSDate()).where("date", "<=", max.toJSDate())
}

export function onExpensesChanged(params: ExpenseChangeParams, handler: ExpenseChangedHandler) {
  return withPeriod(params, firestore(`users/${params.userId}/expenses`))
    .orderBy("date", "desc")
    .onSnapshot(query => {
      const expenses: Expense[] = []
      query.forEach(doc => {
        if (doc.exists) {
          const data = doc.data()
          const date = DateTime.fromSeconds(get("date.seconds", data)).toJSDate()
          expenses.push({...emptyExpense, ...data, date})
        }
      })
      handler(expenses)
    })
}

export function update(userId: string, expense: Partial<Expense>, merge = true) {
  const id = expense.id || firestore(`users/${userId}/expenses`).doc().id
  return firestore(`users/${userId}/expenses`, id).set({...expense, id}, {merge})
}

export {_delete as delete}
function _delete(userId: string, id: string) {
  return firestore(`users/${userId}/expenses`, id).delete()
}

export default {
  onExpensesChanged,
  update,
  delete: _delete,
}
