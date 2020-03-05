import {useEffect, useState} from "react"

import {isLoading$} from "../async/context"
import {useAuthState} from "../auth/context"
import {Expense} from "./model"
import $expense from "./service"

const noop = async () => {}

type ExpenseState = {
  expenses: Expense[]
  update: (expense: Partial<Expense>, merge?: boolean) => Promise<void>
  delete: (id: string) => Promise<void>
}

const emptyState: ExpenseState = {
  expenses: [],
  update: noop,
  delete: noop,
}

export function useExpenses(year?: number, month?: number): ExpenseState {
  const auth = useAuthState()
  const [expenses, setExpenses] = useState(emptyState.expenses)

  useEffect(() => {
    if (auth.initialized && auth.authenticated) {
      const params = {year, month, userId: auth.fsUser.id}
      const unsubscribe = $expense.onExpensesChanged(params, expenses => {
        setExpenses(expenses)
        isLoading$.next(false)
      })
      return () => {
        unsubscribe()
      }
    }
  }, [auth, month, year])

  return {
    expenses,
    update: async (expense: Partial<Expense>, merge = true) => {
      if (auth.initialized && auth.authenticated) {
        await $expense.update(auth.fsUser.id, expense, merge)
      }
    },
    delete: async (id: string) => {
      if (auth.initialized && auth.authenticated) {
        await $expense.delete(auth.fsUser.id, id)
      }
    },
  }
}

export default useExpenses
