import * as Dialog from '@radix-ui/react-dialog'
import { ArrowCircleUp, ArrowCircleDown, X } from 'phosphor-react'
import * as z from 'zod'

import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useContextSelector } from 'use-context-selector'
import { TransactionsContext } from '../../contexts/TransactionsContext'

const NewTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
})

type NewTransactionFormInputs = z.infer<typeof NewTransactionFormSchema>

export function NewTransactionModal() {
  // Utilizando contexto trazemos ao modal o monitoramento de caso aquele campo tenha sido alterado ou não, caso tenha ele dispara a função de criação
  const createTransaction = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.createTransaction
    },
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    // Função reset do formulário
    reset,
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(NewTransactionFormSchema),
    defaultValues: {
      type: 'income',
    },
  })

  // Função assincrona que recebe como parametro a interface criada acima
  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    // Desestruturação dos dados
    const { description, price, category, type } = data

    await createTransaction({
      description,
      price,
      category,
      type,
    })
    // Após a criação do formulário com os respectivos dados, resetamos os campos
    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova transação</Dialog.Title>

        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder="Descrição"
            required
            {...register('description')}
          />
          <input
            type="number"
            placeholder="Preço"
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Categoria"
            required
            {...register('category')}
          />

          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <TransactionType // Root do radio group
                  onValueChange={field.onChange} // Quando valor de algum dos campos do formulário mudar, chamar a função onChange
                  value={field.value}
                >
                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>

                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
