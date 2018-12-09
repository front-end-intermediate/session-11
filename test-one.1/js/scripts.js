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