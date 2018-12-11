# XI State

## Homework

Work on your final projects. They should consist of a full stack (front and back end) master / detail view that uses React for the front end and has a backend which can be done in Express with mLab. You can use Firebase if you wish however be sure to use the same version of re-base that we used in session 10 - unless you really know what you are doing.

Implement the React portion of the exercise using Create React App.

## Reading


## Asynchronous Data

Add a script for the api.

```html
<script src="http://daniel.deverell.com/index.js"></script>
```

Offers an IIFE.

```js
> API
```

A fail function (once every five times). Default values via fetch pirates and fetch weapons.. 

```js
Promise.all([
  API.fetchPirates(),
  API.fetchWeapons()
]).then( ([pirates, weapons]) => {
  console.log('pirates', pirates)
  console.log('weapons', weapons)
})

store.subscribe( () => this.forceUpdate())
```

```js
const RECEIVE_DATA = 'RECEIVE_DATA'
...
function receiveDataAction( pirates, weapons) {
  return {
    type: RECEIVE_DATA,
    pirates,
    weapons
  }
}
...
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
    case RECEIVE_DATA:
      return action.pirates
    default :
    return state
  }
}
...
function weapons (state = [], action) {
  switch(action.type) {
    case ADD_WEAPON :
    return state.concat([action.weapon])
    case REMOVE_WEAPON :
      return state.filter((weapon) => weapon.id !== action.id)
    case RECEIVE_DATA:
      return action.weapons
    default :
    return state
  }
}
```

```js
componentDidMount () {
  const { store } = this.props

  Promise.all([
    API.fetchPirates(),
    API.fetchWeapons()
  ]).then( ([pirates, weapons]) => {
    store.dispatch(receiveDataAction(pirates, weapons))
    })
  
  store.subscribe( () => this.forceUpdate())
}
```

### Loading...

We will use the Redux store for the state.

```js
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false
    default:
      return state
  }
}
```


```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons,
  loading
}), Redux.applyMiddleware(checker, logger))
```

```js
class App extends React.Component {

  componentDidMount () {
    const { store } = this.props
  
    Promise.all([
      API.fetchPirates(),
      API.fetchWeapons()
    ]).then( ([pirates, weapons]) => {
      store.dispatch(receiveDataAction(pirates, weapons))
      })
    
    store.subscribe( () => this.forceUpdate())
  }

  render(){
    const { store } = this.props
    const { pirates, weapons, loading } = store.getState()

    if (loading === true) {
      return <h3>Loading...</h3>
    }

    return(
      <React.Fragment>
        <Pirates pirates={pirates} store ={store} />
        <Weapons weapons={weapons} store ={store} />
      </React.Fragment>
    )
  }
}
```

### Deleting Items

Update and and database.

