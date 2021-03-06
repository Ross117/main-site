---
author: Adam Collier
date: 2019-06-08
featuredImage: ./featured-image.jpg
title: Using React Context instead of Redux
---

Whilst learning react I have heard a lot of talk about Redux and that being the go to solution for state management in a web application. But as I've done a little bit of exploring and read countless articles there has also been a lot of people leaning on React Context instead since it's already included as an API in React.

I don't particularly know a lot about Redux and I certainly havent used it extensively but I decided to give React Context a whirl and see how I got on. The implementation I used was heavily (and I mean heavily) inspired by the one and only Kent C Dodds in his blog post [how to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively).

This was also using React Hooks which also got me a little excited (I've been a big fan since playing around with them)

I'll try and keep this as basic and understandable as possible, especially since I'm still getting my head around it all myself. I'll rename a lot of things so they are less specific to the example

Okay so lets start off my creating a `state-context.js` file with the following

```javascript
// src/state-context.js
import React from "react"

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()
```

What we are doing here is creating two different React Contexts. AppStateContext will be used to grab our app state to use in our application and AppDispatchContext to send "messages" to change our apps state. It's important to note that it could potentially be a single React Context but seperating it makes it a lot easier to understand.

Now we will need to create our provider to wrap our application

```javascript{8-37}
// src/state-context.js

import React from "react"

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()

function AppReducer(state, action) {
  switch (action.type) {
    case "increment": {
      return { count: state.count + 1 }
    }
    case "decrement": {
      return { count: state.count - 1 }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

let initialState = {
  count: 0,
}

function AppProvider({ children }) {
  const [appState, setAppState] = React.useReducer(AppReducer, initialState)
  return (
    <AppStateContext.Provider value={appState}>
      <AppDispatchContext.Provider value={setAppState}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export { AppProvider }
```

We have created a function called AppReducer which is where we will write all of our action types. This is essentially how we are going to change our state later on via dispatch. This will make sense in a little bit.

Then we are creating a function called AppProvider which we will export and use as a component to wrap our application. We are setting our state and initial state via `useReducer`.

By setting initialState, I can keep tabs on what exactly is being used and set in the Custom Provider. It doesnt need to be there but its just for my own sanity.

> > useReducer is an alternative to useState. Accepts a reducer of type (state, action) => newState, and returns the current state paired with a dispatch method.

Then all we are doing is returning our `AppStateContext` and `AppStateDispatch` components wrapping props.children.

For those who havent used props.children before you can think of it like this...

> > props.children is used to display whatever you include between the opening and closing tags when invoking a component.

You will notice that the value props differ, AppStateContext uses the current state and AppDispatchContext takes in the setAppState function which will update the state.

and then in the root of our application we can do something like

```javascript{8,11,13}
// src/index.js

import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { AppProvider } from "./state-context"

ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
```

Note: This is just a standard Create React App install.

This sets up the basic structure of our Custom Provider component, however we can create a better user experience by adding and exporting a couple of functions

```javascript{37-53}
// src/state-context.js

import React from "react"

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()

function AppReducer(state, action) {
  switch (action.type) {
    case "increment": {
      return { count: state.count + 1 }
    }
    case "decrement": {
      return { count: state.count - 1 }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

let initialState = {
  count: 0,
}

function AppProvider({ children }) {
  const [appState, setAppState] = React.useReducer(AppReducer, initialState)
  return (
    <AppStateContext.Provider value={appState}>
      <AppDispatchContext.Provider value={setAppState}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within a AppProvider")
  }
  return context
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext)
  if (context === undefined) {
    throw new Error("useAppDispatch must be used within a AppProvider")
  }
  return context
}

export { AppProvider, useAppState, useAppDispatch }
```

By adding these functions we can then use it like below

```javascript
// src/Components/Count.js

import React from "react"
import PropTypes from "prop-types"
import { useAppState, UseAppDispatch } from "../state-context.js"

const Count = props => {
  const dispatch = useAppDispatch()
  const { count } = useAppState()
  return (
    <div>
      <p>you've clicked me {count} times</p>
      <button onClick={() => dispatch({ type: "increment" })}>click me</button>
    </div>
  )
}

export default Count
```

This is a super simple implementation of course, but I think it should be helpful in understanding how you can use it. Something else to note is that you don't just have to pass a type, you can dispatch whatever you like alongside your type, There have been a few instances where I have dispatched the index when mapping through an array.

One downside I noticed whilst implementing this is if I wanted to use state from the Provider in App.js it would constantly try and re render (which basically broke the app). A workaround was to dispatch what I wanted to do instead and not use state in my App.js. There will probably be another solution and I will update this post when I come acrosss it. If you happen to know the solution I would be eternally grateful if you would share your wisdom ✌️

Hope this has been somewhat insightful and good luck with your React Context adventures!
