import { addStyle, el, appendChildren, _ } from './dom.js'
import { Todo } from './todo.js'

const formEl = document.getElementById('todo-form')
const todosEl = document.getElementById('todos')
const filterEls = document.querySelectorAll('input[name=filter]')
const todoEls = document.getElementsByClassName('todo')
const doneEls = document.getElementsByClassName('done')
const countEls = document.getElementsByClassName('count')

const todos = []

const zipTodos = _ => {
  const todosClone = [...data.todos] 
  todosClone.forEach(todo => todo.detachWatchers())
  return JSON.stringify(todosClone)
}

const storeTodos = () => {
  localStorage.setItem('todos', zipTodos())
}

const todosCount = _ => {
  const total = todos.length
  const done = todos.filter(todo => todo.done === true).length
  const active = total - done
  
  return {
    total, active, done
  }
}

const updateLength = _ => {
  const {total, active, done} = todosCount()
  const values = [total, active, done]

  Array.from(countEls).forEach((el, index) => {
    el.textContent = values[index]
  })
}

const addTodo = text => {
  const todo = new Todo(text)
  todosEl.appendChild(todo.el)
  todos.push(todo)
  updateLength()
  storeTodos()
}

const deleteTodo = todo => {
  // equality by reference
  todos.filter(item => item === todo)
  todo.el.remove()
  updateLength()
}

addTodo('Wash')
addTodo('Eat')
addTodo('March')

formEl.addEventListener('submit', event => {
  event.preventDefault()
  const text = event.target[0].value
  addTodo(text)
})

Array.from(filterEls).forEach(el => {
  el.addEventListener('change', event => {
    const filter = event.target.value

    if (filter === 'all') {
      Array.from(todoEls).forEach(el => el.classList.remove('hidden'))      
    } 
    
    else if (filter === 'active') {
      Array.from(todoEls).forEach(el => el.classList.remove('hidden'))
      Array.from(doneEls).forEach(el => el.classList.add('hidden'))
    } 
    
    else if (filter === 'done') {
      Array.from(todoEls).forEach(el => {
        if (!el.classList.contains('done')) {
          el.classList.add('hidden')
        } else {
          el.classList.remove('hidden')
        }
      })
    }

  })
})

const readStorage = () => {
  const archive = JSON.parse(localStorage.getItem('todos'))

  if (archive && archive.length > 0) {
    archive.forEach(todo => {
      addTodo(todo)
    })
  }
}

window.addEventListener('load', readStorage)

// readStorage()


/**
 * TODO: Reorder todo item on done/not-done
 * TODO: Add animations/transitions/micro-interactions
 * TODO: Save todos to LocalStorage
 */