import type { SVGProps } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { api } from '@/utils/client/api'

/**
 * Todo has "pending" and "completed" statuses
 */

export const TodoList = () => {
  const { data: todos = [], refetch } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })

  const updateTodoStatus = api.todoStatus.update.useMutation({
    onSuccess: () => {
      refetch() // Refetch the todos after updating the status
    },
  })

  const handleStatusChange = (id: string, status: string) => {
    const newStatus = status === 'pending' ? 'completed' : 'pending'
    updateTodoStatus.mutate({ id, status: newStatus })
  }

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      refetch() // Refetch the todos after deleting a todo
    },
  })

  const handleDelete = (id: string) => {
    deleteTodo.mutate(id)
  }

  const [listRef] = useAutoAnimate<HTMLUListElement>()

  return (
    <>
      <div className="flex items-center justify-start gap-2">
        <div className="cursor-pointer rounded-full border border-gray-300 px-4 py-1 hover:bg-gray-200">
          All
        </div>
        <div className="cursor-pointer rounded-full border border-gray-300 px-4 py-1 hover:bg-gray-200">
          Pending
        </div>
        <div className="cursor-pointer rounded-full border border-gray-300 px-4 py-1 hover:bg-gray-200">
          Completed
        </div>
      </div>
      <ul ref={listRef} className="grid grid-cols-1 gap-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={todo.status === 'completed' ? 'bg-gray-100' : ''}
          >
            <div
              className={`flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm ${
                todo.status === 'completed'
                  ? 'bg-gray-700  text-white line-through'
                  : ''
              }`}
            >
              <Checkbox.Root
                id={String(todo.id)}
                className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none"
                checked={todo.status === 'completed'}
                onCheckedChange={() => handleStatusChange(todo.id, todo.status)}
              >
                <Checkbox.Indicator>
                  <CheckIcon className="h-4 w-4 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label
                className={`block pl-3 font-medium ${
                  todo.status === 'completed'
                    ? 'text-gray-500 line-through'
                    : ''
                }`}
                htmlFor={String(todo.id)}
              >
                {todo.body}
              </label>
            </div>
            <button
              className="ml-4 rounded-full p-2 hover:bg-gray-200 focus:outline-none"
              aria-label={`Delete todo ${todo.body}`}
              onClick={() => handleDelete(todo.id)}
            >
              <XMarkIcon className="h-5 w-5 text-gray-700" />
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
