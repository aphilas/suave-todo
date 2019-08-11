import { el, appendChildren, _ } from './dom.js'
import { deleteTodo, updateLength } from './main.js'

let labelCount = 0

class Todo {
  constructor (text) {
    this.text = text
    this.done = false
    
    this.el = el('li', _ , 'todo')

    this.textEl = el('div', {spellcheck: false,} , 'text', text)

    // edit text

    this.textEl.addEventListener('dblclick', ({target}) => {
      target.setAttribute('contenteditable', true)
      target.focus()
    })

    this.textEl.addEventListener('blur', ({target}) => {
      this.updateText(target.textContent)
    })

    this.textEl.addEventListener('keydown', ({target, keyCode}) => {
      if (keyCode === 13) {
        event.preventDefault()
        target.blur()
      }
    })

    // mark as done/not done

    // terrible hack to style checkboxes
    labelCount += 1

    const checkLabel = el('label', {for: `check-${labelCount}`})
    const doneEl = el('input', {type: 'checkbox', id: `check-${labelCount}`})

    doneEl.addEventListener('change', event => {
      this.el.classList.toggle('done')
      if (this.done) {
        this.done = false
        // this.el.parentNode.prepend(this.el)
      } else {
        this.done = true
        // this.el.parentNode.appendChild(this.el)
      }
      updateLength()
    })

    const checkboxEl = el('div', _ , ['checkbox', 'filled'], [doneEl, checkLabel])

    const deleteEl = el('button', _ , 'delete')
    deleteEl.innerHTML = '&times;'
    deleteEl.addEventListener('click', event => {
      // this is Todo

      deleteTodo(this)
    })

    appendChildren(this.el, [checkboxEl, this.textEl, deleteEl,])
  }

  updateText(newVal) {
    this.text = newVal
    this.textEl.textContent = newVal
  }

  delete() {
  }
}

export { Todo }