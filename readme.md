# State

* maintained outside the app
* maintained in a 'store'
* make it predictable using pure functions

## Store

The store should have four parts:

1. The state
2. Get the state.
3. Listen to changes on the state.
4. Update the state

1 & 2 - create state and get state:

```js
function createStore () {

  let state

  const getState = () => state

  return {
    getState
  }
}
```

3 listen for changes on the state => subscribe

```js
function createStore () {

  let state

  const getState = () => state

  const subscribe = () => {

  }

  return {
    getState,
    subscribe
  }
}

// app code
const store = createStore()
store.subscribe( () => {
	// user can pass a function to subscribe as many times as they want
	// whenever the state changes we _must_ call any of the ƒ passed via subscribe
})
```

We will use a listeners array to store the functions passed in by users:

```js
function createStore () {

  let state
  let listeners = [] // <= storage for ƒs

  const getState = () => state

  const subscribe = (listener) => {
  	listeners.push(listener)  // <= when subscribe is called
  }

  return {
    getState,
    subscribe
  }
}

// app code
const store = createStore()
store.subscribe( () => {
	// we need to keep track of these ƒ
})
```

We also want to allow users to unsubscribe:

```js
function createStore () {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
  	listeners.push(listener)
  	return () => {
  		listeners = listeners.filter( (l) => l !== listener )
  	}
  }

  return {
    getState,
    subscribe
  }
}

// app code
const store = createStore()
const unsubscribe = store.subscribe( () => {
	// 
})
```

Updating the state.

We need a way to describe state changes in our application. We'll use actions for this. 

An action is an object which describes what sort of transformation you want to make to your state.

```js
{
  type: 'ADD_PIRATE',
  pirate: {
    id: 0,
    name: 'Lizzie Terror',
    complete: false,
  }
}

{
  type: 'REMOVE_PIRATE',
  id: 0,
}

{
  type: 'TOGGLE_PIRATE',
  id: 0,
}

function createStore () {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  return {
    getState,
    subscribe,
  }
}
```

## Pure functions

1. always return the same result if the same arguments are passed in
1. depend only on the arguments passed into them - never access values outside of their own scope
1. never produce any side effects - no AJAX or changes outside itself


```js
function add (x,y) {
  return x + y
}
```

Will always give us the same result given the same arguments.

```js
var friends = ['Mikenzi', 'Jordyn', 'Merrick']
friends.slice(0, 1) // 'Mikenzi'
friends.slice(0, 1) // 'Mikenzi'
friends.slice(0, 1) // 'Mikenzi'
```

An impure function - splice():

```js
var friends = ['Mikenzi', 'Jordyn', 'Merrick']
friends.splice(0, 1) // ["Mikenzi"]
friends.splice(0, 1) // ["Jordyn"]
friends.splice(0, 1) // ["Merrick"]
```

## Reducer function

Needs to be predictable - a pure function. 

```js
{
  type: 'ADD_PIRATE',
  pirate: {
    id: 0,
    name: 'Lizzie Terror',
    complete: false,
  }
}

{
  type: 'REMOVE_PIRATE',
  id: 0,
}

{
  type: 'TOGGLE_PIRATE',
  id: 0,
}

 function pirates (state = [], action) {    //  ()state = [] - ES6 default
   if (action.type === 'ADD_PIRATE') {      //  add pirate is our example
     return state.concat([action.pirate])   //  .push() would be a mutation, .concat() returns the next state
   }
   return state
 }

function createStore () {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  return {
    getState,
    subscribe,
  }
}
```

## Dispatch

Dispatch actions to change the state in a predicable manner. 


```js
{
  type: 'ADD_PIRATE',
  pirate: {
    id: 0,
    name: 'Lizzie Terror',
    complete: false,
  }
}

{
  type: 'REMOVE_PIRATE',
  id: 0,
}

{
  type: 'TOGGLE_PIRATE',
  id: 0,
}

 function pirates (state = [], action) {
   if (action.type === 'ADD_PIRATE') {
     return state.concat([action.pirate]) 
   }
   return state
 }

function createStore () {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    // call the pirate ƒ
    state = pirates(state, action)
    // loop over and run the listeners
    listeners.forEach( (listener) => listener() )
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}


const store = createStore()

// dispatching an action
store.dispatch({
  type: 'ADD_PIRATE',
  pirate: {
    id: 0,
    name: 'Lizzie Terror',
    complete: false,
  }
})
```

## Demo

In the console:

```js
function pirates(state = [], action) {
   if (action.type === 'ADD_PIRATE') {
     return state.concat([action.pirate])
   }
   return state
 }

function createStore () {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    // call the pirate ƒ
    state = pirates(state, action)
    // loop over and run the listeners
    listeners.forEach( (listener) => listener() )
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}
```

```js
> const store = createStore()
> store  // {getState: ƒ, subscribe: ƒ, dispatch: ƒ}
> store.getState()  // undefined
> const unsubscribe = store.subscribe( () => {
  console.log('The new state is: ', store.getState())
  })
> store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 0,
      name: 'Lizzie Terror',
      complete: false,
    }
  })
> store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 1,
      name: 'Donald Trump',
      complete: true,
    }
  })
> unsubscribe()
> store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 3,
      name: 'Jack Sparrow',
      complete: true,
    }
  })
  // no return
```

Structural change.

Pass in the pirates function (the "reducer function") when we call createStore. This will allow the user to pass in their own reducer function.

e.g.:

```js
// this ƒ will be created by the end user of our state management library

function pirates (state = [], action) {
 if (action.type === 'ADD_PIRATE') {
   return state.concat([action.pirate]) 
 }
 return state
}

// this is the state management library

function createStore ( reducer ) {  // passed in reducer ƒ

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    // call the pirate ƒ
    state = reducer(state, action)
    // loop over and run the listeners
    listeners.forEach( (listener) => listener() )
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

const store = createStore(pirates)  // pass in the reducer ƒ
```

## Adding Functionality

The reducer only handles one action `action.type === 'ADD_PIRATE')`. 

Add the other two actions using best practices.

* REMOVE_PIRATE - filter out the pirate that has a specific id 
* TOGGLE_PIRATE - modify an item inside the object, don't modify directly

`pirate.id !== action.id ? pirate` - if the id isn't a match don't process it, otherwise:

```js
pirate.id !== action.id ? pirate : {
    name: pirate.name,
    id: pirate.id,
    complete: !pirate.complete
    })  
```

```js
{
  type: 'ADD_PIRATE',
  pirate: {
    id: 0,
    name: 'Lizzie Terror',
    complete: false,
  }
}

{
  type: 'REMOVE_PIRATE',
  id: 0,
}

{
  type: 'TOGGLE_PIRATE',
  id: 0,
}

function pirates (state = [], action) {
 if (action.type === 'ADD_PIRATE') {
   return state.concat([action.pirate]) 
 } else if (action.type === 'REMOVE_PIRATE'){
   return state.filter((pirate) => pirate.id !== action.id)
 } else if (action.type === 'TOGGLE_PIRATE'){
   state.map((pirate) => pirate.id !== action.id ? pirate : {
    name: pirate.name,
    id: pirate.id,
    complete: !pirate.complete
    })  
 } else {
  return state
 }
}
```

If we start adding/.changing properties this could fail. Use `Object.assign()`:

```js
function pirates (state = [], action) {
  if (action.type === 'ADD_PIRATE') {
    return state.concat([action.pirate]) 
  } else if (action.type === 'REMOVE_PIRATE'){
    return state.filter((pirate) => pirate.id !== action.id)
  } else if (action.type === 'TOGGLE_PIRATE'){
    return state.map((pirate) => pirate.id !== action.id ? pirate : 
     Object.assign( {}, pirate, {complete: !pirate.complete})
     )  
  } else {
   return state
  }
 }
```

In the console:

```js
function pirates (state = [], action) {
  if (action.type === 'ADD_PIRATE') {
    return state.concat([action.pirate]) 
  } else if (action.type === 'REMOVE_PIRATE'){
    return state.filter((pirate) => pirate.id !== action.id)
  } else if (action.type === 'TOGGLE_PIRATE'){
    return state.map((pirate) => pirate.id !== action.id ? pirate : 
     Object.assign( {}, pirate, {complete: !pirate.complete})
     )  
  } else {
   return state
  }
 }

function createStore ( reducer ) { 

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    // call the pirate ƒ
    state = reducer(state, action)
    // loop over and run the listeners
    listeners.forEach( (listener) => listener() )
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}
```

```js
> const store = createStore(pirates)
> store.subscribe( () => {
  console.log('The new state is: ', store.getState())
  })
> store.dispatch({
  type: 'ADD_PIRATE',
  pirate: {
    id: 0,
    name: 'Lizzie Terror',
    complete: false,
  }
  })
> store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 1,
      name: 'Donald Trump',
      complete: true,
    }
  })
> store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 2,
      name: 'Jack Sparrow',
      complete: true,
    }
  })
> store.dispatch({
  type: 'REMOVE_PIRATE',
  id: 2
  })
> store.dispatch({
  type: 'TOGGLE_PIRATE',
  id: 0
  })
```

It is something of a standard to use a switch statement instead of `else ... if`s.

```js
function pirates (state = [], action) {
  switch(action.type) {
    case 'ADD_PIRATE' :
      return state.concat([action.pirate])
    case 'REMOVE_PIRATE' :
      return state.filter((pirate) => pirate.id !== action.id)
    case 'TOGGLE_PIRATE' :
      return state.map((pirate) => pirate.id !== action.id ? pirate :
        Object.assign({}, pirate, {complete: !pirate.complete})
      )
    default :
      return state
  }
 }
```

## Adding Reducers

Assume we have an additional set of actions:

```js
{
  type: 'ADD_WEAPON',
  weapon: {
    id: 0,
    name: 'Sword'
  }
}
{
  type: 'REMOVE_WEAPON',
  weapon: {
    id: 0
  }
}
```

Let's create a new reducer for these goals.

```js
function weapons (state = [], action) {
  switch(action.type) {
    case 'ADD_WEAPON' :
    return state.concat([action.weapon])
    case 'REMOVE_WEAPON' :
    return state.filter((weapon) => weapon.id !== action.id)
    default :
    return state
  }
}
```

When we create a store we pass a reducer. Now we have multiple reducers.

The goal of a reducer is to get us to the next state. Instead of state being an array, we want state to be an object with a shape like this:

```js
{
  pirates: [],
  weapons: []
}
```

We will create a new function that returns this shape:

```js
function app (state, action){
  return {
    pirates: [],
    weapons: []
  }
}
```

Since we already have functions for these reducers we can invoke them.

```js
function app (state, action){
  return {
    pirates: pirates(state.pirates, action),
    weapons: weapons(state.weapons, action)
  }
}
```

The first time the app component is inkoke state will be empty. We will use ES6 [default params](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) again:

```js
function app (state = {}, action){
  return {
    pirates: pirates(state.pirates, action),
    weapons: weapons(state.weapons, action)
  }
}
```

Now state will be an object.

Let's test in the console.

```js
function pirates (state = [], action) {
  switch(action.type) {
    case 'ADD_PIRATE' :
    return state.concat([action.pirate])
    case 'REMOVE_PIRATE' :
    return state.filter((pirate) => pirate.id !== action.id)
    case 'TOGGLE_PIRATE' :
    return state.map((pirate) => pirate.id !== action.id ? pirate :
    Object.assign({}, pirate, {complete: !pirate.complete})
    )
    default :
    return state
  }
}

function weapons (state = [], action) {
  switch(action.type) {
    case 'ADD_WEAPON' :
    return state.concat([action.weapon])
    case 'REMOVE_WEAPON' :
    return state.filter((weapon) => weapon.id !== action.id)
    default :
    return state
  }
}

function app (state = {}, action){
  return {
    pirates: pirates(state.pirates, action),
    weapons: weapons(state.weapons, action)
  }
}

function createStore ( reducer ) {
  
  let state
  let listeners = []
  
  const getState = () => state
  
  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }
  
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach( (listener) => listener() )
  }
  
  return {
    getState,
    subscribe,
    dispatch
  }
}

```

```js
const store = createStore(app)

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch({
  type: 'ADD_PIRATE',
  pirate: {
    id: 0,
    name: 'Sam Spade',
    complete: false,
  }
})

store.dispatch({
  type: 'ADD_PIRATE',
  pirate: {
    id: 1,
    name: 'Pete Shelly',
    complete: false,
  }
})

store.dispatch({
  type: 'ADD_PIRATE',
  pirate: {
    id: 2,
    name: 'Brian Eno',
    complete: true,
  }
})

store.dispatch({
  type: 'REMOVE_PIRATE',
  id: 1
})

store.dispatch({
  type: 'TOGGLE_PIRATE',
  id: 0
})

store.dispatch({
  type: 'ADD_WEAPON',
  weapon: {
    id: 0,
    name: 'Sword'
  }
})

store.dispatch({
  type: 'ADD_WEAPON',
  weapon: {
    id: 1,
    name: 'Cannon'
  }
})

store.dispatch({
  type: 'REMOVE_WEAPON',
  id: 0
})
```

## Constants

Our library code is similar to what you might download in via NPM. The app code is the code that you, as a user of the library, might write.

```js
// APP CODE
function app (state = {}, action){
  return {
    pirates: pirates(state.pirates, action),
    weapons: weapons(state.weapons, action)
  }
}

function createStore ( reducer ) {
  
  let state
  let listeners = []
  
  const getState = () => state
  
  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }
  
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach( (listener) => listener() )
  }
  
  return {
    getState,
    subscribe,
    dispatch
  }
}

// APP CODE
function pirates (state = [], action) {
  switch(action.type) {
    case 'ADD_PIRATE' :
    return state.concat([action.pirate])
    case 'REMOVE_PIRATE' :
    return state.filter((pirate) => pirate.id !== action.id)
    case 'TOGGLE_PIRATE' :
    return state.map((pirate) => pirate.id !== action.id ? pirate :
    Object.assign({}, pirate, {complete: !pirate.complete})
    )
    default :
    return state
  }
}

function weapons (state = [], action) {
  switch(action.type) {
    case 'ADD_WEAPON' :
    return state.concat([action.weapon])
    case 'REMOVE_WEAPON' :
    return state.filter((weapon) => weapon.id !== action.id)
    default :
    return state
  }
}
```

Whenever we use the ADD_PIRATE action type we are passing a string. Rather than using strings let's declare variables, e.g.:

```js
// APP CODE

const ADD_PIRATE = 'ADD_PIRATE' // variable

function pirates (state = [], action) {
  switch(action.type) {
    case ADD_PIRATE : // use the variable
    return state.concat([action.pirate])
    case 'REMOVE_PIRATE' :
    return state.filter((pirate) => pirate.id !== action.id)
    case 'TOGGLE_PIRATE' :
    return state.map((pirate) => pirate.id !== action.id ? pirate :
    Object.assign({}, pirate, {complete: !pirate.complete})
    )
    default :
    return state
  }
}
```

```js
// APP CODE

const ADD_PIRATE = 'ADD_PIRATE'
const REMOVE_PIRATE = 'REMOVE_PIRATE'
const TOGGLE_PIRATE = 'TOGGLE_PIRATE'
const ADD_WEAPON = 'ADD_WEAPON'
const REMOVE_WEAPON = 'REMOVE_WEAPON'

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
```

Whenever we dispatch an action we are hard coding the object. Create a function that will return the actual action.

```js
function addPirateAction(pirate){
  return {
    type: ADD_PIRATE,
    pirate
  }
}
```

```js
store.dispatch(addPirateAction({
  id: 0,
  name: 'Sam Spade',
  complete: false,
}))
```

Actions for all the items.

```js
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
```

```js
const store = createStore(app)

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch(addPirateAction({
  id: 0,
  name: 'Sammy Spade',
  complete: false,
}))

store.dispatch(addPirateAction({
    id: 1,
    name: 'Pete Shelly',
    complete: false,
}))

store.dispatch(addPirateAction({
    id: 2,
    name: 'Brian Eno',
    complete: true,
}))

store.dispatch(removePirateAction(1))

store.dispatch(togglePirateAction(0))

store.dispatch(addWeaponAction({
    id: 0,
    name: 'Sword'
}))

store.dispatch(addWeaponAction({
    id: 1,
    name: 'Cannon'
}))

store.dispatch(removeWeaponAction(0))
```

Here is the entire Quokka script:

```js
// APP CODE

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

function app (state = {}, action){
  return {
    pirates: pirates(state.pirates, action),
    weapons: weapons(state.weapons, action)
  }
}

function createStore ( reducer ) {
  
  let state
  let listeners = []
  
  const getState = () => state
  
  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }
  
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach( (listener) => listener() )
  }
  
  return {
    getState,
    subscribe,
    dispatch
  }
}

const store = createStore(app)

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch(addPirateAction({
  id: 0,
  name: 'Sammy Spade',
  complete: false,
}))

store.dispatch(addPirateAction({
    id: 1,
    name: 'Pete Shelly',
    complete: false,
}))

store.dispatch(addPirateAction({
    id: 2,
    name: 'Brian Eno',
    complete: true,
}))

store.dispatch(removePirateAction(1))

store.dispatch(togglePirateAction(0))

store.dispatch(addWeaponAction({
  id: 0,
  name: 'Sword'
}))

store.dispatch(addWeaponAction({
    id: 1,
    name: 'Cannon'
}))

store.dispatch(removeWeaponAction(0))
```

We have abstracted our actions into their own action creates. Now whenever you want to access and action you call it and pass in the data for that specific action.

## App Scaffolding

The createStore() function creates state, returns state, creates listeners and updates state in the most predicatable manner possible.

Create a new `index.html` with a spot for our scripts.

```html
<html>
<head>
  <title>Pirates/Weapons</title>
  <link href="https://fonts.googleapis.com/css?family=Pirata+One" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>

<body>

  <div class="header">
    <img src="img/anchor.svg" class="logo" alt="logo" />
    <h1>Pirate Hunter</h1>
  </div>

  <script type='text/javascript'>

  </script>
</body>
</html>
```

Paste the entire Quokka script into the script tag. Open the file in a browser and examine the console.

Add to the DOM:

```html
<div>
  <h1>Pirate List</h1>
  <input id='pirate' type='text' placeholder="Add Pirate">
  <button id='pirateBtn'>Add Pirate</button>
  <ul id='pirates'></ul>
</div>

<div>
  <h1>Weapon List</h1>
  <input id='weapon' type='text' placeholder="Add Weapon">
  <button id='weaponBtn'>Add Weapon</button>
  <ul id='weapons'></ul>
</div>
```

At the bottom of the JS in index.html:

```js
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
```

Add an id generator at the top of the script:

```js
function generateId(){
  return Date.now()
}
```

```js
function addWeapon(){
  const input = document.getElementById('weapon')
  const name = input.value
  input.value = ''

  store.dispatch(addWeaponAction({
    id: generateId(),
    name
  }))
}
```

Hook up the scripts to the buttons

```js
document.getElementById('pirateBtn')
.addEventListener('click', addPirate)

document.getElementById('weaponBtn')
.addEventListener('click', addWeapon)
```

Connect the state to UI

Comment out the current dispatches:

```js
// store.dispatch(addPirateAction({
//   id: 0,
//   name: 'Sammy Spade',
//   complete: false,
// }))

// store.dispatch(addPirateAction({
//   id: 1,
//   name: 'Pete Shelly',
//   complete: false,
// }))

// store.dispatch(addPirateAction({
//   id: 2,
//   name: 'Brian Eno',
//   complete: true,
// }))

// store.dispatch(removePirateAction(1))

// store.dispatch(togglePirateAction(0))

// store.dispatch(addWeaponAction({
//   id: 0,
//   name: 'Sword'
// }))

// store.dispatch(addWeaponAction({
//   id: 1,
//   name: 'Cannon'
// }))

// store.dispatch(removeWeaponAction(0))
```

## Subscribing to Updates

We already have this script:

```js
store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})
```

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()
  console.log('weapons ', weapons)
  console.log('pirates ', pirates)
})
```

Test.

Loop over the items and throw them into the DOM.

Do weapons first (its easier):

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()
  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})

function addPirateToDom(pirate){

}

function addWeaponToDom(weapon){
  const node = document.createElement('li')
  const text = document.createTextNode(weapon.name)
  node.appendChild(text)
  document.getElementById('weapons').appendChild(node)
}
```

Do the same for pirates.

```js
function addPirateToDom(pirate){
  const node = document.createElement('li')
  const text = document.createTextNode(pirate.name)
  node.appendChild(text)
  document.getElementById('pirates').appendChild(node)
}
```

Try adding a second pirate. Eveytime we add an itiem we append the previous items.

We need to clear the list.

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()

  document.getElementById('pirates').innerHTML = ''
  document.getElementById('weapons').innerHTML = ''

  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})
```

Toggle pirates as seen.

```js
function addPirateToDom(pirate){
  const node = document.createElement('li')
  const text = document.createTextNode(pirate.name)
  node.appendChild(text)

  node.style.textDecoration = pirate.complete ? 'line-through' : 'none'
  node.addEventListener('click', () => {
    store.dispatch(togglePirateAction(pirate.id))
  })

  document.getElementById('pirates').appendChild(node)
}
```

Our UI is just a representation of our state.

## Dispatching Remove Items

```js
function createRemoveButton(onClick){
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = 'x'
  removeBtn.addEventListener('click', onClick)

  return removeBtn
}
```

```js
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
```

Do the same for weapons.

```js
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
```

Congratulations! You have just created [Redux](https://redux.js.org/).

```html
<script src='https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.min.js'></script>
```

Delete:

```js
function createStore ( reducer ) {
  
  let state
  let listeners = []
  
  const getState = () => state
  
  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }
  
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach( (listener) => listener() )
  }
  
  return {
    getState,
    subscribe,
    dispatch
  }
}
```

Instead of creating our store we will create a Redux store:

```js
const store = Redux.createStore(app)
```

The root reducer is also part of Redux.

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}))
```

Delete the main reducer:

```js
function app (state = {}, action){
  return {
    pirates: pirates(state.pirates, action),
    weapons: weapons(state.weapons, action)
  }
}
```

Donald Trump is suing us for defamation. We need to display a warning whenever we add him to our state.

We could resolve this by creating a function:

```js
function checkAndDispatch (store, action) {
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
  return store.dispatch(action)
}
```

And then call it wherever we currently call `store.dispatch`:

```js
function addPirateToDom(pirate){
  const node = document.createElement('li')
  const text = document.createTextNode(pirate.name)
  
  const removeBtn = createRemoveButton(() => {
    checkAndDispatch(store, removePirateAction(pirate.id))
  })
  
  node.appendChild(text)
  node.appendChild(removeBtn)
  
  node.style.textDecoration = pirate.complete ? 'line-through' : 'none'
  node.addEventListener('click', () => {
    checkAndDispatch(store, togglePirateAction(pirate.id))
  })
  
  document.getElementById('pirates').appendChild(node)
}

function addWeaponToDom(weapon){
  const node = document.createElement('li')
  const text = document.createTextNode(weapon.name)
  
  const removeBtn = createRemoveButton( () => {
    checkAndDispatch(store, removeWeaponAction(weapon.id))
  })
  
  node.appendChild(text)
  node.append(removeBtn)
  
  document.getElementById('weapons').appendChild(node)
}

function addPirate(){
  const input = document.getElementById('pirate')
  const name = input.value
  input.value = ''
  
  checkAndDispatch(store, addPirateAction({
    id: generateId(),
    name,
    complete: false,
  }))
}

function addWeapon(){
  const input = document.getElementById('weapon')
  const name = input.value
  input.value = ''
  
  checkAndDispatch(store, addWeaponAction({
    id: generateId(),
    name
  }))
}
```

A better way would be to hook into the mode between when an action is dispatched and when the reducer runs.

## Redux Middleware

Middleware is some code you can put between the framework receiving a request, and the framework generating a response. Can be used for error reporting and routing.

`return next(action)`

```js
function checker (store) {
  return function (next){
    return function (action){
      // middleware - copy from checkAndDispatch
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
      return next(action) // new
      }
  }
}
```

Currying

Delete the checkAndDispatch function and replace the `checkAndDispatch(store,` code with what we had before: `store.dispatch(...)`.

Tell Redux about the middleware.

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}))
```

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}),Redux.applyMiddleware(checker))
```

ES6 version:

```js
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
```

Here are some popular packages in the Redux ecosystem that are implemented via middleware.

* [redux-api-middleware](https://github.com/agraboso/redux-api-middleware) - Redux middleware for calling an API.
* [redux-logger](https://github.com/evgenyrodionov/redux-logger) - Logger middleware for Redux.
* [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware) - Redux middleware for resolving and rejecting promises with conditional optimistic updates.
* [redux-thunk](https://github.com/gaearon/redux-thunk) - Thunk middleware for Redux.
* [redux-logic](https://github.com/jeffbski/redux-logic) - Redux middleware for organizing business logic and action side effects.
* [redux-observable](https://github.com/redux-observable/redux-observable) - RxJS middleware for action side effects in Redux using "Epics".
* [redux-test-recorder](https://github.com/conorhastings/redux-test-recorder) - Redux middleware to automatically generate tests for reducers through ui interaction.
* [redux-reporter](https://github.com/ezekielchentnik/redux-reporter) - Report actions & metadata to 3rd party providers, extremely useful for analytics and error handling (New Relic, Sentry, Adobe DTM, Keen, etc.)
* [redux-localstorage](https://github.com/elgerlambert/redux-localstorage) - Store enhancer that syncs (a subset) of your Redux store state to localstorage.
* [redux-node-logger](https://github.com/low-ghost/redux-node-logger) - A Redux Logger for Node Environments
* [redux-catch](https://github.com/sergiodxa/redux-catch) - Error catcher middleware for Redux reducers and middlewares
* [redux-cookies-middleware](https://github.com/grofers/redux-cookies-middleware/) - a Redux middleware which syncs a subset of your Redux store state with cookies.
* [redux-test-recorder](https://github.com/conorhastings/redux-test-recorder) - Redux test recorder is a redux middleware + included component for automagically generating tests for your reducers based on the actions in your app

## Logging Middleware

We will log the action and the state to the console using middleware.

```js
const logger = (store) => (next) => (action) => {
  console.group(action.type)
  console.log('The action: ', action )
  const result = next(action)
  console.log('The new state: ', store.getState())
  console.groupEnd()
  return result
}
```

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}), Redux.applyMiddleware(checker, logger))
```

## Adding React

```html
<script src='https://unpkg.com/react@16.3.0-alpha.1/umd/react.development.js'></script>
<script src='https://unpkg.com/react-dom@16.3.0-alpha.1/umd/react-dom.development.js'></script>
<script src='https://unpkg.com/babel-standalone@6.15.0/babel.min.js'></script>
```

```html
<hr />
<div id="app"></div>
...
<script type="text/babel" src="js/react-babel.js"></script>
```

Implement the main component.

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        React app
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
```

Add List, Weapons and Pirates components and render them via the App.

```js
function List (props) {
  return (
    <ul>
    <li>list</li>
    </ul>
  )
}

class Pirates extends React.Component {
  render() {
    return (
      <React.Fragment>
        Pirates
        <List />
      </React.Fragment>
    )
  }
}

class Weapons extends React.Component {
  render() {
    return (
      <React.Fragment>
        Weapons
        <List />
      </React.Fragment>
    )
  }
}

class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates />
        <Weapons />
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
```

## Adding Items

Recall the `addPirate` function in the vanilla js portion:

```js
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
```

Implement this is the Pirates component.

First the return:

```js
class Pirates extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Then the addItem function:

```js
class Pirates extends React.Component {
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch()
  }
  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Pass props to the Pirate component from App

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates store ={this.props.store} />
        <Weapons />
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
)
```

Complete the addItem function

```js
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addPirateAction({
      id: generateId,
      name,
      complete: false
    }))
  }
```

The weapons component.

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates store ={this.props.store} />
        <Weapons store ={this.props.store} />
      </React.Fragment>
    )
  }
}
```

```js
class Weapons extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Add the same addItem function:

```js
class Weapons extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addWeaponAction({
      id: generateId,
      name
    }))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Rendering the Lists

Grab the Pirates and the Weapons and pass them to the components:

```js
class App extends React.Component {
  render(){
    const { store } = this.props
    const { pirates, weapons } = store.getState()
    return(
      <React.Fragment>
        <Pirates pirates={pirates} store ={store} />
        <Weapons weapons={weapons} store ={store} />
      </React.Fragment>
    )
  }
}
```

Pirates component

```js
<List
items={this.props.pirates}/>
```

Weapons component"

```js
<List
items={this.props.weapons}/>
```

List

```js
function List (props) {
  return (
    <ul>
      {props.item.map((item) => (
        <li key={item.id}>
          <span>
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  )
}
```

App

We want to cause a re-render by using setState. But we do not have any state inside the component. We will use forceUpdate:

```js
class App extends React.Component {

  componentDidMount () {
    const { store } = this.props
    store.subscribe( () => this.forceUpdate())
  }

  render(){
    const { store } = this.props
    const { pirates, weapons } = store.getState()
    return(
      <React.Fragment>
        <Pirates pirates={pirates} store ={store} />
        <Weapons weapons={weapons} store ={store} />
      </React.Fragment>
    )
  }
}
```

Add remove item to react.

List should take another prop - remove.

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

Create removeItem inside Pirates and Weapons components.

```js
class Pirates extends React.Component {
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addPirateAction({
      id: generateId,
      name,
      complete: false
    }))
  }

  removeItem = () => {

  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input 
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
          <List
          items={this.props.pirates}
          remove={this.removeItem}
          />
      </React.Fragment>
    )
  }
}
```

```js
removeItem = (pirate) => {
  this.props.store.dispatch(removePirateAction(pirate.id))
}
```

Add it to the Weapons component.

```js
class Weapons extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addWeaponAction({
      id: generateId,
      name
    }))
  }

  removeItem = (weapon) => {
    this.props.store.dispatch(removeWeaponAction(weapon.id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
          <List
          items={this.props.weapons}
          remove={this.removeItem}
          />
      </React.Fragment>
    )
  }
}
```

## Toggle

This refers to the toggle functionality that marks a Pirate as spotted.

The action in question is togglePirate. Add a method:

```js
toggleItem = (id) => {
  this.props.store.dispatch(togglePirateAction(id))
}
```

And pass it as a prop to the List component:

```js
class Pirates extends React.Component {
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addPirateAction({
      id: generateId,
      name,
      complete: false
    }))
  }

  removeItem = (pirate) => {
    this.props.store.dispatch(removePirateAction(pirate.id))
  }

  toggleItem = (id) => {
    this.props.store.dispatch(togglePirateAction(id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
          <List
          items={this.props.pirates}
          remove={this.removeItem}
          toggle={this.toggleItem}
          />
      </React.Fragment>
    )
  }
}
```

List

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={ () => props.toggle(item.id)}>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

Run a test (we are not using toggle in Weapons) and add styling.

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={ () => props.toggle && props.toggle(item.id)}
          style={ {textDecoration: item.complete ? 'line-through' : 'none'} }>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

## Handling Asynchronous Data

Delete the vanilla JavaScript.