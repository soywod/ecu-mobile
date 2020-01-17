import React, {FC, createContext, useContext, useEffect, useState} from "react"

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

const ExpenseContext = createContext<ExpenseState>(emptyState)

export const ExpenseContextProvider: FC = ({children}) => {
  const auth = useAuthState()
  const [expenses, setExpenses] = useState(emptyState.expenses)

  async function update(expense: Partial<Expense>, merge = true) {
    if (auth.initialized && auth.authenticated) {
      await $expense.update(auth.fsUser.id, expense, merge)
    }
  }

  async function _delete(id: string) {
    if (auth.initialized && auth.authenticated) {
      await $expense.delete(auth.fsUser.id, id)
    }
  }

  useEffect(() => {
    if (!auth.initialized || !auth.authenticated) return
    const unsub = $expense.onExpensesChanged(auth.fsUser.id, setExpenses)
    return () => unsub()
  }, [auth])

  return (
    <ExpenseContext.Provider value={{expenses, update, delete: _delete}}>
      {children}
    </ExpenseContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpenseContext)
export default useExpenses
