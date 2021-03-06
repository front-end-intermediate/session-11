# XI State

## Homework

Work on your final projects. They should consist of a full stack (front and back end) master / detail view that uses React for the front end and has a backend which can be done in Express with mLab. You can use Firebase if you wish however be sure to use the same version of re-base that we used in session 10 - unless you really know what you are doing.

Implement the React portion of the exercise using Create React App.

## Reading

[Leveling Up with React Redux](https://css-tricks.com/learning-react-redux/)

## State

* maintained outside the app
* maintained in a 'store'
* make it as predictable as possible
* uses "pure functions"

## Building the Store

The store should have four parts:

1. The state
2. A way to get the state.
3. A way to listen to changes on the state.
4. A way to update the state

Create in `test-one/js/scripts.js`:

Store items 1 & 2 - create state and get state:

```js
function createStore () {

  let state

  const getState = () => state

  return {
    getState
  }
}
```

This returns a function that enables the user to get the state. State is initially undefined.

It would be used like this:

```js
const store = createStore()
store
store.getState()
```

Store item 3 - listen for changes on the state with `()=> subscribe`:

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
  // user can pass a function to subscribe multiple times
  // whenever the state changes we must call any of the ƒunction passed via subscribe
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

We also want to allow users to unsubscribe. We will return a ƒunction with subscribe that, when called, removes a listener via filtering the listeners array:

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

})
```

## Updating State

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
1. never produce any side effects - no AJAX calls or changes outside itself

A pure function:

```js
function add (x,y) {
  return x + y
}
```

Will always give us the same result given the same arguments.

```js
var friends = ['Daniel', 'Todd', 'Paul']
friends.slice(0, 1) // 'Daniel'
friends.slice(0, 1) // 'Daniel'
friends.slice(0, 1) // 'Daniel'
```

An impure function - splice():

```js
var friends = ['Daniel', 'Todd', 'Paul']
friends.splice(0, 1) // ["Daniel"]
friends.splice(0, 1) // ["Todd"]
friends.splice(0, 1) // ["Paul"]
```

## Reducer Functions

A reducer is a pure function that takes the previous state and an action, and returns the next state. `(previousState, action) => newState`. 

<!-- It's called a [reducer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) because it's the type of function you would pass to `Array.prototype.reduce(reducer, ?initialValue)`. -->

It needs to be as predictable as possible - therefore we use a pure function.

For the following action:

```js
{
  type: 'ADD_PIRATE',
  pirate: {
    id: 0,
    name: 'Lizzie Terror',
    complete: false,
  }
}
```

Here's the 'pure' function that processes it:

```js
 function pirates (state = [], action) {    //  state = [] - an ES6 default parameter
   if (action.type === 'ADD_PIRATE') {      //  ADD_PIRATE will be our example action
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

### push() vs concat()

`push()` is an impure ƒunction.

```js
var arr1 = ['a', 'b', 'c'];
var arr2 = ['d', 'e', 'f'];
var arr3 = arr1.push(arr2);
console.log(arr3); // 4
console.log(arr1); // ["a", "b", "c", ["d", "e", "f"]]
```

While `concat()` does not change the existing arrays, but instead returns a new array.

```js
var arr1 = ['a', 'b', 'c'];
var arr2 = ['d', 'e', 'f'];
var arr3 = arr1.concat(arr2);
console.log(arr3); //["a", "b", "c", "d", "e", "f"]
```

## Dispatch

`dispatch()` sends actions to the pirate function. That changes the state (in a predicable manner) and then `dispatch()` calls any listeners that have been passed in.

```js
const dispatch = (action) => {
  // call the pirate ƒunction
  state = pirates(state, action)
  // loop over and run the listeners
  listeners.forEach( (listener) => listener() )
}
```

e.g.:

```js
// REDUCER
function pirates (state = [], action) {
  if (action.type === 'ADD_PIRATE') {
    return state.concat([action.pirate])
  }
  return state
}

// STORE
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

Here is how we might call dispatch:

```js
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

## Running the Code

This can be run in the browser console.

Take two functions - `pirates()` and `createStore()`:

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

Run the following commands:

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

## Test: Take Two

An additional set of commands to try.

These can be run in the browser console but let's install [QuokkaJS](https://quokkajs.com/docs/index.html) in VSCode and try it there.

Copy and paste the Reducer and Store functions as per the first test and then run the following commands:

```js
const store = createStore()

const firstsubscriber = store.subscribe( () => {
  console.log('The first new state is: ', store.getState())
})

store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 2,
      name: 'Stanley Terror',
      complete: false,
    }
})

const secondsubscriber = store.subscribe( () => {
  console.log('The second new state is: ', store.getState())
})

firstsubscriber()

store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 2,
      name: 'Doug Terror',
      complete: false,
    }
})

store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 2,
      name: 'Doug Terror',
      complete: false,
    }
})
```

## Structural Change

We will pass in the pirates function (aka the "reducer function") when we call `createStore()` like this: `const store = createStore(pirates)`. This will enable users (here, developers) to pass in their own reducer function.

e.g.:

```js
// REDUCER ƒ will be created by the end user of our state management library
function pirates (state = [], action) {
 if (action.type === 'ADD_PIRATE') {
   return state.concat([action.pirate])
 }
 return state
}

// STORE the state management library
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
    state = reducer(state, action)
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

## Additional Actions

The reducer currently only handles one action: `action.type === 'ADD_PIRATE')`.

Add the other two actions using best practices (aka pure functions).

* REMOVE_PIRATE - filter out the pirate with a specific id:

```js
return state.filter((pirate) => pirate.id !== action.id)
```

* TOGGLE_PIRATE - here we are modifying a property inside the object, we need to be careful not to modify it directly (mutate it).

```js
state.map((pirate) => pirate.id !== action.id ? pirate : {
  name: pirate.name,
  id: pirate.id,
  complete: !pirate.complete
}
```

`pirate.id !== action.id ? pirate` - means, if the id _isn't_ a match don't process it but just add it to the array, otherwise (`:`) we set the name, id and value of completed to its opposite.  Remember `.map()` always returns an array of the same length as what's passed into it.

We are using a [ternary](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator here. You should become familiar with them as they are extremely common in React - mostly due to issues writing `if...then` statements in JSX.

Let's see it in context.

Here's the actions again for reference:

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
```

And here's the new pirates reducer:

```js
function pirates (state = [], action) {
 if (action.type === 'ADD_PIRATE') {
   return state.concat([action.pirate])
   // we already covered concat
 } else if (action.type === 'REMOVE_PIRATE'){
   return state.filter((pirate) => pirate.id !== action.id)
   // returns an array with all pirates except the one with the id
 } else if (action.type === 'TOGGLE_PIRATE'){
   state.map((pirate) => pirate.id !== action.id ? pirate : {
    name: pirate.name,
    id: pirate.id,
    complete: !pirate.complete
    })
    // maps the array, stopping only on the item where the id matches to toggle complete
 } else {
  return state
 }
}
```

The toggle action is fragile. If we start adding/changing properties it could fail. Use [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) instead:

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

The `Object.assign()` method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.

## Testing

In the console:

```js
// REDUCER
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

// STORE
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
  store.dispatch({
  type: 'ADD_PIRATE',
    pirate: {
      id: 1,
      name: 'Donald Trump',
      complete: true,
    }
  })
  store.dispatch({
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

It is something of a standard in the React community to use a [switch statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) instead of `else ... if`s. (Run the sample in Quokka.)

Refactor the pirates reducer to use a switch statement:

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

Assume we have an additional set of actions for a new state item which we'll call weapons:

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

When we create a store we pass a reducer:

`const store = createStore(pirates)`

But now we have multiple reducers.

The goal of a reducer is to get us to the next state. Because we have this new reducer we cannot use an an array. Instead of state being an array, we want state to be an object with a shape like this:

```js
{
  pirates: [],
  weapons: []
}
```

So we will create a new function that returns this shape:

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

The first time the app component is invoked, state will be empty. We will use ES6 [default params](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) again:

```js
function app (state = {}, action){
  return {
    pirates: pirates(state.pirates, action),
    weapons: weapons(state.weapons, action)
  }
}
```

Now state will be an object.

Let's test this in the console.

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

Run the following commands:

```js
const store = createStore(app)

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})
```

Now add all the dispatch calls below one at a time:

```js
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

Whenever we use the `ADD_PIRATE` action we are passing a string. Rather than using strings let's declare them as variables, e.g.:

```js
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

Here's the full implementation:

```js
const ADD_PIRATE = 'ADD_PIRATE'
const REMOVE_PIRATE = 'REMOVE_PIRATE'
const TOGGLE_PIRATE = 'TOGGLE_PIRATE'
const ADD_WEAPON = 'ADD_WEAPON'
const REMOVE_WEAPON = 'REMOVE_WEAPON'

function pirates (state = [], action) {
  switch(action.type) {
    case ADD_PIRATE : // we now use the variable
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

## Action Creators

Whenever we dispatch an action we are hard coding the object.

We will create functions that will return the actual action. This will help make our code a bit more portable. Also, action creators, like ternary operators and switch statements, are a community standard so you should try to become familiar with them.

```js
function addPirateAction(pirate){
  return {
    type: ADD_PIRATE,
    pirate
  }
}
```

They will be called like this:

```js
store.dispatch(addPirateAction({
  id: 0,
  name: 'Sam Spade',
  complete: false,
}))
```

Here are actions for all the items.

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

## Testing

Use this as the test script in Quokka:

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
const ADD_PIRATE = 'ADD_PIRATE'
const REMOVE_PIRATE = 'REMOVE_PIRATE'
const TOGGLE_PIRATE = 'TOGGLE_PIRATE'
const ADD_WEAPON = 'ADD_WEAPON'
const REMOVE_WEAPON = 'REMOVE_WEAPON'

function pirates (state = [], action) {
  switch(action.type) {
    case ADD_PIRATE : // we now use the variable
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
```

Now, we should be able to run the following commands. Note that the dispatches are now calling the functions:

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

<!-- Here is the entire Quokka script:

```js
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
``` -->

We have abstracted our actions into their own action creators. Now whenever you want to access and action you call it and pass in the data for that specific action.

## App UI - Vanilla JavaScript

The `createStore()` function creates state, returns state, creates listeners and updates state in the most predicatable manner possible.

Now we will build a front end for our state management system.

Create a new `index.html` in `test-one` with a link our scripts.

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

  <script type='text/javascript' src="js/scripts.js"></script>
  <script>
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
  </script>
</body>
</html>
```

Paste the following into the `scripts.js` file:

```js
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
```

Open the file in a browser and examine the console. You should see the same information as we saw in previously.

Delete the contents of the script tag in `index.html` so your html looks lke this:

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

  <script type='text/javascript' src="js/scripts.js"></script>
</body>
</html>
```

Add the following to the DOM (after the header):

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

Create a new JS file - `dom.js` and link it to index.html. 

Most of our work now will be done in this file.

In `dom.js`:

```js
const store = createStore(app)

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

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

Note `id: generateId()`. Add an id generator to `dom.js`:

```js
function generateId(){
  return Date.now()
}
```

Use it in a new `addWeapons()` function:

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

And test. The input fields should now be connected to the state.

<!-- Comment out the current dispatches: -->

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

We already have this script in dom.js:

```js
store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})
```

Let's replace it and subscribe separately to pirates and weapons.

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()
  console.log('weapons ', weapons)
  console.log('pirates ', pirates)
})
```

And test.

## Adding Elements to the DOM

We will loop over the items and throw them into the DOM.

First we will run `forEach()` against the two new ƒunctions:

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()
  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})
```

Then create the two add to dom functions. They are very are similar.

`addWeaponToDom`:

```js
function addWeaponToDom(weapon){
  const node = document.createElement('li')
  const text = document.createTextNode(weapon.name)
  node.appendChild(text)
  document.getElementById('weapons').appendChild(node)
}
```

`addPirateToDom`:

```js
function addPirateToDom(pirate){
  const node = document.createElement('li')
  const text = document.createTextNode(pirate.name)
  node.appendChild(text)
  document.getElementById('pirates').appendChild(node)
}
```

Try adding a pirates. Eveytime we add an item we are appending the previous items.

We'll clear the list items by emptying them prior to calling `forEach()`.

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()

  document.getElementById('pirates').innerHTML = ''
  document.getElementById('weapons').innerHTML = ''

  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})
```

## Toggle Pirate

Recall that only pirates have the 'complete' property. In our example it is intended to be used to toggle pirates as seen (or spotted, or eliminated...).

We'll add the toggle functionality to `addPirateToDom()` with a [ternary](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator:

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

We've added a `.style` inline style as well as an event listener.

## Dispatching Remove Items

Create a new function that returns a button.

```js
function createRemoveButton(onClick){
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = '✖︎'
  removeBtn.addEventListener('click', onClick)

  return removeBtn
}
```

We'll use it in `addPirateToDom()` first:

```js
function addPirateToDom(pirate){
  const node = document.createElement('li')
  const text = document.createTextNode(pirate.name)

  const removeBtn = createRemoveButton(() => { // create the button
    store.dispatch(removePirateAction(pirate.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn) // append it to the dom

  node.style.textDecoration = pirate.complete ? 'line-through' : 'none'
  node.addEventListener('click', () => {
    store.dispatch(togglePirateAction(pirate.id))
  })
  
  document.getElementById('pirates').appendChild(node)
}
```

Do the same for `addWeaponToDom()`:

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

Here is the complete DOM scripting portion of this exercise:

```js
const store = createStore(app)

document.getElementById('pirateBtn')
.addEventListener('click', addPirate)

document.getElementById('weaponBtn')
.addEventListener('click', addWeapon)

function generateId(){
  return Date.now()
}

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

function createRemoveButton(onClick){
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = 'x'
  removeBtn.addEventListener('click', onClick)

  return removeBtn
}
```

Congratulations! You have just created [Redux](https://redux.js.org/) and implemented a vanilla JS example of usage.

Let's test that statement.

Add this to the head of the html file.

```html
<script src='https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.min.js'></script>
```

Delete the create store function from `scripts.js`:

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

Now, instead of creating our store we will create a Redux store in `dom.js`:

```js
const store = Redux.createStore(app)
```

The root reducer is also provided by Redux. Delete the reducer in our scripts file:

```js
// function app (state = {}, action){
//   return {
//     pirates: pirates(state.pirates, action),
//     weapons: weapons(state.weapons, action)
//   }
// }
```

And edit our Redux store in the DOM script:

```js
// const store = Redux.createStore(app)
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}))
```

## Redux Middleware

Donald Trump is suing us for defamation. We need to display a warning whenever we add him to our state.

(Demo only) We could resolve this by creating a function in `scripts.js`:

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

And then call it wherever we currently call `store.dispatch` in the DOM scripts:

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

A better way would be to hook into the moment between when an action is dispatched and when the reducer runs. For this we'll use [Redux Middleware](https://redux.js.org/advanced/middleware).

Middleware is code you can put between the framework receiving a request, and the framework generating a response. It can be used for error reporting and routing.

(End demo.)

Here's an example in `scripts.js`:

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

[Currying](https://hackernoon.com/currying-in-js-d9ddc64f162e) - the process of breaking down a function into a series of functions that each take a single argument.

Delete the checkAndDispatch function and replace the `checkAndDispatch(store,` code with what we had before: `store.dispatch(...)`.

Tell Redux about the middleware.

<!-- ```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}))
``` -->

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}),Redux.applyMiddleware(checker))
```

And test in the browser.

Here's an ES6 version that leverages the arrow function and its implicit return:

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

We will log the action and the state to the console using middleware. This will help us track our actions and the state that is being returned.

In `scripts`:

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

In `dom.js`:

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

Keeping the existing vanilla JS app, add the following to the html. Note the new script's type `text/babel` (so we can use JSX):

```html
<hr />
<div id="app"></div>
...
<script type="text/babel" src="js/react-babel.js"></script>
```

Create the new js file and implement the main app component.

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

Add stubs for List, Weapons and Pirates components:

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
```

And render them via the main App:

```js
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
```

## Adding Items

Recall the `addPirate` function in the `dom.js` script:

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

We grabbed the value from the input and then called our store and dispatched `addPirateAction()` with the id, name and a default value for complete.

We will now implement this is the Pirates component using React.

Add a header, input field (using a ref) and a button:

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

Then add the addItem function:

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

We used `this.props.store` above.

Pass the store to the Pirate component via props from App

```js
// make the store available to Pirates
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
// make the store available to App
ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
)
```

Now that the Pirates component has access to store we can complete the addItem function:

```js
addItem = (e) => {
  e.preventDefault()
  const name = this.input.value
  this.input.value = ''
  this.props.store.dispatch(addPirateAction({
    id: generateId(),
    name,
    complete: false
  }))
}
```

You should now be able to add a pirate to state. 

Note that it shows up in the vanilla js (VJS) app. VJS is using the same store as our react app. We haven't implemented list in our React app yet. In effect, we have two apps which are sharing the same state.

## Dispatching Weapons

Pass store as props to the weapons component.

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

Edit Weapons to add a header, an input field and button as well:

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

Add the same addItem function to Weapons:

```js
class Weapons extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addWeaponAction({
      id: generateId(),
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

You should now be able to add a weapon to state.

Now, in order to get the fields to work we will render the Lists.

## Render the Lists

Grab the Pirates and the Weapons state and pass them to thier respective components:

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

Now the Pirates and Weapons component receive their respective states.

Pirates component:

```js
<List items={this.props.pirates}/>
```

Weapons component"

```js
<List items={this.props.weapons}/>
```

Inside the List component we want to take in the props and map through them to show them in the view. 

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
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

Now if we add a new pirate we are still not seeing the view yet. The list component isn't receiving any items.

This is because our App component isn't listening for changes to state. In our VJS app we used `store.subscribe()` to listen for updates to state:

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()

  document.getElementById('pirates').innerHTML = ''
  document.getElementById('weapons').innerHTML = ''

  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})
```

We want to cause a re-render which would normally be done by using `setState()`. But we do not have any state inside the App component. 

We will use a component lifecycle method and `forceUpdate()`:

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

`forceUpdate()` triggers React's render() method. It is a bit of a hack at the moment but I cannot see adding state to the app component at this time.

## Remove Items

Add remove item to react.

The List component should take another prop - remove: `<button onClick={ () => props.remove(item)}>✖︎</button>`.

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>✖︎</button>
        </li>
      ))}
    </ul>
  )
}
```

We pass in the item that should be removed. Now we need to create `removeItem()` inside the Pirates and Weapons components as well as pass it to the List component:

```js
removeItem = (weapon) => {
  this.props.store.dispatch(removePirateAction(weapon.id))
}
```

```js
<List
items={this.props.pirates}
remove={this.removeItem}
/>
```

As follows:

```js
class Pirates extends React.Component {
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addPirateAction({
      id: generateId(),
      name,
      complete: false
    }))
  }

  removeItem = (pirate) => {
    this.props.store.dispatch(removePirateAction(pirate.id))
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

In the Weapons component.

```js
class Weapons extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addWeaponAction({
      id: generateId(),
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

Add the toggle functionality that marks a Pirate as spotted.

The action in question is togglePirate. Add a method to the Pirate component:

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
      id: generateId(),
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

And call it in the List component:

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

And add styling:

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

## Notes

```js
function generateId () {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}
```

## Handling Asynchronous Data

Delete the vanilla JavaScript.