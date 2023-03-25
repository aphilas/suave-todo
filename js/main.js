import { Todo, TodoDOM } from './todo.js'

const formEl = document.getElementById('todo-form')
const todosEl = document.getElementById('todos')
const filterEls = document.querySelectorAll('input[name=filter]')
const todoEls = document.getElementsByClassName('todo')
const doneEls = document.getElementsByClassName('done')
const countEls = document.getElementsByClassName('count')

const data = {
  todos: [],
  todosDOM: []
}

const zipTodos = _ => {
  const todosClone = [...data.todos] 
  todosClone.forEach(todo => todo.detachWatchers())
  return JSON.stringify(todosClone)
}

const storeTodos = () => {
  localStorage.setItem('todos', zipTodos())
}

const todosCount = _ => {
  const total = data.todos.length
  const done = data.todos.filter(todo => todo.done === true).length
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

const updateApp = _ => {
  updateLength()
  storeTodos()
}

const addToDoDOM = todo => {
  const todoDOM = new TodoDOM(todo)
  data.todosDOM.push(todoDOM)
  todosEl.appendChild(todoDOM.el)
}

const addTodo = (todoObj) => {
  const todo = new Todo(todoObj)
  data.todos.push(todo)

  addToDoDOM(todo)
  updateApp()
}

const deleteTodoDOM = dom => {
  // delete actual todo
  data.todos = data.todos.filter(item => !(item === dom.todo))

  // detach DOM
  dom.el.remove()

  data.todosDOM = data.todosDOM.filter(item => !(item === dom))

  updateApp()
}

formEl.addEventListener('submit', event => {
  event.preventDefault()
  const input = event.target[0]
  addTodo({textVal: input.value})
  input.value = ''
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

export { deleteTodoDOM, updateApp, updateLength }

/**
 * TODO: Reorder todo item on done/not-done
 * TODO: Add animations/transitions/micro-interactions
 * TODO: Save todos to LocalStorage
 */