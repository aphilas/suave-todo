import { el, appendChildren, _ } from './dom.js'
import { updateLength, deleteTodoDOM, updateApp } from './main.js'

let labelCount = 0

class Todo {
  /**
   *      
   * @param {object} todoValues
   * 
   * @param {string} todoValues.textVal
   * @param {boolean} todoValues.doneVal
   * @param {number}  todoValues.created
   */
  constructor ({textVal = '', doneVal = false, created = Date.now()}) {
    this.textVal = textVal
    this.doneVal = doneVal
    this.created = created

    this.watchers = []
  }

  set text(newVal) {
    this.textVal = newVal
    this.notify('text', newVal)
  }

  get text() {
    return this.textVal
  }

  set done(newVal) {
    this.doneVal = newVal
    this.notify('done', newVal)
  }

  get done() {
    return this.doneVal
  }

  subscribe(fn, context) {
    this.watchers.push({fn, context})
  }

  notify(name, newVal) {
    if (this.watchers.length > 0) 
      this.watchers.forEach(({context, fn}) => fn.call(context, {name, newVal}))
  }

  detachWatchers() {
    this.watchers = []
  }
}

class TodoDOM {
  constructor(todo) {
    // watch for to updates
    this.todo = todo

    todo.subscribe(this.update, this)
        
    this.el = el('li', _ , 'todo')

    this.textEl = el('div', {spellcheck: false,} , 'text', todo.text)

    // edit text
    this.textEl.addEventListener('dblclick', ({target}) => {
      target.setAttribute('contenteditable', true)
      target.focus()
    })

    this.textEl.addEventListener('blur', ({target}) => {
      todo.text = target.textContent
      updateApp()
    })

    this.textEl.addEventListener('keydown', ({target, keyCode}) => {
      if (keyCode === 13) {
        event.preventDefault()
        target.blur()
      }
    })

    // mark as done/not done

    labelCount += 1 // terrible hack to style checkboxes
    const checkLabel = el('label', {for: `check-${labelCount}`})
    const doneEl = el('input', {type: 'checkbox', id: `check-${labelCount}`})

    doneEl.addEventListener('change', event => {
      todo.done = !todo.done
      updateApp()
    })

    const checkboxEl = el('div', _ , ['checkbox', 'filled'], [doneEl, checkLabel])

    const deleteEl = el('button', _ , 'delete')
    deleteEl.innerHTML = '&times;'
    deleteEl.addEventListener('click', event => {
      // this is Todo
      deleteTodoDOM(this)
    })

    appendChildren(this.el, [checkboxEl, this.textEl, deleteEl,])
  }

  update({name, newVal}) {
    if (name === 'text') {
      this.textEl.textContent = newVal
    }

    if (name === 'done') {
      this.todo.done === true ? this.el.classList.add('done') : this.el.classList.remove('done')
    }
  }
}

export { Todo, TodoDOM }