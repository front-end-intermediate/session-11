# Twitter Layout

<pre>
App
  Nav
    UserAvatar (needs user prop)
  Body
    Sidebar
      Userstats (needs user prop)
    Content
</pre>

This app has the user’s information displayed in two places: in the nav bar at the top-right, and in the sidebar next to the main content.

With pure React (just regular props), we need to store the user’s info high enough in the tree that it can be passed down to the components that need it. In this case, the keeper of user info has to be App.

Then, in order to get the user info down to the components that need it, App needs to pass it along to Nav and Body. They, in turn, need to pass it down again, to UserAvatar and Sidebar. Finally, Sidebar has to pass it down to UserStats:

`App > Nav > UserAvatar`

and

`App > Body > Sidebar > UserStats`

## DEMO

(In reality these would probably be split out into separate files.)

App initializes the state to contain the `user` object – in a real app you’d fetch this data from a server and keep it in state for rendering.

In terms of prop drilling - it works just fine. Prop drilling is a perfectly valid pattern and core to the way React works. But deep drilling can be annoying to write and it gets more annoying when you have to pass down a lot of props (instead of just one).

There’s a bigger downside to prop drilling though: it creates coupling between components that would otherwise be decoupled. In the example above, Nav needs to accept a user prop and pass it down to UserAvatar, even though Nav does not have any need for the user otherwise.

Tightly-coupled components (like ones that forward props down to their children) are more difficult to reuse, because you’ve got to wire them up with their new parents whenever you use one in a new location.

## DEMO2

The user info has been moved to the Redux store, which means we can use react-redux’s connect function to directly inject the user prop into components that need it.

This is a big win in terms of decoupling. Take a look at Nav, Body, and Sidebar and you’ll see that they’re no longer accepting and passing dow the user prop. No more needless coupling.





