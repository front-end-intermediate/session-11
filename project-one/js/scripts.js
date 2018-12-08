// APP CODE

function generateId(){
  return Date.now()
}

const ADD_PIRATE = 'ADD_PIRATE'
const REMOVE_PIRATE = 'REMOVE_PIRATE'
const TOGGLE_PIRATE = 'TOGGLE_PIRATE'
const ADD_WEAPON = 'ADD_WEAPON'
const REMOVE_WEAPON = 'REMOVE_WEAPON'

function addPirateAction(pirate){
  return {
    type: ADD_PIRATE,
    pirate
  }
}
function removePirateAction(id){
  return {
    type: REMOVE_PIRATE,
    id
  }
}
function togglePirateAction(id){
  return {
    type: TOGGLE_PIRATE,
    id
  }
}
function addWeaponAction(weapon){
  return {
    type: ADD_WEAPON,
    weapon
  }
}
function removeWeaponAction(id){
  return {
    type: REMOVE_WEAPON,
    id
  }
}

function pirates (state = [], action) {
  switch(action.type) {
    case ADD_PIRATE : // use the variable
    return state.concat([action.pirate])
    case REMOVE_PIRATE :
    return state.filter((pirate) => pirate.id !== action.id)
    case TOGGLE_PIRATE :
    return state.map((pirate) => pirate.id !== action.id ? pirate :
    Object.assign({}, pirate, {complete: !pirate.complete})
    )
    default :
    return state
  }
}

function weapons (state = [], action) {
  switch(action.type) {
    case ADD_WEAPON :
    return state.concat([action.weapon])
    case REMOVE_WEAPON :
    return state.filter((weapon) => weapon.id !== action.id)
    default :
    return state
  }
}

// DOM CODE

const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}))

store.subscribe(() => {
  const { weapons, pirates } = store.getState()
  
  document.getElementById('pirates').innerHTML = ''
  document.getElementById('weapons').innerHTML = ''
  
  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})

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
  
  const removeBtn = createRemoveButton( () => {
    store.dispatch(removeWeaponAction(weapon.id))
  })
  
  node.appendChild(text)
  node.append(removeBtn)
  
  document.getElementById('weapons').appendChild(node)
}

function createRemoveButton(onClick){
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = 'x'
  removeBtn.addEventListener('click', onClick)
  
  return removeBtn
  
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

document.getElementById('pirateBtn')
.addEventListener('click', addPirate)

document.getElementById('weaponBtn')
.addEventListener('click', addWeapon)