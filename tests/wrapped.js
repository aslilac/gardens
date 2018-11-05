(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('gardens')) :
  typeof define === 'function' && define.amd ? define(['gardens'], factory) :
  (global.testGardens = factory(global.gardens));
}(this, (function (defaultGarden) { 'use strict';

  defaultGarden = defaultGarden && defaultGarden.hasOwnProperty('default') ? defaultGarden['default'] : defaultGarden;

  function waitToEnd( garden, name ) {
    return new Promise( fulfill => setTimeout(() => {
      garden.timeEnd( name );
      fulfill();
    }, 333 ) )
  }

  let obj = {
    a: true,
    b: {
      c: false
    },
    d: 18,
    e: 'hello'
  };

  async function runTest( garden, next ) {
    garden.log( 'Object ->', obj, '<- there' );
    garden.debug( 'Hello debug sailor?' );
    garden.warning( 'Hello warning!' );
    garden.warn( 'Hello warn!', '\n' );

    garden.count();
    garden.count();
    garden.count( null, 'Should be the same counter as the two above' );

    garden.count( 'count', 'Should start at 1' );
    garden.count( 'count', 'because it uses a string' );

    garden.count( 2 );
    garden.count( 2 );

    let secret = Symbol( 'sailor' );
    garden.count( secret );
    garden.count( secret );

    garden.raw( '\n' );

    garden.time( '333ms' );
    await waitToEnd( garden, '333ms' );

    garden.time( 3 );
    garden.timeEnd( 3 );

    let immediate = Symbol( 'immediate' );
    garden.time( immediate );
    garden.time( immediate );
    garden.timeEnd( immediate );
    garden.timeEnd( immediate );
    garden.timeEnd( immediate ); // Should only throw warning on third time

    garden.raw( '\n' );

    garden.trace( 'This should trace, but only when verbose' );

    garden.error( 'This is an error!' );
    garden.typeerror( 'This is a typeerror!' );
    garden.referenceerror( 'This is a referenceerror!' );

    garden.catch( 'This should create an error' );

    garden.assert( true );
    garden.assert_eq( 1, 1 );

    try { garden.assert( false ); }
    catch ( err ) { garden.catch( err ); }

    try { garden.assert_eq( 1, 2 ); }
    catch ( err ) { garden.catch( err ); }

    next();
  }

  function testGardens( ...gardens ) {
    if ( gardens.length < 1 ) throw new Error( 'No garden given!' )

    defaultGarden.info( 'Warming up for tests' );

    return new Promise( ( fulfill, reject ) => {
      function iterate( index ) {
        defaultGarden.raw( '\n\n' );
        defaultGarden.info( `Beginning test #${index+1}.\n` );

        runTest( gardens[ index ], () => {
          if ( ++index < gardens.length ) return iterate( index )

          defaultGarden.raw( '\n\n' );
          defaultGarden.log( 'Done! Tests probably passed!' );
          defaultGarden.info( 'Note that seeing errors above does not indicate a fail.' );
          defaultGarden.info( 'Some tests are designed to check error handling behavior.' );
          fulfill();
        });
      }

      iterate( 0 );
    })
  }

  return testGardens;

})));
//# sourceMappingURL=wrapped.js.map