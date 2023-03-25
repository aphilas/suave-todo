/**
 * CSS
 */

const style = (_ => {
  
  let style = document.getElementsByTagName('style')[0]
  if (style) return style

  style = document.createElement('style')

  // WebKit hack
  style.appendChild(document.createTextNode(''))

  document.head.appendChild(style)

  return style
})()

/**
 * Add style rule to style sheet
 * @param {String} rule 
 */
const addStyle = rule => {
  // -1 for append to end of style sheet
  style.sheet.insertRule(rule)
}

/**
 * DOM
 */

 const nonEmptyArray = value => Array.isArray(value) && value.length > 0

/**
 * Creates a DOM element
 * 
 * @param {string} tag - HTML element tagName
 * @param {Object} attrs - object of attributes
 * @param {(string|string[])} classes - list of class names
 * @param {(string|Node[])} text - text content or child nodes
 * 
 * @returns {Node}
 */

const el = (tag = 'div', attrs = {}, classes, children) => {
  
  const el = document.createElement(tag)
  
  // attributes

  const setAttrs = ['disabled', 'autocomplete', 'selected', 'checked']

  for (let prop in attrs) {

    // attribute event listeners e.g. onclick
    if (prop.startsWith('on')) {
      const callback = attrs[prop]
      if (typeof callback === 'function') el.addEventListener(attrs[prop].slice(2), attrs[prop])
    } 
    
    // 'set' attributes
    else if (setAttrs.includes(prop)) {
      if (attrs[prop] === null || attrs[prop] === false) continue
      el.setAttribute(prop, prop)
    } 
    
    // all other attributes
    else {
      if (attrs[prop] === null || attrs[prop] === undefined) continue
      el.setAttribute(prop, attrs[prop])
    }
  }

  // classes

  if (nonEmptyArray(classes)) {
    el.classList.add(...classes)
  } 
  
  else if (typeof classes === 'string') {
    el.classList.add(classes)
  }

  // children

  if (children === undefined || children === null) return el
  
  // array
  if (nonEmptyArray(children)) {
    children.forEach(child => {
      
      // text
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child))
      } 
  
      // node 
      else if (child instanceof Node) {
        el.appendChild(child)
      }
    })
  }
  
  // string
  else if (typeof children === 'string' && children !== '') {
    el.appendChild(document.createTextNode(children))
  }
  
  // node
  else if (children instanceof Node) {
    el.appendChild(children)
  }

  return el
}

const appendChildren = (parent, children) => {
  const fragment = document.createDocumentFragment()
  children.forEach(child => {
    fragment.appendChild(child)
  })
  parent.appendChild(fragment)
} 

const _ = undefined

export { addStyle, el, appendChildren, _ }


/**
 * TODO: Peformance optimizations
 * TODO: Building components
 * TODO: update()
 * TODO: Updating mutated DOM only
 */

