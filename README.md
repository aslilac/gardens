# gardens

Using gardens makes it easier to handle your log output and debugging code by giving you
the ability to break your output into named scopes, handle errors in a unified way, and use
the same library for it all regardless of what your deployment target is. It supports
scope nesting, custom colors and styles, time stamps, high resolution timing,
HTML output, and many other fun things!

A garden can be used interchangeably with `console`, and works basically
anywhere that JavaScript can run. If you want to add support for an environment that
I don't know about feel free to open an issue!

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /></br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /></br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /></br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /></br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /></br>Opera | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" /></br>Electron |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |

-   Node.js
-   Deno
-   React Native

![Code and output sample](/media/gardens.png)

## Installation

```Shell
yarn add gardens
```

You should use Yarn and [pnp](https://yarnpkg.com/en/docs/pnp).

## Usage

-   [Site](https://mckay.la/gardens/)
-   [Documentation](https://gardens.now.sh)

Depending on where you're using Gardens, you might need to do any of the following...

```JavaScript
// CommonJS (Node.js, Electron)
const gardens = require( 'gardens' );
```

```JavaScript
// CommonJS (React Native)
const gardens = require( 'gardens/native' );
```

```JavaScript
// Bundled ES6 (Browsers, Rollup, Webpack, Parcel, etc.)
import gardens from 'gardens';
```

```JavaScript
// ES6 (Deno)
import gardens from 'https://deno.land/x/gardens/mod.ts';
```

```HTML
<!-- <script> (Browsers) -->
<script type="application/javascript" src="https://unpkg.com/gardens@^4"></script>
```

### Managers

Managers are a really powerful way to use gardens for larger codebases. For details
on their usage and why you should use them, read their [documentation](/doc/managers.md).

### Configuration

Configurations can be set per instance, and updated at any time. Each garden
has the following options.

Note: The `scopeStyle` option is used to configure the style of the scope name when
printed. In Node.js and Deno it supports the `backgroundColor`, `color`, `fontStyle`,
`fontWeight`, and `textDecoration` CSS properties. Support in browsers should
technically be any CSS property, but the exact support depends on the implementation
of the browser itself.

```JavaScript
garden.configure({
  stream: {
    write() {
      // Anything with a write function will work
    }
  },
  outputType: 'ansi', // or 'console', 'html' or 'text',
  scopeStyle: {
    color: '#34dfcb',
    fontWeight: 700
  },
  verbose: true,
  displayDate: true,
  displayTime: true
})
```

### Configuring streams

For the sake of being easy to use with custom outputs, each garden only
cares that the stream given in its options implements a `write` method. One such
browserland object that already implements a write function is `document`, but I
would not recommend that, because it erases the previous contents, which is sad.

When setting a stream other than the default, the `outputType` is always set to
text to keep things simple. If you want colors, be sure to set this option correctly.

### log, info, success, warn, warning, and fail

These methods all just dump the arguments given out to the console like you would expect. The
output is prefixed with the scope name and output type. (log, warning, etc.)

```JavaScript
// These are all for general logging
garden.log( 'message' )
garden.info( 'new message' )
garden.success( 'yay!' )
garden.warn( 'uhh oh' )
garden.warning( 'also uhh oh' )
garden.fail( 'oh no!' )
```

### styled

Takes a string and a CSS-style object, and prints the string using the given styles.
Mostly useful in browsers where there is a lot of CSS console support.

```JavaScript
garden.styled( 'Look at me!', {
  backgroundColor: '#474350',
  color: '#b568b4',
  fontSize: '50px',
  fontWeight: 700,
})
```

### debug and trace

The debug method is similar to `log`, but it will only print if
`options.verbose` is truthy. If this is falsish then the call will do nothing.

The story for trace is similar, though it behaves more like `catch` than `log`, meaning
that if it is verbose, it will print a call stack.

```JavaScript
garden.configure({ verbose: true })
garden.debug( 'interesting information!' )
garden.trace( 'look at my call stack!' )
```

### error, typeerror, referenceerror, and catch

These methods will automagically create an `Error`, `TypeError` or `ReferenceError` using the
first argument as the message argument when constructing it. It will then log the error
including the full call stack for you to easily find where the error came from without
having to do the dirty work yourself. All you have to do is call one function with a
generic string as the argument. Easy peasy.

`catch` is similar to `error`, but will check if the first argument is already an error.
It will only generate a new `Error` itself if the first argument is not already an `Error`,
`TypeError`, or `ReferenceError`. If the value you are dealing with may or may not be
an error, and you don't want to manually check yourself, then use this method.

```JavaScript
garden.error( 'something went wrong!!1!' )
garden.typeerror( 'you gave me the incorrect thing!' )
garden.referenceerror( 'you gave me nothing!' )
garden.catch( aThrownError )
```

### time and timeEnd

Each method takes a String, Symbol, or undefined as the first argument. `time` should
be called at the begin of what you would like to time with a name or `Symbol` representing
what you are timing, and `timeEnd` should be called once the task has been completed with
the same name. The time taken to complete the task will be tracked with a precision of up
to 1 nano second, if the environment you're running supports high resolution timing.

```JavaScript
garden.time( name ) // Doesn't print anything
garden.timeEnd( name ) // Will print the time in between calling .time() and now

let tracker = Symbol()
garden.time( tracker )
garden.timeEnd( tracker )
```

### count

Takes a String, Symbol, or undefined as an argument, and then logs how many times `count`
has been called with that specific argument.

```JavaScript
garden.count() // 1
garden.count() // 2
garden.count( 'hello sailor' ) // 1
garden.count( 'hello sailor' ) // 2

let secret = Symbol()
garden.count( secret ) // 1
garden.count( secret ) // 2
```

### assert and friends

Four assert functions are also provided for the sake of completeness. `assert`
and `assert_eq` behave as you would expect. `deny` is basically `assert` but for
things that should be falsey. `throws` takes a function that should throw, and will
throw if it doesn't, but will catch the error if it does. Additional arguments can
be passed to provide additional details on what was expected, and possibly why
the assert fails.

```JavaScript
garden.assert( true, 'Expected to be true' ) // Does nothing
garden.assert( false, 'Expected to be true' ) // Throws

garden.assert_eq( 1, 1, 'Expect 1 to equal 1', stateOfSomethingRelated ) // Does nothing
garden.assert_eq( 1, 2, 'Expect 1 to equal 2', stateOfSomethingRelated ) // Throws

garden.deny( false, 'Expected to be false' ) // Does nothing
garden.deny( true, 'Expected to be false' ) // Throws

let variableThatDoesExist = true
garden.throws( () => someUndefinedVariable ) // Does nothing
garden.throws( () => variableThatDoesExist ) // Throws
```

### raw

Passes all given arguments directly to the output stream, without scopes, time stamps, or
any formatting. As the name implies, it just prints raw data.
