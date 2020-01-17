import {firestore} from "../app/firebase"
import {Expense, emptyExpense} from "./model"
import {DateTime} from "luxon"
import get from "lodash/fp/get"

function sortExpensesByDate(a: Expense, b: Expense) {
  const dateA = DateTime.fromJSDate(a.date)
  const dateB = DateTime.fromJSDate(b.date)
  if (dateA < dateB) return 1
  if (dateA > dateB) return -1
  return 0
}

type ExpenseChangedHandler = (expenses: Expense[]) => void
export function onExpensesChanged(userId: string, handler: ExpenseChangedHandler) {
  return firestore(`users/${userId}/expenses`).onSnapshot(query => {
    const expenses: Expense[] = []
    query.forEach(doc => {
      if (doc.exists) {
        const data = doc.data()
        const date = DateTime.fromSeconds(get("date.seconds", data)).toJSDate()
        expenses.push({...emptyExpense, ...data, date})
      }
    })
    handler(expenses.sort(sortExpensesByDate))
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
