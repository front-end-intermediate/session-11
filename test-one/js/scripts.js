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

const checker = (store) => (next) => (action) => {
  if (
  action.type === ADD_WEAPON &&
  action.weapon.name.toLowerCase().indexOf('trump') !== -1
  ){
    return alert('You\'re fired!')
  }
  if (
    action.type === ADD_PIRATE &&
    action.pirate.name.toLowerCase().indexOf('trump') !== -1
  ){
    return alert('You\'re fired!')
  }
  return next(action)
}

const logger = (store) => (next) => (action) => {
  console.group(action.type)
  console.log('The action: ', action )
  const result = next(action)
  console.log('The new state: ', store.getState())
  console.groupEnd()
  return result
}