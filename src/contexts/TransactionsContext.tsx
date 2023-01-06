import { ReactNode, useEffect, useState, useCallback } from 'react'
import { api } from '../lib/axios'
import { createContext } from 'use-context-selector'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

// Interface da criação do formulário
interface createTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionContextType {
  transactions: Transaction[]
  // Atualizar transação
  fetchTransactions: (query?: string) => Promise<void>
  // Criar uma transição
  createTransaction: (data: createTransactionInput) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }, [])

  // // Passamos como parâmetro da função de criação do formulário a interface criada acima
  // async function createTransaction(data: createTransactionInput) {
  //   // Desestruturação dos dados
  //   const { description, price, category, type } = data

  //   // Post dos dados da aplicação
  //   const response = await api.post('transactions', {
  //     description,
  //     price,
  //     category,
  //     type,
  //     createdAt: new Date(),
  //   })
  //   // Setando no estado os novos dados retornados dentro da variável de response
  //   setTransactions((state) => [response.data, ...state])
  // }

  const createTransaction = useCallback(
    async (data: createTransactionInput) => {
      const { description, price, category, type } = data
      const response = await api.post('transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      })
      setTransactions((state) => [response.data, ...state])
    },
    [],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Contexto das transações e suas respectivas funções
  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
