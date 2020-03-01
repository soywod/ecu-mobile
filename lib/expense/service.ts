import {firestore} from "../app/firebase"
import {Expense, emptyExpense} from "./model"
import {DateTime} from "luxon"
import get from "lodash/fp/get"

type ExpenseChangedHandler = (expenses: Expense[]) => void
type ExpenseChangeParams = {
  userId: string
  year: number
  month?: number
}

export function onExpensesChanged(params: ExpenseChangeParams, handler: ExpenseChangedHandler) {
  const {userId, year, month} = params
  const dateMin = DateTime.local().set({
    year,
    month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
  const dateMax = dateMin.plus({month: 1}).minus({day: 1})

  return firestore(`users/${userId}/expenses`)
    .where("date", ">=", dateMin.toJSDate())
    .where("date", "<=", dateMax.toJSDate())
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
