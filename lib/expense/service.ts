import {firestore} from "../app/firebase"
import {Expense, emptyExpense} from "./model"

type ExpenseChangedHandler = (expenses: Expense[]) => void
export function onExpensesChanged(userId: string, handler: ExpenseChangedHandler) {
  return firestore(`users/${userId}/expenses`).onSnapshot(query => {
    const expenses: Expense[] = []
    query.forEach(doc => expenses.push({...emptyExpense, ...doc.data()}))
    handler(expenses)
  })
}

export function update(userId: string, expense: Partial<Expense>, merge = true) {
  const id = expense.id || firestore(`users/${userId}/expenses`).doc().id
  return firestore(`users/${userId}/expenses`, id).set({...expense, id}, {merge})
}

export {_delete as delete}
function _delete(userId: string, id: string) {
  return firestore(`users/${userId}/screens`, id).delete()
}

export default {
  onExpensesChanged,
  update,
  delete: _delete,
}
