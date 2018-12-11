const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}), Redux.applyMiddleware(checker, logger))

store.subscribe(() => {
  const { weapons, pirates } = store.getState()

  document.getElementById('pirates').innerHTML = ''
  document.getElementById('weapons').innerHTML = ''

  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})

function generateId() {
  return Date.now()
}

function createRemoveButton(onClick){
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = '✖︎'
  removeBtn.addEventListener('click', onClick)
  return removeBtn
}

function addPirateToDom(pirate){
  const node = document.createElement('li')
  const text = document.createTextNode(pirate.name)

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removePirateAction(pirate.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  node.style.textDecoration = pirate.complete ? 'line-through' : 'none'
  node.addEventListener('click', () => {
    store.dispatch(togglePirateAction(pirate.id))
  })

  document.getElementById('pirates').appendChild(node)
}

function addWeaponToDom(weapon){
  const node = document.createElement('li')
  const text = document.createTextNode(weapon.name)

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeWeaponAction(weapon.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  document.getElementById('weapons').appendChild(node)
}

function addPirate(){
  const input = document.getElementById('pirate')
  const name = input.value
  input.value = ''

  store.dispatch(addPirateAction({
    id: generateId(),
    name,
    complete: false,
  }))
}

function addWeapon(){
  const input = document.getElementById('weapon')
  const name = input.value
  input.value = ''

  store.dispatch(addWeaponAction({
    id: generateId(),
    name
  }))
}

document.getElementById('pirateBtn').addEventListener('click', addPirate)

document.getElementById('weaponBtn').addEventListener('click', addWeapon)