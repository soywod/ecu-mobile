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

  useEffect(() => {
    if (!auth.initialized || !auth.authenticated) return
    const unsub = $expense.onExpensesChanged(auth.fsUser.id, setExpenses)
    return () => unsub()
  }, [auth])

  return (
    <ExpenseContext.Provider value={{expenses, update: noop, delete: noop}}>
      {children}
    </ExpenseContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpenseContext)
export default useExpenses
