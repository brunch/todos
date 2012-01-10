(function(/*! Brunch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
}).call(this);// Make it safe to do console.log() always.
(function (con) {
  var method;
  var dummy = function() {};
  var methods = ('assert,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' + 
     'time,timeEnd,trace,warn').split(',');
  while (method = methods.pop()) {
    con[method] = con[method] || dummy;
  }
})(window.console = window.console || {});
/*!
 * jQuery JavaScript Library v1.7
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Nov 3 16:18:21 2011 -0400
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return obj != null && rdigit.test( obj ) && !isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					return deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var div = document.createElement( "div" ),
		documentElement = document.documentElement,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		support,
		fragment,
		body,
		testElementParent,
		testElement,
		testElementStyle,
		tds,
		events,
		eventName,
		i,
		isSupported;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/><nav></nav>";


	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName( "tbody" ).length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName( "link" ).length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure unknown elements (like HTML5 elems) are handled appropriately
		unknownElems: !!div.getElementsByTagName( "nav" ).length,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	div.innerHTML = "";

	// Figure out if the W3C box model works as expected
	div.style.width = div.style.paddingLeft = "1px";

	// We don't want to do body-related feature tests on frameset
	// documents, which lack a body. So we use
	// document.getElementsByTagName("body")[0], which is undefined in
	// frameset documents, while document.body isn’t. (7398)
	body = document.getElementsByTagName("body")[ 0 ];
	// We use our own, invisible, body unless the body is already present
	// in which case we use a div (#9239)
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		jQuery.extend( testElementStyle, {
			position: "absolute",
			left: "-999px",
			top: "-999px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	support.boxModel = div.offsetWidth === 2;

	if ( "zoom" in div.style ) {
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		// (IE < 8 does this)
		div.style.display = "inline";
		div.style.zoom = 1;
		support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

		// Check if elements with layout shrink-wrap their children
		// (IE 6 does this)
		div.style.display = "";
		div.innerHTML = "<div style='width:4px;'></div>";
		support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
	}

	div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
	tds = div.getElementsByTagName( "td" );

	// Check if table cells still have offsetWidth/Height when they are set
	// to display:none and there are still other visible table cells in a
	// table row; if so, offsetWidth/Height are not reliable for use when
	// determining if an element has been hidden directly using
	// display:none (it is still safe to use offsets if a parent element is
	// hidden; don safety goggles and see bug #4512 for more information).
	// (only IE 8 fails this test)
	isSupported = ( tds[ 0 ].offsetHeight === 0 );

	tds[ 0 ].style.display = "";
	tds[ 1 ].style.display = "none";

	// Check if empty table cells still have offsetWidth/Height
	// (IE < 8 fail this test)
	support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		} ) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run fixed position tests at doc ready to avoid a crash
	// related to the invisible body in IE8
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop = 1,
			ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",
			vb = "visibility:hidden;border:0;",
			style = "style='" + ptlm + "border:5px solid #000;padding:0;'",
			html = "<div " + style + "><div></div></div>" +
							"<table " + style + " cellpadding='0' cellspacing='0'>" +
							"<tr><td></td></tr></table>";

		// Reconstruct a container
		body = document.getElementsByTagName("body")[0];
		if ( !body ) {
			// Return for frameset docs that don't have a body
			// These tests cannot be done
			return;
		}

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct a test element
		testElement = document.createElement("div");
		testElement.style.cssText = ptlm + vb;

		testElement.innerHTML = html;
		container.appendChild( testElement );
		outer = testElement.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		testElement = container = null;

		jQuery.extend( support, offsetSupport );
	});

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );

	// Null connected elements to avoid leaks in IE
	testElement = fragment = select = opt = body = marginDiv = div = input = null;

	return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support space separated names
				if ( jQuery.isArray( name ) ) {
					name = name;
				} else if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return undefined;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( !("getAttribute" in elem) ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return undefined;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( elem.nodeType === 1 ) {
			attrNames = ( value || "" ).split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ].toLowerCase();
				propName = jQuery.propFix[ name ] || name;

				// See #9699 for explanation of this approach (setting first, then removal)
				jQuery.attr( elem, name, "" );
				elem.removeAttribute( getSetAttribute ? name : propName );

				// Set corresponding property to false for boolean attributes
				if ( rboolean.test( name ) && propName in elem ) {
					elem[ propName ] = false;
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspaces = / /g,
	rescape = /[^\w\s.|`]/g,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || elem.id === m[2]) &&
			(!m[3] || m[3].test( elem.className ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = hoverHack(types).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Delegated event; pre-analyze selector so it's processed quickly on event dispatch
			if ( selector ) {
				handleObj.quick = quickParse( selector );
				if ( !handleObj.quick && jQuery.expr.match.POS.test( selector ) ) {
					handleObj.isPositional = true;
				}
			}

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = hoverHack( types || "" ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				namespaces = namespaces? "." + namespaces : "";
				for ( j in events ) {
					jQuery.event.remove( elem, j + namespaces, handler, selector );
				}
				return;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Only need to loop for special events or selective removal
			if ( handler || namespaces || selector || special.remove ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( !handler || handler.guid === handleObj.guid ) {
						if ( !namespaces || namespaces.test( handleObj.namespace ) ) {
							if ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) {
								eventType.splice( j--, 1 );

								if ( handleObj.selector ) {
									eventType.delegateCount--;
								}
								if ( special.remove ) {
									special.remove.call( elem, handleObj );
								}
							}
						}
					}
				}
			} else {
				// Removing all events
				eventType.length = 0;
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
		}

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			old = null;
			for ( cur = elem.parentNode; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length; i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) ) {
				handle.apply( cur, data );
			}

			if ( event.isPropagationStopped() ) {
				break;
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			specialHandle = ( jQuery.event.special[ event.type ] || {} ).handle,
			handlerQueue = [],
			i, j, cur, ret, selMatch, matched, matches, handleObj, sel, hit, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;
					hit = selMatch[ sel ];

					if ( handleObj.isPositional ) {
						// Since .is() does not work for positionals; see http://jsfiddle.net/eJ4yd/3/
						hit = ( hit || (selMatch[ sel ] = jQuery( sel )) ).index( cur ) >= 0;
					} else if ( hit === undefined ) {
						hit = selMatch[ sel ] = ( handleObj.quick ? quickIs( cur, handleObj.quick ) : jQuery( cur ).is( sel ) );
					}
					if ( hit ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( specialHandle || handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement wheelDelta".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		focus: {
			delegateType: "focusin",
			noBubble: true
		},
		blur: {
			delegateType: "focusout",
			noBubble: true
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = jQuery.event.special[ fix ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				oldType, ret;

			// For a real mouseover/out, always call the handler; for
			// mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || handleObj.origType === event.type || (related !== target && !jQuery.contains( target, related )) ) {
				oldType = event.type;
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = oldType;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// Form was submitted, bubble the event up the tree
						if ( this.parentNode ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( " " ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr article aside audio canvas datalist details figcaption figure footer " +
		"header hgroup mark meter nav output progress section summary time video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames.replace(" ", "|") + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

  // Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(!jQuery.support.unknownElems && rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			jQuery.each( which, function() {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
				}
			});
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		jQuery.each( which, function() {
			val += parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
			}
		});
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var i,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, i ) {
				var hooks = data[ i ];
				jQuery.removeData( elem, i, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( i in data ) {
					if ( data[ i ].stop && i.indexOf(".run") === i.length - 4 ) {
						stopQueue( this, data, i );
					}
				}
			} else if ( data[ i = type + ".run" ] && data[ i ].stop ){
				stopQueue( this, data, i );
			}

			for ( i = timers.length; i--; ) {
				if ( timers[ i ].elem === this && (type == null || timers[ i ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ i ]( true );
					} else {
						timers[ i ].saveState();
					}
					hadTimers = true;
					timers.splice( i, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;
})( window );
//     Underscore.js 1.1.7
//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _;
    _._ = _;
  } else {
    // Exported as a string, for Closure Compiler "advanced" mode.
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.1.7';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result |= iterator.call(context, value, index, list)) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    any(obj, function(value) {
      if (found = value === target) return true;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method.call ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion produced by an iterator
  _.groupBy = function(obj, iterator) {
    var result = {};
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted) {
    return _.reduce(array, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo[memo.length] = el;
      return memo;
    }, []);
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and another.
  // Only the elements present in just the first array will remain.
  _.difference = function(array, other) {
    return _.filter(array, function(value){ return !_.include(other, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function(func, obj) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(obj, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        timeout = null;
        func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    return limit(func, wait, false);
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    return limit(func, wait, true);
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };


  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    if (b.isEqual) return b.isEqual(a);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return false;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
  };

  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
  // that does not equal itself.
  _.isNaN = function(obj) {
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();
//     Backbone.js 0.5.3
//     (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://documentcloud.github.com/backbone

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object.
  var root = this;

  // Save the previous value of the `Backbone` variable.
  var previousBackbone = root.Backbone;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.5.3';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore')._;

  // For Backbone's purposes, jQuery or Zepto owns the `$` variable.
  var $ = root.jQuery || root.Zepto;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option will
  // fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and set a
  // `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may `bind` or `unbind` a callback function to an event;
  // `trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.bind('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback` function.
    // Passing `"all"` will bind the callback to all events fired.
    bind : function(ev, callback, context) {
      var calls = this._callbacks || (this._callbacks = {});
      var list  = calls[ev] || (calls[ev] = []);
      list.push([callback, context]);
      return this;
    },

    // Remove one or many callbacks. If `callback` is null, removes all
    // callbacks for the event. If `ev` is null, removes all bound callbacks
    // for all events.
    unbind : function(ev, callback) {
      var calls;
      if (!ev) {
        this._callbacks = {};
      } else if (calls = this._callbacks) {
        if (!callback) {
          calls[ev] = [];
        } else {
          var list = calls[ev];
          if (!list) return this;
          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] && callback === list[i][0]) {
              list[i] = null;
              break;
            }
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger : function(eventName) {
      var list, calls, ev, callback, args;
      var both = 2;
      if (!(calls = this._callbacks)) return this;
      while (both--) {
        ev = both ? eventName : 'all';
        if (list = calls[ev]) {
          for (var i = 0, l = list.length; i < l; i++) {
            if (!(callback = list[i])) {
              list.splice(i, 1); i--; l--;
            } else {
              args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
              callback[0].apply(callback[1] || this, args);
            }
          }
        }
      }
      return this;
    }

  };

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (defaults = this.defaults) {
      if (_.isFunction(defaults)) defaults = defaults.call(this);
      attributes = _.extend({}, defaults, attributes);
    }
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.set(attributes, {silent : true});
    this._changed = false;
    this._previousAttributes = _.clone(this.attributes);
    if (options && options.collection) this.collection = options.collection;
    this.initialize(attributes, options);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // A snapshot of the model's previous attributes, taken immediately
    // after the last `"change"` event was fired.
    _previousAttributes : null,

    // Has the item been changed since the last `"change"` event?
    _changed : false,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute : 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Return a copy of the model's `attributes` object.
    toJSON : function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get : function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape : function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = escapeHTML(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has : function(attr) {
      return this.attributes[attr] != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless you
    // choose to silence it.
    set : function(attrs, options) {

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs.attributes) attrs = attrs.attributes;
      var now = this.attributes, escaped = this._escapedAttributes;

      // Run validation.
      if (!options.silent && this.validate && !this._performValidation(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // We're about to start triggering change events.
      var alreadyChanging = this._changing;
      this._changing = true;

      // Update attributes.
      for (var attr in attrs) {
        var val = attrs[attr];
        if (!_.isEqual(now[attr], val)) {
          now[attr] = val;
          delete escaped[attr];
          this._changed = true;
          if (!options.silent) this.trigger('change:' + attr, this, val, options);
        }
      }

      // Fire the `"change"` event, if the model has been changed.
      if (!alreadyChanging && !options.silent && this._changed) this.change(options);
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset : function(attr, options) {
      if (!(attr in this.attributes)) return this;
      options || (options = {});
      var value = this.attributes[attr];

      // Run validation.
      var validObj = {};
      validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      // Remove the attribute.
      delete this.attributes[attr];
      delete this._escapedAttributes[attr];
      if (attr == this.idAttribute) delete this.id;
      this._changed = true;
      if (!options.silent) {
        this.trigger('change:' + attr, this, void 0, options);
        this.change(options);
      }
      return this;
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear : function(options) {
      options || (options = {});
      var attr;
      var old = this.attributes;

      // Run validation.
      var validObj = {};
      for (attr in old) validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      this.attributes = {};
      this._escapedAttributes = {};
      this._changed = true;
      if (!options.silent) {
        for (attr in old) {
          this.trigger('change:' + attr, this, void 0, options);
        }
        this.change(options);
      }
      return this;
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch : function(options) {
      options || (options = {});
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save : function(attrs, options) {
      options || (options = {});
      if (attrs && !this.set(attrs, options)) return false;
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp, xhr);
      };
      options.error = wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      return (this.sync || Backbone.sync).call(this, method, this, options);
    },

    // Destroy this model on the server if it was already persisted. Upon success, the model is removed
    // from its collection, if it has one.
    destroy : function(options) {
      options || (options = {});
      if (this.isNew()) return this.trigger('destroy', this, this.collection, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        model.trigger('destroy', model, model.collection, options);
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'delete', this, options);
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url : function() {
      var base = getUrl(this.collection) || this.urlRoot || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse : function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone : function() {
      return new this.constructor(this);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew : function() {
      return this.id == null;
    },

    // Call this method to manually fire a `change` event for this model.
    // Calling this will cause all objects observing the model to update.
    change : function(options) {
      this.trigger('change', this, options);
      this._previousAttributes = _.clone(this.attributes);
      this._changed = false;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged : function(attr) {
      if (attr) return this._previousAttributes[attr] != this.attributes[attr];
      return this._changed;
    },

    // Return an object containing all the attributes that have changed, or false
    // if there are no changed attributes. Useful for determining what parts of a
    // view need to be updated and/or what attributes need to be persisted to
    // the server.
    changedAttributes : function(now) {
      now || (now = this.attributes);
      var old = this._previousAttributes;
      var changed = false;
      for (var attr in now) {
        if (!_.isEqual(old[attr], now[attr])) {
          changed = changed || {};
          changed[attr] = now[attr];
        }
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous : function(attr) {
      if (!attr || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes : function() {
      return _.clone(this._previousAttributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _performValidation : function(attrs, options) {
      var error = this.validate(attrs);
      if (error) {
        if (options.error) {
          options.error(this, error, options);
        } else {
          this.trigger('error', this, error, options);
        }
        return false;
      }
      return true;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) this.comparator = options.comparator;
    _.bindAll(this, '_onModelEvent', '_removeReference');
    this._reset();
    if (models) this.reset(models, {silent: true});
    this.initialize.apply(this, arguments);
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model : Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `added` event for every new model.
    add : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._add(models[i], options);
        }
      } else {
        this._add(models, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `removed` event for every model removed.
    remove : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._remove(models[i], options);
        }
      } else {
        this._remove(models, options);
      }
      return this;
    },

    // Get a model from the set by id.
    get : function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid : function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under normal
    // circumstances, as the set will maintain sort order as each item is added.
    sort : function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      this.models = this.sortBy(this.comparator);
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck : function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `added` or `removed` events. Fires `reset` when finished.
    reset : function(models, options) {
      models  || (models = []);
      options || (options = {});
      this.each(this._removeReference);
      this._reset();
      this.add(models, {silent: true});
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch : function(options) {
      options || (options = {});
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. After the model
    // has been created on the server, it will be added to the collection.
    // Returns the model, or 'false' if validation on a new model fails.
    create : function(model, options) {
      var coll = this;
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        coll.add(nextModel, options);
        if (success) success(nextModel, resp, xhr);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse : function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset : function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model to be added to this collection
    _prepareModel: function(model, options) {
      if (!(model instanceof Backbone.Model)) {
        var attrs = model;
        model = new this.model(attrs, {collection: this});
        if (model.validate && !model._performValidation(attrs, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal implementation of adding a single model to the set, updating
    // hash indexes for `id` and `cid` lookups.
    // Returns the model, or 'false' if validation on a new model fails.
    _add : function(model, options) {
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var already = this.getByCid(model);
      if (already) throw new Error(["Can't add the same model to a set twice", already.id]);
      this._byId[model.id] = model;
      this._byCid[model.cid] = model;
      var index = options.at != null ? options.at :
                  this.comparator ? this.sortedIndex(model, this.comparator) :
                  this.length;
      this.models.splice(index, 0, model);
      model.bind('all', this._onModelEvent);
      this.length++;
      if (!options.silent) model.trigger('add', model, this, options);
      return model;
    },

    // Internal implementation of removing a single model from the set, updating
    // hash indexes for `id` and `cid` lookups.
    _remove : function(model, options) {
      options || (options = {});
      model = this.getByCid(model) || this.get(model);
      if (!model) return null;
      delete this._byId[model.id];
      delete this._byCid[model.cid];
      this.models.splice(this.indexOf(model), 1);
      this.length--;
      if (!options.silent) model.trigger('remove', model, this, options);
      this._removeReference(model);
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference : function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.unbind('all', this._onModelEvent);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent : function(ev, model, collection, options) {
      if ((ev == 'add' || ev == 'remove') && collection != this) return;
      if (ev == 'destroy') {
        this._remove(model, options);
      }
      if (model && ev === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect',
    'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
    'first', 'rest', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:([\w\d]+)/g;
  var splatParam    = /\*([\w\d]+)/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Backbone.Router.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route : function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
      }, this));
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate : function(fragment, triggerRoute) {
      Backbone.history.navigate(fragment, triggerRoute);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes : function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp : function(route) {
      route = route.replace(escapeRegExp, "\\$&")
                   .replace(namedParam, "([^\/]*)")
                   .replace(splatParam, "(.*?)");
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters : function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning hashes.
  var hashStrip = /^#*/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  var historyStarted = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment : function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
          if (fragment.indexOf(this.options.root) == 0) fragment = fragment.substr(this.options.root.length);
        } else {
          fragment = window.location.hash;
        }
      }
      return decodeURIComponent(fragment.replace(hashStrip, ''));
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start : function(options) {

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      if (historyStarted) throw new Error("Backbone.history has already been started");
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if ('onhashchange' in window && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else {
        setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      historyStarted = true;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;
      if (this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = loc.hash.replace(hashStrip, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Add a route to be tested when the fragment changes. Routes added later may
    // override previous routes.
    route : function(route, callback) {
      this.handlers.unshift({route : route, callback : callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl : function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.iframe.location.hash);
      if (current == this.fragment || current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(window.location.hash);
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl : function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history. You are responsible for properly
    // URL-encoding the fragment in advance. This does not trigger
    // a `hashchange` event.
    navigate : function(fragment, triggerRoute) {
      var frag = (fragment || '').replace(hashStrip, '');
      if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;
      if (this._hasPushState) {
        var loc = window.location;
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history.pushState({}, document.title, loc.protocol + '//' + loc.host + frag);
      } else {
        window.location.hash = this.fragment = frag;
        if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
          this.iframe.document.open().close();
          this.iframe.location.hash = frag;
        }
      }
      if (triggerRoute) this.loadUrl(fragment);
    }

  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.delegateEvents();
    this.initialize.apply(this, arguments);
  };

  // Element lookup, scoped to DOM elements within the current view.
  // This should be prefered to global lookups, if you're dealing with
  // a specific view.
  var selectorDelegate = function(selector) {
    return $(selector, this.el);
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName : 'div',

    // Attach the `selectorDelegate` function as the `$` property.
    $       : selectorDelegate,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render : function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove : function() {
      $(this.el).remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make : function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Set callbacks, where `this.callbacks` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents : function(events) {
      if (!(events || (events = this.events))) return;
      if (_.isFunction(events)) events = events.call(this);
      $(this.el).unbind('.delegateEvents' + this.cid);
      for (var key in events) {
        var method = this[events[key]];
        if (!method) throw new Error('Event "' + events[key] + '" does not exist');
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          $(this.el).bind(eventName, method);
        } else {
          $(this.el).delegate(selector, eventName, method);
        }
      }
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure : function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` proeprties.
    _ensureElement : function() {
      if (!this.el) {
        var attrs = this.attributes || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.el = this.make(this.tagName, attrs);
      } else if (_.isString(this.el)) {
        this.el = $(this.el).get(0);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Router.extend = Backbone.View.extend = extend;

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, uses makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded` instead of
  // `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default JSON-request options.
    var params = _.extend({
      type:         type,
      dataType:     'json'
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
      params.url = getUrl(model) || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data        = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request.
    return $.ajax(params);
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a URL from a Model or Collection as a property
  // or as a function.
  var getUrl = function(object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(onError, model, options) {
    return function(resp) {
      if (onError) {
        onError(model, resp, options);
      } else {
        model.trigger('error', model, resp, options);
      }
    };
  };

  // Helper function to escape a string for HTML rendering.
  var escapeHTML = function(string) {
    return string.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

}).call(this);
/*!
 * jQuery UI 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(b,d){function e(g){return!b(g).parents().andSelf().filter(function(){return b.curCSS(this,"visibility")==="hidden"||b.expr.filters.hidden(this)}).length}b.ui=b.ui||{};if(!b.ui.version){b.extend(b.ui,{version:"1.8.11",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,
NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});b.fn.extend({_focus:b.fn.focus,focus:function(g,f){return typeof g==="number"?this.each(function(){var a=this;setTimeout(function(){b(a).focus();f&&f.call(a)},g)}):this._focus.apply(this,arguments)},scrollParent:function(){var g;g=b.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(b.curCSS(this,
"position",1))&&/(auto|scroll)/.test(b.curCSS(this,"overflow",1)+b.curCSS(this,"overflow-y",1)+b.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(b.curCSS(this,"overflow",1)+b.curCSS(this,"overflow-y",1)+b.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!g.length?b(document):g},zIndex:function(g){if(g!==d)return this.css("zIndex",g);if(this.length){g=b(this[0]);for(var f;g.length&&g[0]!==document;){f=g.css("position");
if(f==="absolute"||f==="relative"||f==="fixed"){f=parseInt(g.css("zIndex"),10);if(!isNaN(f)&&f!==0)return f}g=g.parent()}}return 0},disableSelection:function(){return this.bind((b.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(g){g.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});b.each(["Width","Height"],function(g,f){function a(j,n,p,l){b.each(c,function(){n-=parseFloat(b.curCSS(j,"padding"+this,true))||0;if(p)n-=parseFloat(b.curCSS(j,
"border"+this+"Width",true))||0;if(l)n-=parseFloat(b.curCSS(j,"margin"+this,true))||0});return n}var c=f==="Width"?["Left","Right"]:["Top","Bottom"],h=f.toLowerCase(),i={innerWidth:b.fn.innerWidth,innerHeight:b.fn.innerHeight,outerWidth:b.fn.outerWidth,outerHeight:b.fn.outerHeight};b.fn["inner"+f]=function(j){if(j===d)return i["inner"+f].call(this);return this.each(function(){b(this).css(h,a(this,j)+"px")})};b.fn["outer"+f]=function(j,n){if(typeof j!=="number")return i["outer"+f].call(this,j);return this.each(function(){b(this).css(h,
a(this,j,true,n)+"px")})}});b.extend(b.expr[":"],{data:function(g,f,a){return!!b.data(g,a[3])},focusable:function(g){var f=g.nodeName.toLowerCase(),a=b.attr(g,"tabindex");if("area"===f){f=g.parentNode;a=f.name;if(!g.href||!a||f.nodeName.toLowerCase()!=="map")return false;g=b("img[usemap=#"+a+"]")[0];return!!g&&e(g)}return(/input|select|textarea|button|object/.test(f)?!g.disabled:"a"==f?g.href||!isNaN(a):!isNaN(a))&&e(g)},tabbable:function(g){var f=b.attr(g,"tabindex");return(isNaN(f)||f>=0)&&b(g).is(":focusable")}});
b(function(){var g=document.body,f=g.appendChild(f=document.createElement("div"));b.extend(f.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});b.support.minHeight=f.offsetHeight===100;b.support.selectstart="onselectstart"in f;g.removeChild(f).style.display="none"});b.extend(b.ui,{plugin:{add:function(g,f,a){g=b.ui[g].prototype;for(var c in a){g.plugins[c]=g.plugins[c]||[];g.plugins[c].push([f,a[c]])}},call:function(g,f,a){if((f=g.plugins[f])&&g.element[0].parentNode)for(var c=0;c<f.length;c++)g.options[f[c][0]]&&
f[c][1].apply(g.element,a)}},contains:function(g,f){return document.compareDocumentPosition?g.compareDocumentPosition(f)&16:g!==f&&g.contains(f)},hasScroll:function(g,f){if(b(g).css("overflow")==="hidden")return false;f=f&&f==="left"?"scrollLeft":"scrollTop";var a=false;if(g[f]>0)return true;g[f]=1;a=g[f]>0;g[f]=0;return a},isOverAxis:function(g,f,a){return g>f&&g<f+a},isOver:function(g,f,a,c,h,i){return b.ui.isOverAxis(g,a,h)&&b.ui.isOverAxis(f,c,i)}})}})(jQuery);
(function(b,d){if(b.cleanData){var e=b.cleanData;b.cleanData=function(f){for(var a=0,c;(c=f[a])!=null;a++)b(c).triggerHandler("remove");e(f)}}else{var g=b.fn.remove;b.fn.remove=function(f,a){return this.each(function(){if(!a)if(!f||b.filter(f,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return g.call(b(this),f,a)})}}b.widget=function(f,a,c){var h=f.split(".")[0],i;f=f.split(".")[1];i=h+"-"+f;if(!c){c=a;a=b.Widget}b.expr[":"][i]=function(j){return!!b.data(j,
f)};b[h]=b[h]||{};b[h][f]=function(j,n){arguments.length&&this._createWidget(j,n)};a=new a;a.options=b.extend(true,{},a.options);b[h][f].prototype=b.extend(true,a,{namespace:h,widgetName:f,widgetEventPrefix:b[h][f].prototype.widgetEventPrefix||f,widgetBaseClass:i},c);b.widget.bridge(f,b[h][f])};b.widget.bridge=function(f,a){b.fn[f]=function(c){var h=typeof c==="string",i=Array.prototype.slice.call(arguments,1),j=this;c=!h&&i.length?b.extend.apply(null,[true,c].concat(i)):c;if(h&&c.charAt(0)==="_")return j;
h?this.each(function(){var n=b.data(this,f),p=n&&b.isFunction(n[c])?n[c].apply(n,i):n;if(p!==n&&p!==d){j=p;return false}}):this.each(function(){var n=b.data(this,f);n?n.option(c||{})._init():b.data(this,f,new a(c,this))});return j}};b.Widget=function(f,a){arguments.length&&this._createWidget(f,a)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(f,a){b.data(a,this.widgetName,this);this.element=b(a);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),f);var c=this;this.element.bind("remove."+this.widgetName,function(){c.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(f,a){var c=f;if(arguments.length===0)return b.extend({},this.options);if(typeof f==="string"){if(a===d)return this.options[f];c={};c[f]=a}this._setOptions(c);return this},_setOptions:function(f){var a=this;b.each(f,function(c,h){a._setOption(c,h)});return this},_setOption:function(f,a){this.options[f]=a;if(f==="disabled")this.widget()[a?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",a);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(f,a,c){var h=this.options[f];a=b.Event(a);a.type=(f===this.widgetEventPrefix?f:this.widgetEventPrefix+f).toLowerCase();c=c||{};if(a.originalEvent){f=b.event.props.length;for(var i;f;){i=b.event.props[--f];a[i]=a.originalEvent[i]}}this.element.trigger(a,c);return!(b.isFunction(h)&&h.call(this.element[0],a,c)===false||a.isDefaultPrevented())}}})(jQuery);
(function(b){b.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var d=this;this.element.bind("mousedown."+this.widgetName,function(e){return d._mouseDown(e)}).bind("click."+this.widgetName,function(e){if(true===b.data(e.target,d.widgetName+".preventClickEvent")){b.removeData(e.target,d.widgetName+".preventClickEvent");e.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(d){d.originalEvent=
d.originalEvent||{};if(!d.originalEvent.mouseHandled){this._mouseStarted&&this._mouseUp(d);this._mouseDownEvent=d;var e=this,g=d.which==1,f=typeof this.options.cancel=="string"?b(d.target).parents().add(d.target).filter(this.options.cancel).length:false;if(!g||f||!this._mouseCapture(d))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){e.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(d)&&this._mouseDelayMet(d)){this._mouseStarted=
this._mouseStart(d)!==false;if(!this._mouseStarted){d.preventDefault();return true}}true===b.data(d.target,this.widgetName+".preventClickEvent")&&b.removeData(d.target,this.widgetName+".preventClickEvent");this._mouseMoveDelegate=function(a){return e._mouseMove(a)};this._mouseUpDelegate=function(a){return e._mouseUp(a)};b(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);d.preventDefault();return d.originalEvent.mouseHandled=
true}},_mouseMove:function(d){if(b.browser.msie&&!(document.documentMode>=9)&&!d.button)return this._mouseUp(d);if(this._mouseStarted){this._mouseDrag(d);return d.preventDefault()}if(this._mouseDistanceMet(d)&&this._mouseDelayMet(d))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,d)!==false)?this._mouseDrag(d):this._mouseUp(d);return!this._mouseStarted},_mouseUp:function(d){b(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);
if(this._mouseStarted){this._mouseStarted=false;d.target==this._mouseDownEvent.target&&b.data(d.target,this.widgetName+".preventClickEvent",true);this._mouseStop(d)}return false},_mouseDistanceMet:function(d){return Math.max(Math.abs(this._mouseDownEvent.pageX-d.pageX),Math.abs(this._mouseDownEvent.pageY-d.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);
(function(b){b.widget("ui.draggable",b.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper==
"original"&&!/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position="relative";this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this}},_mouseCapture:function(d){var e=
this.options;if(this.helper||e.disabled||b(d.target).is(".ui-resizable-handle"))return false;this.handle=this._getHandle(d);if(!this.handle)return false;return true},_mouseStart:function(d){var e=this.options;this.helper=this._createHelper(d);this._cacheHelperProportions();if(b.ui.ddmanager)b.ui.ddmanager.current=this;this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-
this.margins.top,left:this.offset.left-this.margins.left};b.extend(this.offset,{click:{left:d.pageX-this.offset.left,top:d.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(d);this.originalPageX=d.pageX;this.originalPageY=d.pageY;e.cursorAt&&this._adjustOffsetFromHelper(e.cursorAt);e.containment&&this._setContainment();if(this._trigger("start",d)===false){this._clear();return false}this._cacheHelperProportions();
b.ui.ddmanager&&!e.dropBehaviour&&b.ui.ddmanager.prepareOffsets(this,d);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(d,true);return true},_mouseDrag:function(d,e){this.position=this._generatePosition(d);this.positionAbs=this._convertPositionTo("absolute");if(!e){e=this._uiHash();if(this._trigger("drag",d,e)===false){this._mouseUp({});return false}this.position=e.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||
this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";b.ui.ddmanager&&b.ui.ddmanager.drag(this,d);return false},_mouseStop:function(d){var e=false;if(b.ui.ddmanager&&!this.options.dropBehaviour)e=b.ui.ddmanager.drop(this,d);if(this.dropped){e=this.dropped;this.dropped=false}if((!this.element[0]||!this.element[0].parentNode)&&this.options.helper=="original")return false;if(this.options.revert=="invalid"&&!e||this.options.revert=="valid"&&e||this.options.revert===true||b.isFunction(this.options.revert)&&
this.options.revert.call(this.element,e)){var g=this;b(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){g._trigger("stop",d)!==false&&g._clear()})}else this._trigger("stop",d)!==false&&this._clear();return false},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(d){var e=!this.options.handle||!b(this.options.handle,this.element).length?true:false;b(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==
d.target)e=true});return e},_createHelper:function(d){var e=this.options;d=b.isFunction(e.helper)?b(e.helper.apply(this.element[0],[d])):e.helper=="clone"?this.element.clone():this.element;d.parents("body").length||d.appendTo(e.appendTo=="parent"?this.element[0].parentNode:e.appendTo);d[0]!=this.element[0]&&!/(fixed|absolute)/.test(d.css("position"))&&d.css("position","absolute");return d},_adjustOffsetFromHelper:function(d){if(typeof d=="string")d=d.split(" ");if(b.isArray(d))d={left:+d[0],top:+d[1]||
0};if("left"in d)this.offset.click.left=d.left+this.margins.left;if("right"in d)this.offset.click.left=this.helperProportions.width-d.right+this.margins.left;if("top"in d)this.offset.click.top=d.top+this.margins.top;if("bottom"in d)this.offset.click.top=this.helperProportions.height-d.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var d=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&b.ui.contains(this.scrollParent[0],
this.offsetParent[0])){d.left+=this.scrollParent.scrollLeft();d.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&b.browser.msie)d={top:0,left:0};return{top:d.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:d.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var d=this.element.position();return{top:d.top-
(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:d.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),
height:this.helper.outerHeight()}},_setContainment:function(){var d=this.options;if(d.containment=="parent")d.containment=this.helper[0].parentNode;if(d.containment=="document"||d.containment=="window")this.containment=[(d.containment=="document"?0:b(window).scrollLeft())-this.offset.relative.left-this.offset.parent.left,(d.containment=="document"?0:b(window).scrollTop())-this.offset.relative.top-this.offset.parent.top,(d.containment=="document"?0:b(window).scrollLeft())+b(d.containment=="document"?
document:window).width()-this.helperProportions.width-this.margins.left,(d.containment=="document"?0:b(window).scrollTop())+(b(d.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(d.containment)&&d.containment.constructor!=Array){var e=b(d.containment)[0];if(e){d=b(d.containment).offset();var g=b(e).css("overflow")!="hidden";this.containment=[d.left+(parseInt(b(e).css("borderLeftWidth"),
10)||0)+(parseInt(b(e).css("paddingLeft"),10)||0),d.top+(parseInt(b(e).css("borderTopWidth"),10)||0)+(parseInt(b(e).css("paddingTop"),10)||0),d.left+(g?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(b(e).css("borderLeftWidth"),10)||0)-(parseInt(b(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,d.top+(g?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(b(e).css("borderTopWidth"),10)||0)-(parseInt(b(e).css("paddingBottom"),
10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom]}}else if(d.containment.constructor==Array)this.containment=d.containment},_convertPositionTo:function(d,e){if(!e)e=this.position;d=d=="absolute"?1:-1;var g=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&b.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(g[0].tagName);return{top:e.top+this.offset.relative.top*d+this.offset.parent.top*d-(b.browser.safari&&
b.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:g.scrollTop())*d),left:e.left+this.offset.relative.left*d+this.offset.parent.left*d-(b.browser.safari&&b.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:g.scrollLeft())*d)}},_generatePosition:function(d){var e=this.options,g=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&b.ui.contains(this.scrollParent[0],
this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(g[0].tagName),a=d.pageX,c=d.pageY;if(this.originalPosition){if(this.containment){if(d.pageX-this.offset.click.left<this.containment[0])a=this.containment[0]+this.offset.click.left;if(d.pageY-this.offset.click.top<this.containment[1])c=this.containment[1]+this.offset.click.top;if(d.pageX-this.offset.click.left>this.containment[2])a=this.containment[2]+this.offset.click.left;if(d.pageY-this.offset.click.top>this.containment[3])c=
this.containment[3]+this.offset.click.top}if(e.grid){c=this.originalPageY+Math.round((c-this.originalPageY)/e.grid[1])*e.grid[1];c=this.containment?!(c-this.offset.click.top<this.containment[1]||c-this.offset.click.top>this.containment[3])?c:!(c-this.offset.click.top<this.containment[1])?c-e.grid[1]:c+e.grid[1]:c;a=this.originalPageX+Math.round((a-this.originalPageX)/e.grid[0])*e.grid[0];a=this.containment?!(a-this.offset.click.left<this.containment[0]||a-this.offset.click.left>this.containment[2])?
a:!(a-this.offset.click.left<this.containment[0])?a-e.grid[0]:a+e.grid[0]:a}}return{top:c-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(b.browser.safari&&b.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:g.scrollTop()),left:a-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(b.browser.safari&&b.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():
f?0:g.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=false},_trigger:function(d,e,g){g=g||this._uiHash();b.ui.plugin.call(this,d,[e,g]);if(d=="drag")this.positionAbs=this._convertPositionTo("absolute");return b.Widget.prototype._trigger.call(this,d,e,g)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,
offset:this.positionAbs}}});b.extend(b.ui.draggable,{version:"1.8.11"});b.ui.plugin.add("draggable","connectToSortable",{start:function(d,e){var g=b(this).data("draggable"),f=g.options,a=b.extend({},e,{item:g.element});g.sortables=[];b(f.connectToSortable).each(function(){var c=b.data(this,"sortable");if(c&&!c.options.disabled){g.sortables.push({instance:c,shouldRevert:c.options.revert});c.refreshPositions();c._trigger("activate",d,a)}})},stop:function(d,e){var g=b(this).data("draggable"),f=b.extend({},
e,{item:g.element});b.each(g.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;g.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert)this.instance.options.revert=true;this.instance._mouseStop(d);this.instance.options.helper=this.instance.options._helper;g.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",d,f)}})},drag:function(d,e){var g=
b(this).data("draggable"),f=this;b.each(g.sortables,function(){this.instance.positionAbs=g.positionAbs;this.instance.helperProportions=g.helperProportions;this.instance.offset.click=g.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=b(f).clone().appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return e.helper[0]};
d.target=this.instance.currentItem[0];this.instance._mouseCapture(d,true);this.instance._mouseStart(d,true,true);this.instance.offset.click.top=g.offset.click.top;this.instance.offset.click.left=g.offset.click.left;this.instance.offset.parent.left-=g.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=g.offset.parent.top-this.instance.offset.parent.top;g._trigger("toSortable",d);g.dropped=this.instance.element;g.currentItem=g.element;this.instance.fromOutside=g}this.instance.currentItem&&
this.instance._mouseDrag(d)}else if(this.instance.isOver){this.instance.isOver=0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",d,this.instance._uiHash(this.instance));this.instance._mouseStop(d,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder&&this.instance.placeholder.remove();g._trigger("fromSortable",d);g.dropped=false}})}});b.ui.plugin.add("draggable","cursor",
{start:function(){var d=b("body"),e=b(this).data("draggable").options;if(d.css("cursor"))e._cursor=d.css("cursor");d.css("cursor",e.cursor)},stop:function(){var d=b(this).data("draggable").options;d._cursor&&b("body").css("cursor",d._cursor)}});b.ui.plugin.add("draggable","iframeFix",{start:function(){var d=b(this).data("draggable").options;b(d.iframeFix===true?"iframe":d.iframeFix).each(function(){b('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+
"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(b(this).offset()).appendTo("body")})},stop:function(){b("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)})}});b.ui.plugin.add("draggable","opacity",{start:function(d,e){d=b(e.helper);e=b(this).data("draggable").options;if(d.css("opacity"))e._opacity=d.css("opacity");d.css("opacity",e.opacity)},stop:function(d,e){d=b(this).data("draggable").options;d._opacity&&b(e.helper).css("opacity",
d._opacity)}});b.ui.plugin.add("draggable","scroll",{start:function(){var d=b(this).data("draggable");if(d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML")d.overflowOffset=d.scrollParent.offset()},drag:function(d){var e=b(this).data("draggable"),g=e.options,f=false;if(e.scrollParent[0]!=document&&e.scrollParent[0].tagName!="HTML"){if(!g.axis||g.axis!="x")if(e.overflowOffset.top+e.scrollParent[0].offsetHeight-d.pageY<g.scrollSensitivity)e.scrollParent[0].scrollTop=f=e.scrollParent[0].scrollTop+
g.scrollSpeed;else if(d.pageY-e.overflowOffset.top<g.scrollSensitivity)e.scrollParent[0].scrollTop=f=e.scrollParent[0].scrollTop-g.scrollSpeed;if(!g.axis||g.axis!="y")if(e.overflowOffset.left+e.scrollParent[0].offsetWidth-d.pageX<g.scrollSensitivity)e.scrollParent[0].scrollLeft=f=e.scrollParent[0].scrollLeft+g.scrollSpeed;else if(d.pageX-e.overflowOffset.left<g.scrollSensitivity)e.scrollParent[0].scrollLeft=f=e.scrollParent[0].scrollLeft-g.scrollSpeed}else{if(!g.axis||g.axis!="x")if(d.pageY-b(document).scrollTop()<
g.scrollSensitivity)f=b(document).scrollTop(b(document).scrollTop()-g.scrollSpeed);else if(b(window).height()-(d.pageY-b(document).scrollTop())<g.scrollSensitivity)f=b(document).scrollTop(b(document).scrollTop()+g.scrollSpeed);if(!g.axis||g.axis!="y")if(d.pageX-b(document).scrollLeft()<g.scrollSensitivity)f=b(document).scrollLeft(b(document).scrollLeft()-g.scrollSpeed);else if(b(window).width()-(d.pageX-b(document).scrollLeft())<g.scrollSensitivity)f=b(document).scrollLeft(b(document).scrollLeft()+
g.scrollSpeed)}f!==false&&b.ui.ddmanager&&!g.dropBehaviour&&b.ui.ddmanager.prepareOffsets(e,d)}});b.ui.plugin.add("draggable","snap",{start:function(){var d=b(this).data("draggable"),e=d.options;d.snapElements=[];b(e.snap.constructor!=String?e.snap.items||":data(draggable)":e.snap).each(function(){var g=b(this),f=g.offset();this!=d.element[0]&&d.snapElements.push({item:this,width:g.outerWidth(),height:g.outerHeight(),top:f.top,left:f.left})})},drag:function(d,e){for(var g=b(this).data("draggable"),
f=g.options,a=f.snapTolerance,c=e.offset.left,h=c+g.helperProportions.width,i=e.offset.top,j=i+g.helperProportions.height,n=g.snapElements.length-1;n>=0;n--){var p=g.snapElements[n].left,l=p+g.snapElements[n].width,k=g.snapElements[n].top,m=k+g.snapElements[n].height;if(p-a<c&&c<l+a&&k-a<i&&i<m+a||p-a<c&&c<l+a&&k-a<j&&j<m+a||p-a<h&&h<l+a&&k-a<i&&i<m+a||p-a<h&&h<l+a&&k-a<j&&j<m+a){if(f.snapMode!="inner"){var o=Math.abs(k-j)<=a,q=Math.abs(m-i)<=a,s=Math.abs(p-h)<=a,r=Math.abs(l-c)<=a;if(o)e.position.top=
g._convertPositionTo("relative",{top:k-g.helperProportions.height,left:0}).top-g.margins.top;if(q)e.position.top=g._convertPositionTo("relative",{top:m,left:0}).top-g.margins.top;if(s)e.position.left=g._convertPositionTo("relative",{top:0,left:p-g.helperProportions.width}).left-g.margins.left;if(r)e.position.left=g._convertPositionTo("relative",{top:0,left:l}).left-g.margins.left}var u=o||q||s||r;if(f.snapMode!="outer"){o=Math.abs(k-i)<=a;q=Math.abs(m-j)<=a;s=Math.abs(p-c)<=a;r=Math.abs(l-h)<=a;if(o)e.position.top=
g._convertPositionTo("relative",{top:k,left:0}).top-g.margins.top;if(q)e.position.top=g._convertPositionTo("relative",{top:m-g.helperProportions.height,left:0}).top-g.margins.top;if(s)e.position.left=g._convertPositionTo("relative",{top:0,left:p}).left-g.margins.left;if(r)e.position.left=g._convertPositionTo("relative",{top:0,left:l-g.helperProportions.width}).left-g.margins.left}if(!g.snapElements[n].snapping&&(o||q||s||r||u))g.options.snap.snap&&g.options.snap.snap.call(g.element,d,b.extend(g._uiHash(),
{snapItem:g.snapElements[n].item}));g.snapElements[n].snapping=o||q||s||r||u}else{g.snapElements[n].snapping&&g.options.snap.release&&g.options.snap.release.call(g.element,d,b.extend(g._uiHash(),{snapItem:g.snapElements[n].item}));g.snapElements[n].snapping=false}}}});b.ui.plugin.add("draggable","stack",{start:function(){var d=b(this).data("draggable").options;d=b.makeArray(b(d.stack)).sort(function(g,f){return(parseInt(b(g).css("zIndex"),10)||0)-(parseInt(b(f).css("zIndex"),10)||0)});if(d.length){var e=
parseInt(d[0].style.zIndex)||0;b(d).each(function(g){this.style.zIndex=e+g});this[0].style.zIndex=e+d.length}}});b.ui.plugin.add("draggable","zIndex",{start:function(d,e){d=b(e.helper);e=b(this).data("draggable").options;if(d.css("zIndex"))e._zIndex=d.css("zIndex");d.css("zIndex",e.zIndex)},stop:function(d,e){d=b(this).data("draggable").options;d._zIndex&&b(e.helper).css("zIndex",d._zIndex)}})})(jQuery);
(function(b){b.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect"},_create:function(){var d=this.options,e=d.accept;this.isover=0;this.isout=1;this.accept=b.isFunction(e)?e:function(g){return g.is(e)};this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};b.ui.ddmanager.droppables[d.scope]=b.ui.ddmanager.droppables[d.scope]||[];b.ui.ddmanager.droppables[d.scope].push(this);
d.addClasses&&this.element.addClass("ui-droppable")},destroy:function(){for(var d=b.ui.ddmanager.droppables[this.options.scope],e=0;e<d.length;e++)d[e]==this&&d.splice(e,1);this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");return this},_setOption:function(d,e){if(d=="accept")this.accept=b.isFunction(e)?e:function(g){return g.is(e)};b.Widget.prototype._setOption.apply(this,arguments)},_activate:function(d){var e=b.ui.ddmanager.current;this.options.activeClass&&
this.element.addClass(this.options.activeClass);e&&this._trigger("activate",d,this.ui(e))},_deactivate:function(d){var e=b.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass);e&&this._trigger("deactivate",d,this.ui(e))},_over:function(d){var e=b.ui.ddmanager.current;if(!(!e||(e.currentItem||e.element)[0]==this.element[0]))if(this.accept.call(this.element[0],e.currentItem||e.element)){this.options.hoverClass&&this.element.addClass(this.options.hoverClass);
this._trigger("over",d,this.ui(e))}},_out:function(d){var e=b.ui.ddmanager.current;if(!(!e||(e.currentItem||e.element)[0]==this.element[0]))if(this.accept.call(this.element[0],e.currentItem||e.element)){this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);this._trigger("out",d,this.ui(e))}},_drop:function(d,e){var g=e||b.ui.ddmanager.current;if(!g||(g.currentItem||g.element)[0]==this.element[0])return false;var f=false;this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var a=
b.data(this,"droppable");if(a.options.greedy&&!a.options.disabled&&a.options.scope==g.options.scope&&a.accept.call(a.element[0],g.currentItem||g.element)&&b.ui.intersect(g,b.extend(a,{offset:a.element.offset()}),a.options.tolerance)){f=true;return false}});if(f)return false;if(this.accept.call(this.element[0],g.currentItem||g.element)){this.options.activeClass&&this.element.removeClass(this.options.activeClass);this.options.hoverClass&&this.element.removeClass(this.options.hoverClass);this._trigger("drop",
d,this.ui(g));return this.element}return false},ui:function(d){return{draggable:d.currentItem||d.element,helper:d.helper,position:d.position,offset:d.positionAbs}}});b.extend(b.ui.droppable,{version:"1.8.11"});b.ui.intersect=function(d,e,g){if(!e.offset)return false;var f=(d.positionAbs||d.position.absolute).left,a=f+d.helperProportions.width,c=(d.positionAbs||d.position.absolute).top,h=c+d.helperProportions.height,i=e.offset.left,j=i+e.proportions.width,n=e.offset.top,p=n+e.proportions.height;
switch(g){case "fit":return i<=f&&a<=j&&n<=c&&h<=p;case "intersect":return i<f+d.helperProportions.width/2&&a-d.helperProportions.width/2<j&&n<c+d.helperProportions.height/2&&h-d.helperProportions.height/2<p;case "pointer":return b.ui.isOver((d.positionAbs||d.position.absolute).top+(d.clickOffset||d.offset.click).top,(d.positionAbs||d.position.absolute).left+(d.clickOffset||d.offset.click).left,n,i,e.proportions.height,e.proportions.width);case "touch":return(c>=n&&c<=p||h>=n&&h<=p||c<n&&h>p)&&(f>=
i&&f<=j||a>=i&&a<=j||f<i&&a>j);default:return false}};b.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(d,e){var g=b.ui.ddmanager.droppables[d.options.scope]||[],f=e?e.type:null,a=(d.currentItem||d.element).find(":data(droppable)").andSelf(),c=0;a:for(;c<g.length;c++)if(!(g[c].options.disabled||d&&!g[c].accept.call(g[c].element[0],d.currentItem||d.element))){for(var h=0;h<a.length;h++)if(a[h]==g[c].element[0]){g[c].proportions.height=0;continue a}g[c].visible=g[c].element.css("display")!=
"none";if(g[c].visible){f=="mousedown"&&g[c]._activate.call(g[c],e);g[c].offset=g[c].element.offset();g[c].proportions={width:g[c].element[0].offsetWidth,height:g[c].element[0].offsetHeight}}}},drop:function(d,e){var g=false;b.each(b.ui.ddmanager.droppables[d.options.scope]||[],function(){if(this.options){if(!this.options.disabled&&this.visible&&b.ui.intersect(d,this,this.options.tolerance))g=g||this._drop.call(this,e);if(!this.options.disabled&&this.visible&&this.accept.call(this.element[0],d.currentItem||
d.element)){this.isout=1;this.isover=0;this._deactivate.call(this,e)}}});return g},drag:function(d,e){d.options.refreshPositions&&b.ui.ddmanager.prepareOffsets(d,e);b.each(b.ui.ddmanager.droppables[d.options.scope]||[],function(){if(!(this.options.disabled||this.greedyChild||!this.visible)){var g=b.ui.intersect(d,this,this.options.tolerance);if(g=!g&&this.isover==1?"isout":g&&this.isover==0?"isover":null){var f;if(this.options.greedy){var a=this.element.parents(":data(droppable):eq(0)");if(a.length){f=
b.data(a[0],"droppable");f.greedyChild=g=="isover"?1:0}}if(f&&g=="isover"){f.isover=0;f.isout=1;f._out.call(f,e)}this[g]=1;this[g=="isout"?"isover":"isout"]=0;this[g=="isover"?"_over":"_out"].call(this,e);if(f&&g=="isout"){f.isout=0;f.isover=1;f._over.call(f,e)}}}})}}})(jQuery);
(function(b){b.widget("ui.resizable",b.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:false,animate:false,animateDuration:"slow",animateEasing:"swing",aspectRatio:false,autoHide:false,containment:false,ghost:false,grid:false,handles:"e,s,se",helper:false,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1E3},_create:function(){var g=this,f=this.options;this.element.addClass("ui-resizable");b.extend(this,{_aspectRatio:!!f.aspectRatio,aspectRatio:f.aspectRatio,originalElement:this.element,
_proportionallyResizeElements:[],_helper:f.helper||f.ghost||f.animate?f.helper||"ui-resizable-helper":null});if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)){/relative/.test(this.element.css("position"))&&b.browser.opera&&this.element.css({position:"relative",top:"auto",left:"auto"});this.element.wrap(b('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),
top:this.element.css("top"),left:this.element.css("left")}));this.element=this.element.parent().data("resizable",this.element.data("resizable"));this.elementIsWrapper=true;this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")});this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});this.originalResizeStyle=
this.originalElement.css("resize");this.originalElement.css("resize","none");this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"}));this.originalElement.css({margin:this.originalElement.css("margin")});this._proportionallyResize()}this.handles=f.handles||(!b(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",
nw:".ui-resizable-nw"});if(this.handles.constructor==String){if(this.handles=="all")this.handles="n,e,s,w,se,sw,ne,nw";var a=this.handles.split(",");this.handles={};for(var c=0;c<a.length;c++){var h=b.trim(a[c]),i=b('<div class="ui-resizable-handle '+("ui-resizable-"+h)+'"></div>');/sw|se|ne|nw/.test(h)&&i.css({zIndex:++f.zIndex});"se"==h&&i.addClass("ui-icon ui-icon-gripsmall-diagonal-se");this.handles[h]=".ui-resizable-"+h;this.element.append(i)}}this._renderAxis=function(j){j=j||this.element;for(var n in this.handles){if(this.handles[n].constructor==
String)this.handles[n]=b(this.handles[n],this.element).show();if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var p=b(this.handles[n],this.element),l=0;l=/sw|ne|nw|se|n|s/.test(n)?p.outerHeight():p.outerWidth();p=["padding",/ne|nw|n/.test(n)?"Top":/se|sw|s/.test(n)?"Bottom":/^e$/.test(n)?"Right":"Left"].join("");j.css(p,l);this._proportionallyResize()}b(this.handles[n])}};this._renderAxis(this.element);this._handles=b(".ui-resizable-handle",this.element).disableSelection();
this._handles.mouseover(function(){if(!g.resizing){if(this.className)var j=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);g.axis=j&&j[1]?j[1]:"se"}});if(f.autoHide){this._handles.hide();b(this.element).addClass("ui-resizable-autohide").hover(function(){b(this).removeClass("ui-resizable-autohide");g._handles.show()},function(){if(!g.resizing){b(this).addClass("ui-resizable-autohide");g._handles.hide()}})}this._mouseInit()},destroy:function(){this._mouseDestroy();var g=function(a){b(a).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};
if(this.elementIsWrapper){g(this.element);var f=this.element;f.after(this.originalElement.css({position:f.css("position"),width:f.outerWidth(),height:f.outerHeight(),top:f.css("top"),left:f.css("left")})).remove()}this.originalElement.css("resize",this.originalResizeStyle);g(this.originalElement);return this},_mouseCapture:function(g){var f=false;for(var a in this.handles)if(b(this.handles[a])[0]==g.target)f=true;return!this.options.disabled&&f},_mouseStart:function(g){var f=this.options,a=this.element.position(),
c=this.element;this.resizing=true;this.documentScroll={top:b(document).scrollTop(),left:b(document).scrollLeft()};if(c.is(".ui-draggable")||/absolute/.test(c.css("position")))c.css({position:"absolute",top:a.top,left:a.left});b.browser.opera&&/relative/.test(c.css("position"))&&c.css({position:"relative",top:"auto",left:"auto"});this._renderProxy();a=d(this.helper.css("left"));var h=d(this.helper.css("top"));if(f.containment){a+=b(f.containment).scrollLeft()||0;h+=b(f.containment).scrollTop()||0}this.offset=
this.helper.offset();this.position={left:a,top:h};this.size=this._helper?{width:c.outerWidth(),height:c.outerHeight()}:{width:c.width(),height:c.height()};this.originalSize=this._helper?{width:c.outerWidth(),height:c.outerHeight()}:{width:c.width(),height:c.height()};this.originalPosition={left:a,top:h};this.sizeDiff={width:c.outerWidth()-c.width(),height:c.outerHeight()-c.height()};this.originalMousePosition={left:g.pageX,top:g.pageY};this.aspectRatio=typeof f.aspectRatio=="number"?f.aspectRatio:
this.originalSize.width/this.originalSize.height||1;f=b(".ui-resizable-"+this.axis).css("cursor");b("body").css("cursor",f=="auto"?this.axis+"-resize":f);c.addClass("ui-resizable-resizing");this._propagate("start",g);return true},_mouseDrag:function(g){var f=this.helper,a=this.originalMousePosition,c=this._change[this.axis];if(!c)return false;a=c.apply(this,[g,g.pageX-a.left||0,g.pageY-a.top||0]);if(this._aspectRatio||g.shiftKey)a=this._updateRatio(a,g);a=this._respectSize(a,g);this._propagate("resize",
g);f.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"});!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize();this._updateCache(a);this._trigger("resize",g,this.ui());return false},_mouseStop:function(g){this.resizing=false;var f=this.options,a=this;if(this._helper){var c=this._proportionallyResizeElements,h=c.length&&/textarea/i.test(c[0].nodeName);c=h&&b.ui.hasScroll(c[0],"left")?0:a.sizeDiff.height;
h=h?0:a.sizeDiff.width;h={width:a.helper.width()-h,height:a.helper.height()-c};c=parseInt(a.element.css("left"),10)+(a.position.left-a.originalPosition.left)||null;var i=parseInt(a.element.css("top"),10)+(a.position.top-a.originalPosition.top)||null;f.animate||this.element.css(b.extend(h,{top:i,left:c}));a.helper.height(a.size.height);a.helper.width(a.size.width);this._helper&&!f.animate&&this._proportionallyResize()}b("body").css("cursor","auto");this.element.removeClass("ui-resizable-resizing");
this._propagate("stop",g);this._helper&&this.helper.remove();return false},_updateCache:function(g){this.offset=this.helper.offset();if(e(g.left))this.position.left=g.left;if(e(g.top))this.position.top=g.top;if(e(g.height))this.size.height=g.height;if(e(g.width))this.size.width=g.width},_updateRatio:function(g){var f=this.position,a=this.size,c=this.axis;if(g.height)g.width=a.height*this.aspectRatio;else if(g.width)g.height=a.width/this.aspectRatio;if(c=="sw"){g.left=f.left+(a.width-g.width);g.top=
null}if(c=="nw"){g.top=f.top+(a.height-g.height);g.left=f.left+(a.width-g.width)}return g},_respectSize:function(g){var f=this.options,a=this.axis,c=e(g.width)&&f.maxWidth&&f.maxWidth<g.width,h=e(g.height)&&f.maxHeight&&f.maxHeight<g.height,i=e(g.width)&&f.minWidth&&f.minWidth>g.width,j=e(g.height)&&f.minHeight&&f.minHeight>g.height;if(i)g.width=f.minWidth;if(j)g.height=f.minHeight;if(c)g.width=f.maxWidth;if(h)g.height=f.maxHeight;var n=this.originalPosition.left+this.originalSize.width,p=this.position.top+
this.size.height,l=/sw|nw|w/.test(a);a=/nw|ne|n/.test(a);if(i&&l)g.left=n-f.minWidth;if(c&&l)g.left=n-f.maxWidth;if(j&&a)g.top=p-f.minHeight;if(h&&a)g.top=p-f.maxHeight;if((f=!g.width&&!g.height)&&!g.left&&g.top)g.top=null;else if(f&&!g.top&&g.left)g.left=null;return g},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var g=this.helper||this.element,f=0;f<this._proportionallyResizeElements.length;f++){var a=this._proportionallyResizeElements[f];if(!this.borderDif){var c=
[a.css("borderTopWidth"),a.css("borderRightWidth"),a.css("borderBottomWidth"),a.css("borderLeftWidth")],h=[a.css("paddingTop"),a.css("paddingRight"),a.css("paddingBottom"),a.css("paddingLeft")];this.borderDif=b.map(c,function(i,j){i=parseInt(i,10)||0;j=parseInt(h[j],10)||0;return i+j})}b.browser.msie&&(b(g).is(":hidden")||b(g).parents(":hidden").length)||a.css({height:g.height()-this.borderDif[0]-this.borderDif[2]||0,width:g.width()-this.borderDif[1]-this.borderDif[3]||0})}},_renderProxy:function(){var g=
this.options;this.elementOffset=this.element.offset();if(this._helper){this.helper=this.helper||b('<div style="overflow:hidden;"></div>');var f=b.browser.msie&&b.browser.version<7,a=f?1:0;f=f?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+f,height:this.element.outerHeight()+f,position:"absolute",left:this.elementOffset.left-a+"px",top:this.elementOffset.top-a+"px",zIndex:++g.zIndex});this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(g,
f){return{width:this.originalSize.width+f}},w:function(g,f){return{left:this.originalPosition.left+f,width:this.originalSize.width-f}},n:function(g,f,a){return{top:this.originalPosition.top+a,height:this.originalSize.height-a}},s:function(g,f,a){return{height:this.originalSize.height+a}},se:function(g,f,a){return b.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[g,f,a]))},sw:function(g,f,a){return b.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[g,f,
a]))},ne:function(g,f,a){return b.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[g,f,a]))},nw:function(g,f,a){return b.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[g,f,a]))}},_propagate:function(g,f){b.ui.plugin.call(this,g,[f,this.ui()]);g!="resize"&&this._trigger(g,f,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,
originalPosition:this.originalPosition}}});b.extend(b.ui.resizable,{version:"1.8.11"});b.ui.plugin.add("resizable","alsoResize",{start:function(){var g=b(this).data("resizable").options,f=function(a){b(a).each(function(){var c=b(this);c.data("resizable-alsoresize",{width:parseInt(c.width(),10),height:parseInt(c.height(),10),left:parseInt(c.css("left"),10),top:parseInt(c.css("top"),10),position:c.css("position")})})};if(typeof g.alsoResize=="object"&&!g.alsoResize.parentNode)if(g.alsoResize.length){g.alsoResize=
g.alsoResize[0];f(g.alsoResize)}else b.each(g.alsoResize,function(a){f(a)});else f(g.alsoResize)},resize:function(g,f){var a=b(this).data("resizable");g=a.options;var c=a.originalSize,h=a.originalPosition,i={height:a.size.height-c.height||0,width:a.size.width-c.width||0,top:a.position.top-h.top||0,left:a.position.left-h.left||0},j=function(n,p){b(n).each(function(){var l=b(this),k=b(this).data("resizable-alsoresize"),m={},o=p&&p.length?p:l.parents(f.originalElement[0]).length?["width","height"]:["width",
"height","top","left"];b.each(o,function(q,s){if((q=(k[s]||0)+(i[s]||0))&&q>=0)m[s]=q||null});if(b.browser.opera&&/relative/.test(l.css("position"))){a._revertToRelativePosition=true;l.css({position:"absolute",top:"auto",left:"auto"})}l.css(m)})};typeof g.alsoResize=="object"&&!g.alsoResize.nodeType?b.each(g.alsoResize,function(n,p){j(n,p)}):j(g.alsoResize)},stop:function(){var g=b(this).data("resizable"),f=g.options,a=function(c){b(c).each(function(){var h=b(this);h.css({position:h.data("resizable-alsoresize").position})})};
if(g._revertToRelativePosition){g._revertToRelativePosition=false;typeof f.alsoResize=="object"&&!f.alsoResize.nodeType?b.each(f.alsoResize,function(c){a(c)}):a(f.alsoResize)}b(this).removeData("resizable-alsoresize")}});b.ui.plugin.add("resizable","animate",{stop:function(g){var f=b(this).data("resizable"),a=f.options,c=f._proportionallyResizeElements,h=c.length&&/textarea/i.test(c[0].nodeName),i=h&&b.ui.hasScroll(c[0],"left")?0:f.sizeDiff.height;h={width:f.size.width-(h?0:f.sizeDiff.width),height:f.size.height-
i};i=parseInt(f.element.css("left"),10)+(f.position.left-f.originalPosition.left)||null;var j=parseInt(f.element.css("top"),10)+(f.position.top-f.originalPosition.top)||null;f.element.animate(b.extend(h,j&&i?{top:j,left:i}:{}),{duration:a.animateDuration,easing:a.animateEasing,step:function(){var n={width:parseInt(f.element.css("width"),10),height:parseInt(f.element.css("height"),10),top:parseInt(f.element.css("top"),10),left:parseInt(f.element.css("left"),10)};c&&c.length&&b(c[0]).css({width:n.width,
height:n.height});f._updateCache(n);f._propagate("resize",g)}})}});b.ui.plugin.add("resizable","containment",{start:function(){var g=b(this).data("resizable"),f=g.element,a=g.options.containment;if(f=a instanceof b?a.get(0):/parent/.test(a)?f.parent().get(0):a){g.containerElement=b(f);if(/document/.test(a)||a==document){g.containerOffset={left:0,top:0};g.containerPosition={left:0,top:0};g.parentData={element:b(document),left:0,top:0,width:b(document).width(),height:b(document).height()||document.body.parentNode.scrollHeight}}else{var c=
b(f),h=[];b(["Top","Right","Left","Bottom"]).each(function(n,p){h[n]=d(c.css("padding"+p))});g.containerOffset=c.offset();g.containerPosition=c.position();g.containerSize={height:c.innerHeight()-h[3],width:c.innerWidth()-h[1]};a=g.containerOffset;var i=g.containerSize.height,j=g.containerSize.width;j=b.ui.hasScroll(f,"left")?f.scrollWidth:j;i=b.ui.hasScroll(f)?f.scrollHeight:i;g.parentData={element:f,left:a.left,top:a.top,width:j,height:i}}}},resize:function(g){var f=b(this).data("resizable"),a=f.options,
c=f.containerOffset,h=f.position;g=f._aspectRatio||g.shiftKey;var i={top:0,left:0},j=f.containerElement;if(j[0]!=document&&/static/.test(j.css("position")))i=c;if(h.left<(f._helper?c.left:0)){f.size.width+=f._helper?f.position.left-c.left:f.position.left-i.left;if(g)f.size.height=f.size.width/a.aspectRatio;f.position.left=a.helper?c.left:0}if(h.top<(f._helper?c.top:0)){f.size.height+=f._helper?f.position.top-c.top:f.position.top;if(g)f.size.width=f.size.height*a.aspectRatio;f.position.top=f._helper?
c.top:0}f.offset.left=f.parentData.left+f.position.left;f.offset.top=f.parentData.top+f.position.top;a=Math.abs((f._helper?f.offset.left-i.left:f.offset.left-i.left)+f.sizeDiff.width);c=Math.abs((f._helper?f.offset.top-i.top:f.offset.top-c.top)+f.sizeDiff.height);h=f.containerElement.get(0)==f.element.parent().get(0);i=/relative|absolute/.test(f.containerElement.css("position"));if(h&&i)a-=f.parentData.left;if(a+f.size.width>=f.parentData.width){f.size.width=f.parentData.width-a;if(g)f.size.height=
f.size.width/f.aspectRatio}if(c+f.size.height>=f.parentData.height){f.size.height=f.parentData.height-c;if(g)f.size.width=f.size.height*f.aspectRatio}},stop:function(){var g=b(this).data("resizable"),f=g.options,a=g.containerOffset,c=g.containerPosition,h=g.containerElement,i=b(g.helper),j=i.offset(),n=i.outerWidth()-g.sizeDiff.width;i=i.outerHeight()-g.sizeDiff.height;g._helper&&!f.animate&&/relative/.test(h.css("position"))&&b(this).css({left:j.left-c.left-a.left,width:n,height:i});g._helper&&!f.animate&&
/static/.test(h.css("position"))&&b(this).css({left:j.left-c.left-a.left,width:n,height:i})}});b.ui.plugin.add("resizable","ghost",{start:function(){var g=b(this).data("resizable"),f=g.options,a=g.size;g.ghost=g.originalElement.clone();g.ghost.css({opacity:0.25,display:"block",position:"relative",height:a.height,width:a.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof f.ghost=="string"?f.ghost:"");g.ghost.appendTo(g.helper)},resize:function(){var g=b(this).data("resizable");
g.ghost&&g.ghost.css({position:"relative",height:g.size.height,width:g.size.width})},stop:function(){var g=b(this).data("resizable");g.ghost&&g.helper&&g.helper.get(0).removeChild(g.ghost.get(0))}});b.ui.plugin.add("resizable","grid",{resize:function(){var g=b(this).data("resizable"),f=g.options,a=g.size,c=g.originalSize,h=g.originalPosition,i=g.axis;f.grid=typeof f.grid=="number"?[f.grid,f.grid]:f.grid;var j=Math.round((a.width-c.width)/(f.grid[0]||1))*(f.grid[0]||1);f=Math.round((a.height-c.height)/
(f.grid[1]||1))*(f.grid[1]||1);if(/^(se|s|e)$/.test(i)){g.size.width=c.width+j;g.size.height=c.height+f}else if(/^(ne)$/.test(i)){g.size.width=c.width+j;g.size.height=c.height+f;g.position.top=h.top-f}else{if(/^(sw)$/.test(i)){g.size.width=c.width+j;g.size.height=c.height+f}else{g.size.width=c.width+j;g.size.height=c.height+f;g.position.top=h.top-f}g.position.left=h.left-j}}});var d=function(g){return parseInt(g,10)||0},e=function(g){return!isNaN(parseInt(g,10))}})(jQuery);
(function(b){b.widget("ui.selectable",b.ui.mouse,{options:{appendTo:"body",autoRefresh:true,distance:0,filter:"*",tolerance:"touch"},_create:function(){var d=this;this.element.addClass("ui-selectable");this.dragged=false;var e;this.refresh=function(){e=b(d.options.filter,d.element[0]);e.each(function(){var g=b(this),f=g.offset();b.data(this,"selectable-item",{element:this,$element:g,left:f.left,top:f.top,right:f.left+g.outerWidth(),bottom:f.top+g.outerHeight(),startselected:false,selected:g.hasClass("ui-selected"),
selecting:g.hasClass("ui-selecting"),unselecting:g.hasClass("ui-unselecting")})})};this.refresh();this.selectees=e.addClass("ui-selectee");this._mouseInit();this.helper=b("<div class='ui-selectable-helper'></div>")},destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item");this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable");this._mouseDestroy();return this},_mouseStart:function(d){var e=this;this.opos=[d.pageX,
d.pageY];if(!this.options.disabled){var g=this.options;this.selectees=b(g.filter,this.element[0]);this._trigger("start",d);b(g.appendTo).append(this.helper);this.helper.css({left:d.clientX,top:d.clientY,width:0,height:0});g.autoRefresh&&this.refresh();this.selectees.filter(".ui-selected").each(function(){var f=b.data(this,"selectable-item");f.startselected=true;if(!d.metaKey){f.$element.removeClass("ui-selected");f.selected=false;f.$element.addClass("ui-unselecting");f.unselecting=true;e._trigger("unselecting",
d,{unselecting:f.element})}});b(d.target).parents().andSelf().each(function(){var f=b.data(this,"selectable-item");if(f){var a=!d.metaKey||!f.$element.hasClass("ui-selected");f.$element.removeClass(a?"ui-unselecting":"ui-selected").addClass(a?"ui-selecting":"ui-unselecting");f.unselecting=!a;f.selecting=a;(f.selected=a)?e._trigger("selecting",d,{selecting:f.element}):e._trigger("unselecting",d,{unselecting:f.element});return false}})}},_mouseDrag:function(d){var e=this;this.dragged=true;if(!this.options.disabled){var g=
this.options,f=this.opos[0],a=this.opos[1],c=d.pageX,h=d.pageY;if(f>c){var i=c;c=f;f=i}if(a>h){i=h;h=a;a=i}this.helper.css({left:f,top:a,width:c-f,height:h-a});this.selectees.each(function(){var j=b.data(this,"selectable-item");if(!(!j||j.element==e.element[0])){var n=false;if(g.tolerance=="touch")n=!(j.left>c||j.right<f||j.top>h||j.bottom<a);else if(g.tolerance=="fit")n=j.left>f&&j.right<c&&j.top>a&&j.bottom<h;if(n){if(j.selected){j.$element.removeClass("ui-selected");j.selected=false}if(j.unselecting){j.$element.removeClass("ui-unselecting");
j.unselecting=false}if(!j.selecting){j.$element.addClass("ui-selecting");j.selecting=true;e._trigger("selecting",d,{selecting:j.element})}}else{if(j.selecting)if(d.metaKey&&j.startselected){j.$element.removeClass("ui-selecting");j.selecting=false;j.$element.addClass("ui-selected");j.selected=true}else{j.$element.removeClass("ui-selecting");j.selecting=false;if(j.startselected){j.$element.addClass("ui-unselecting");j.unselecting=true}e._trigger("unselecting",d,{unselecting:j.element})}if(j.selected)if(!d.metaKey&&
!j.startselected){j.$element.removeClass("ui-selected");j.selected=false;j.$element.addClass("ui-unselecting");j.unselecting=true;e._trigger("unselecting",d,{unselecting:j.element})}}}});return false}},_mouseStop:function(d){var e=this;this.dragged=false;b(".ui-unselecting",this.element[0]).each(function(){var g=b.data(this,"selectable-item");g.$element.removeClass("ui-unselecting");g.unselecting=false;g.startselected=false;e._trigger("unselected",d,{unselected:g.element})});b(".ui-selecting",this.element[0]).each(function(){var g=
b.data(this,"selectable-item");g.$element.removeClass("ui-selecting").addClass("ui-selected");g.selecting=false;g.selected=true;g.startselected=true;e._trigger("selected",d,{selected:g.element})});this._trigger("stop",d);this.helper.remove();return false}});b.extend(b.ui.selectable,{version:"1.8.11"})})(jQuery);
(function(b){b.widget("ui.sortable",b.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1E3},_create:function(){this.containerCache={};this.element.addClass("ui-sortable");
this.refresh();this.floating=this.items.length?/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):false;this.offset=this.element.offset();this._mouseInit()},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");this._mouseDestroy();for(var d=this.items.length-1;d>=0;d--)this.items[d].item.removeData("sortable-item");return this},_setOption:function(d,e){if(d==="disabled"){this.options[d]=
e;this.widget()[e?"addClass":"removeClass"]("ui-sortable-disabled")}else b.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(d,e){if(this.reverting)return false;if(this.options.disabled||this.options.type=="static")return false;this._refreshItems(d);var g=null,f=this;b(d.target).parents().each(function(){if(b.data(this,"sortable-item")==f){g=b(this);return false}});if(b.data(d.target,"sortable-item")==f)g=b(d.target);if(!g)return false;if(this.options.handle&&!e){var a=false;
b(this.options.handle,g).find("*").andSelf().each(function(){if(this==d.target)a=true});if(!a)return false}this.currentItem=g;this._removeCurrentsFromItems();return true},_mouseStart:function(d,e,g){e=this.options;var f=this;this.currentContainer=this;this.refreshPositions();this.helper=this._createHelper(d);this._cacheHelperProportions();this._cacheMargins();this.scrollParent=this.helper.scrollParent();this.offset=this.currentItem.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-
this.margins.left};this.helper.css("position","absolute");this.cssPosition=this.helper.css("position");b.extend(this.offset,{click:{left:d.pageX-this.offset.left,top:d.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this._generatePosition(d);this.originalPageX=d.pageX;this.originalPageY=d.pageY;e.cursorAt&&this._adjustOffsetFromHelper(e.cursorAt);this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};
this.helper[0]!=this.currentItem[0]&&this.currentItem.hide();this._createPlaceholder();e.containment&&this._setContainment();if(e.cursor){if(b("body").css("cursor"))this._storedCursor=b("body").css("cursor");b("body").css("cursor",e.cursor)}if(e.opacity){if(this.helper.css("opacity"))this._storedOpacity=this.helper.css("opacity");this.helper.css("opacity",e.opacity)}if(e.zIndex){if(this.helper.css("zIndex"))this._storedZIndex=this.helper.css("zIndex");this.helper.css("zIndex",e.zIndex)}if(this.scrollParent[0]!=
document&&this.scrollParent[0].tagName!="HTML")this.overflowOffset=this.scrollParent.offset();this._trigger("start",d,this._uiHash());this._preserveHelperProportions||this._cacheHelperProportions();if(!g)for(g=this.containers.length-1;g>=0;g--)this.containers[g]._trigger("activate",d,f._uiHash(this));if(b.ui.ddmanager)b.ui.ddmanager.current=this;b.ui.ddmanager&&!e.dropBehaviour&&b.ui.ddmanager.prepareOffsets(this,d);this.dragging=true;this.helper.addClass("ui-sortable-helper");this._mouseDrag(d);
return true},_mouseDrag:function(d){this.position=this._generatePosition(d);this.positionAbs=this._convertPositionTo("absolute");if(!this.lastPositionAbs)this.lastPositionAbs=this.positionAbs;if(this.options.scroll){var e=this.options,g=false;if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if(this.overflowOffset.top+this.scrollParent[0].offsetHeight-d.pageY<e.scrollSensitivity)this.scrollParent[0].scrollTop=g=this.scrollParent[0].scrollTop+e.scrollSpeed;else if(d.pageY-this.overflowOffset.top<
e.scrollSensitivity)this.scrollParent[0].scrollTop=g=this.scrollParent[0].scrollTop-e.scrollSpeed;if(this.overflowOffset.left+this.scrollParent[0].offsetWidth-d.pageX<e.scrollSensitivity)this.scrollParent[0].scrollLeft=g=this.scrollParent[0].scrollLeft+e.scrollSpeed;else if(d.pageX-this.overflowOffset.left<e.scrollSensitivity)this.scrollParent[0].scrollLeft=g=this.scrollParent[0].scrollLeft-e.scrollSpeed}else{if(d.pageY-b(document).scrollTop()<e.scrollSensitivity)g=b(document).scrollTop(b(document).scrollTop()-
e.scrollSpeed);else if(b(window).height()-(d.pageY-b(document).scrollTop())<e.scrollSensitivity)g=b(document).scrollTop(b(document).scrollTop()+e.scrollSpeed);if(d.pageX-b(document).scrollLeft()<e.scrollSensitivity)g=b(document).scrollLeft(b(document).scrollLeft()-e.scrollSpeed);else if(b(window).width()-(d.pageX-b(document).scrollLeft())<e.scrollSensitivity)g=b(document).scrollLeft(b(document).scrollLeft()+e.scrollSpeed)}g!==false&&b.ui.ddmanager&&!e.dropBehaviour&&b.ui.ddmanager.prepareOffsets(this,
d)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(e=this.items.length-1;e>=0;e--){g=this.items[e];var f=g.item[0],a=this._intersectsWithPointer(g);if(a)if(f!=this.currentItem[0]&&this.placeholder[a==1?"next":"prev"]()[0]!=f&&!b.ui.contains(this.placeholder[0],f)&&(this.options.type=="semi-dynamic"?!b.ui.contains(this.element[0],
f):true)){this.direction=a==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(g))this._rearrange(d,g);else break;this._trigger("change",d,this._uiHash());break}}this._contactContainers(d);b.ui.ddmanager&&b.ui.ddmanager.drag(this,d);this._trigger("sort",d,this._uiHash());this.lastPositionAbs=this.positionAbs;return false},_mouseStop:function(d,e){if(d){b.ui.ddmanager&&!this.options.dropBehaviour&&b.ui.ddmanager.drop(this,d);if(this.options.revert){var g=this;e=g.placeholder.offset();
g.reverting=true;b(this.helper).animate({left:e.left-this.offset.parent.left-g.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:e.top-this.offset.parent.top-g.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){g._clear(d)})}else this._clear(d,e);return false}},cancel:function(){var d=this;if(this.dragging){this._mouseUp({target:null});this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):
this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--){this.containers[e]._trigger("deactivate",null,d._uiHash(this));if(this.containers[e].containerCache.over){this.containers[e]._trigger("out",null,d._uiHash(this));this.containers[e].containerCache.over=0}}}if(this.placeholder){this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove();b.extend(this,{helper:null,
dragging:false,reverting:false,_noFinalSort:null});this.domPosition.prev?b(this.domPosition.prev).after(this.currentItem):b(this.domPosition.parent).prepend(this.currentItem)}return this},serialize:function(d){var e=this._getItemsAsjQuery(d&&d.connected),g=[];d=d||{};b(e).each(function(){var f=(b(d.item||this).attr(d.attribute||"id")||"").match(d.expression||/(.+)[-=_](.+)/);if(f)g.push((d.key||f[1]+"[]")+"="+(d.key&&d.expression?f[1]:f[2]))});!g.length&&d.key&&g.push(d.key+"=");return g.join("&")},
toArray:function(d){var e=this._getItemsAsjQuery(d&&d.connected),g=[];d=d||{};e.each(function(){g.push(b(d.item||this).attr(d.attribute||"id")||"")});return g},_intersectsWith:function(d){var e=this.positionAbs.left,g=e+this.helperProportions.width,f=this.positionAbs.top,a=f+this.helperProportions.height,c=d.left,h=c+d.width,i=d.top,j=i+d.height,n=this.offset.click.top,p=this.offset.click.left;n=f+n>i&&f+n<j&&e+p>c&&e+p<h;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||
this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>d[this.floating?"width":"height"]?n:c<e+this.helperProportions.width/2&&g-this.helperProportions.width/2<h&&i<f+this.helperProportions.height/2&&a-this.helperProportions.height/2<j},_intersectsWithPointer:function(d){var e=b.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,d.top,d.height);d=b.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,d.left,d.width);e=e&&d;d=this._getDragVerticalDirection();
var g=this._getDragHorizontalDirection();if(!e)return false;return this.floating?g&&g=="right"||d=="down"?2:1:d&&(d=="down"?2:1)},_intersectsWithSides:function(d){var e=b.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,d.top+d.height/2,d.height);d=b.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,d.left+d.width/2,d.width);var g=this._getDragVerticalDirection(),f=this._getDragHorizontalDirection();return this.floating&&f?f=="right"&&d||f=="left"&&!d:g&&(g=="down"&&e||g=="up"&&!e)},
_getDragVerticalDirection:function(){var d=this.positionAbs.top-this.lastPositionAbs.top;return d!=0&&(d>0?"down":"up")},_getDragHorizontalDirection:function(){var d=this.positionAbs.left-this.lastPositionAbs.left;return d!=0&&(d>0?"right":"left")},refresh:function(d){this._refreshItems(d);this.refreshPositions();return this},_connectWith:function(){var d=this.options;return d.connectWith.constructor==String?[d.connectWith]:d.connectWith},_getItemsAsjQuery:function(d){var e=[],g=[],f=this._connectWith();
if(f&&d)for(d=f.length-1;d>=0;d--)for(var a=b(f[d]),c=a.length-1;c>=0;c--){var h=b.data(a[c],"sortable");if(h&&h!=this&&!h.options.disabled)g.push([b.isFunction(h.options.items)?h.options.items.call(h.element):b(h.options.items,h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),h])}g.push([b.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):b(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),
this]);for(d=g.length-1;d>=0;d--)g[d][0].each(function(){e.push(this)});return b(e)},_removeCurrentsFromItems:function(){for(var d=this.currentItem.find(":data(sortable-item)"),e=0;e<this.items.length;e++)for(var g=0;g<d.length;g++)d[g]==this.items[e].item[0]&&this.items.splice(e,1)},_refreshItems:function(d){this.items=[];this.containers=[this];var e=this.items,g=[[b.isFunction(this.options.items)?this.options.items.call(this.element[0],d,{item:this.currentItem}):b(this.options.items,this.element),
this]],f=this._connectWith();if(f)for(var a=f.length-1;a>=0;a--)for(var c=b(f[a]),h=c.length-1;h>=0;h--){var i=b.data(c[h],"sortable");if(i&&i!=this&&!i.options.disabled){g.push([b.isFunction(i.options.items)?i.options.items.call(i.element[0],d,{item:this.currentItem}):b(i.options.items,i.element),i]);this.containers.push(i)}}for(a=g.length-1;a>=0;a--){d=g[a][1];f=g[a][0];h=0;for(c=f.length;h<c;h++){i=b(f[h]);i.data("sortable-item",d);e.push({item:i,instance:d,width:0,height:0,left:0,top:0})}}},refreshPositions:function(d){if(this.offsetParent&&
this.helper)this.offset.parent=this._getParentOffset();for(var e=this.items.length-1;e>=0;e--){var g=this.items[e],f=this.options.toleranceElement?b(this.options.toleranceElement,g.item):g.item;if(!d){g.width=f.outerWidth();g.height=f.outerHeight()}f=f.offset();g.left=f.left;g.top=f.top}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(e=this.containers.length-1;e>=0;e--){f=this.containers[e].element.offset();this.containers[e].containerCache.left=
f.left;this.containers[e].containerCache.top=f.top;this.containers[e].containerCache.width=this.containers[e].element.outerWidth();this.containers[e].containerCache.height=this.containers[e].element.outerHeight()}return this},_createPlaceholder:function(d){var e=d||this,g=e.options;if(!g.placeholder||g.placeholder.constructor==String){var f=g.placeholder;g.placeholder={element:function(){var a=b(document.createElement(e.currentItem[0].nodeName)).addClass(f||e.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
if(!f)a.style.visibility="hidden";return a},update:function(a,c){if(!(f&&!g.forcePlaceholderSize)){c.height()||c.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10));c.width()||c.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10))}}}}e.placeholder=b(g.placeholder.element.call(e.element,e.currentItem));e.currentItem.after(e.placeholder);
g.placeholder.update(e,e.placeholder)},_contactContainers:function(d){for(var e=null,g=null,f=this.containers.length-1;f>=0;f--)if(!b.ui.contains(this.currentItem[0],this.containers[f].element[0]))if(this._intersectsWith(this.containers[f].containerCache)){if(!(e&&b.ui.contains(this.containers[f].element[0],e.element[0]))){e=this.containers[f];g=f}}else if(this.containers[f].containerCache.over){this.containers[f]._trigger("out",d,this._uiHash(this));this.containers[f].containerCache.over=0}if(e)if(this.containers.length===
1){this.containers[g]._trigger("over",d,this._uiHash(this));this.containers[g].containerCache.over=1}else if(this.currentContainer!=this.containers[g]){e=1E4;f=null;for(var a=this.positionAbs[this.containers[g].floating?"left":"top"],c=this.items.length-1;c>=0;c--)if(b.ui.contains(this.containers[g].element[0],this.items[c].item[0])){var h=this.items[c][this.containers[g].floating?"left":"top"];if(Math.abs(h-a)<e){e=Math.abs(h-a);f=this.items[c]}}if(f||this.options.dropOnEmpty){this.currentContainer=
this.containers[g];f?this._rearrange(d,f,null,true):this._rearrange(d,null,this.containers[g].element,true);this._trigger("change",d,this._uiHash());this.containers[g]._trigger("change",d,this._uiHash(this));this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[g]._trigger("over",d,this._uiHash(this));this.containers[g].containerCache.over=1}}},_createHelper:function(d){var e=this.options;d=b.isFunction(e.helper)?b(e.helper.apply(this.element[0],[d,this.currentItem])):
e.helper=="clone"?this.currentItem.clone():this.currentItem;d.parents("body").length||b(e.appendTo!="parent"?e.appendTo:this.currentItem[0].parentNode)[0].appendChild(d[0]);if(d[0]==this.currentItem[0])this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")};if(d[0].style.width==""||e.forceHelperSize)d.width(this.currentItem.width());if(d[0].style.height==
""||e.forceHelperSize)d.height(this.currentItem.height());return d},_adjustOffsetFromHelper:function(d){if(typeof d=="string")d=d.split(" ");if(b.isArray(d))d={left:+d[0],top:+d[1]||0};if("left"in d)this.offset.click.left=d.left+this.margins.left;if("right"in d)this.offset.click.left=this.helperProportions.width-d.right+this.margins.left;if("top"in d)this.offset.click.top=d.top+this.margins.top;if("bottom"in d)this.offset.click.top=this.helperProportions.height-d.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=
this.helper.offsetParent();var d=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&b.ui.contains(this.scrollParent[0],this.offsetParent[0])){d.left+=this.scrollParent.scrollLeft();d.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&b.browser.msie)d={top:0,left:0};return{top:d.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:d.left+(parseInt(this.offsetParent.css("borderLeftWidth"),
10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var d=this.currentItem.position();return{top:d.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:d.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions=
{width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var d=this.options;if(d.containment=="parent")d.containment=this.helper[0].parentNode;if(d.containment=="document"||d.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,b(d.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(b(d.containment=="document"?document:window).height()||
document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(d.containment)){var e=b(d.containment)[0];d=b(d.containment).offset();var g=b(e).css("overflow")!="hidden";this.containment=[d.left+(parseInt(b(e).css("borderLeftWidth"),10)||0)+(parseInt(b(e).css("paddingLeft"),10)||0)-this.margins.left,d.top+(parseInt(b(e).css("borderTopWidth"),10)||0)+(parseInt(b(e).css("paddingTop"),10)||0)-this.margins.top,d.left+(g?Math.max(e.scrollWidth,
e.offsetWidth):e.offsetWidth)-(parseInt(b(e).css("borderLeftWidth"),10)||0)-(parseInt(b(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,d.top+(g?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(b(e).css("borderTopWidth"),10)||0)-(parseInt(b(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(d,e){if(!e)e=this.position;d=d=="absolute"?1:-1;var g=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=
document&&b.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(g[0].tagName);return{top:e.top+this.offset.relative.top*d+this.offset.parent.top*d-(b.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:g.scrollTop())*d),left:e.left+this.offset.relative.left*d+this.offset.parent.left*d-(b.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():
f?0:g.scrollLeft())*d)}},_generatePosition:function(d){var e=this.options,g=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&b.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(g[0].tagName);if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0]))this.offset.relative=this._getRelativeOffset();var a=d.pageX,c=d.pageY;if(this.originalPosition){if(this.containment){if(d.pageX-
this.offset.click.left<this.containment[0])a=this.containment[0]+this.offset.click.left;if(d.pageY-this.offset.click.top<this.containment[1])c=this.containment[1]+this.offset.click.top;if(d.pageX-this.offset.click.left>this.containment[2])a=this.containment[2]+this.offset.click.left;if(d.pageY-this.offset.click.top>this.containment[3])c=this.containment[3]+this.offset.click.top}if(e.grid){c=this.originalPageY+Math.round((c-this.originalPageY)/e.grid[1])*e.grid[1];c=this.containment?!(c-this.offset.click.top<
this.containment[1]||c-this.offset.click.top>this.containment[3])?c:!(c-this.offset.click.top<this.containment[1])?c-e.grid[1]:c+e.grid[1]:c;a=this.originalPageX+Math.round((a-this.originalPageX)/e.grid[0])*e.grid[0];a=this.containment?!(a-this.offset.click.left<this.containment[0]||a-this.offset.click.left>this.containment[2])?a:!(a-this.offset.click.left<this.containment[0])?a-e.grid[0]:a+e.grid[0]:a}}return{top:c-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(b.browser.safari&&
this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:g.scrollTop()),left:a-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(b.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:g.scrollLeft())}},_rearrange:function(d,e,g,f){g?g[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?e.item[0]:e.item[0].nextSibling);this.counter=
this.counter?++this.counter:1;var a=this,c=this.counter;window.setTimeout(function(){c==a.counter&&a.refreshPositions(!f)},0)},_clear:function(d,e){this.reverting=false;var g=[];!this._noFinalSort&&this.currentItem[0].parentNode&&this.placeholder.before(this.currentItem);this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var f in this._storedCSS)if(this._storedCSS[f]=="auto"||this._storedCSS[f]=="static")this._storedCSS[f]="";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();
this.fromOutside&&!e&&g.push(function(a){this._trigger("receive",a,this._uiHash(this.fromOutside))});if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!e)g.push(function(a){this._trigger("update",a,this._uiHash())});if(!b.ui.contains(this.element[0],this.currentItem[0])){e||g.push(function(a){this._trigger("remove",a,this._uiHash())});for(f=this.containers.length-1;f>=0;f--)if(b.ui.contains(this.containers[f].element[0],
this.currentItem[0])&&!e){g.push(function(a){return function(c){a._trigger("receive",c,this._uiHash(this))}}.call(this,this.containers[f]));g.push(function(a){return function(c){a._trigger("update",c,this._uiHash(this))}}.call(this,this.containers[f]))}}for(f=this.containers.length-1;f>=0;f--){e||g.push(function(a){return function(c){a._trigger("deactivate",c,this._uiHash(this))}}.call(this,this.containers[f]));if(this.containers[f].containerCache.over){g.push(function(a){return function(c){a._trigger("out",
c,this._uiHash(this))}}.call(this,this.containers[f]));this.containers[f].containerCache.over=0}}this._storedCursor&&b("body").css("cursor",this._storedCursor);this._storedOpacity&&this.helper.css("opacity",this._storedOpacity);if(this._storedZIndex)this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex);this.dragging=false;if(this.cancelHelperRemoval){if(!e){this._trigger("beforeStop",d,this._uiHash());for(f=0;f<g.length;f++)g[f].call(this,d);this._trigger("stop",d,this._uiHash())}return false}e||
this._trigger("beforeStop",d,this._uiHash());this.placeholder[0].parentNode.removeChild(this.placeholder[0]);this.helper[0]!=this.currentItem[0]&&this.helper.remove();this.helper=null;if(!e){for(f=0;f<g.length;f++)g[f].call(this,d);this._trigger("stop",d,this._uiHash())}this.fromOutside=false;return true},_trigger:function(){b.Widget.prototype._trigger.apply(this,arguments)===false&&this.cancel()},_uiHash:function(d){var e=d||this;return{helper:e.helper,placeholder:e.placeholder||b([]),position:e.position,
originalPosition:e.originalPosition,offset:e.positionAbs,item:e.currentItem,sender:d?d.element:null}}});b.extend(b.ui.sortable,{version:"1.8.11"})})(jQuery);
jQuery.effects||function(b,d){function e(l){var k;if(l&&l.constructor==Array&&l.length==3)return l;if(k=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(l))return[parseInt(k[1],10),parseInt(k[2],10),parseInt(k[3],10)];if(k=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(l))return[parseFloat(k[1])*2.55,parseFloat(k[2])*2.55,parseFloat(k[3])*2.55];if(k=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(l))return[parseInt(k[1],
16),parseInt(k[2],16),parseInt(k[3],16)];if(k=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(l))return[parseInt(k[1]+k[1],16),parseInt(k[2]+k[2],16),parseInt(k[3]+k[3],16)];if(/rgba\(0, 0, 0, 0\)/.exec(l))return j.transparent;return j[b.trim(l).toLowerCase()]}function g(l,k){var m;do{m=b.curCSS(l,k);if(m!=""&&m!="transparent"||b.nodeName(l,"body"))break;k="backgroundColor"}while(l=l.parentNode);return e(m)}function f(){var l=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,
k={},m,o;if(l&&l.length&&l[0]&&l[l[0]])for(var q=l.length;q--;){m=l[q];if(typeof l[m]=="string"){o=m.replace(/\-(\w)/g,function(s,r){return r.toUpperCase()});k[o]=l[m]}}else for(m in l)if(typeof l[m]==="string")k[m]=l[m];return k}function a(l){var k,m;for(k in l){m=l[k];if(m==null||b.isFunction(m)||k in p||/scrollbar/.test(k)||!/color/i.test(k)&&isNaN(parseFloat(m)))delete l[k]}return l}function c(l,k){var m={_:0},o;for(o in k)if(l[o]!=k[o])m[o]=k[o];return m}function h(l,k,m,o){if(typeof l=="object"){o=
k;m=null;k=l;l=k.effect}if(b.isFunction(k)){o=k;m=null;k={}}if(typeof k=="number"||b.fx.speeds[k]){o=m;m=k;k={}}if(b.isFunction(m)){o=m;m=null}k=k||{};m=m||k.duration;m=b.fx.off?0:typeof m=="number"?m:m in b.fx.speeds?b.fx.speeds[m]:b.fx.speeds._default;o=o||k.complete;return[l,k,m,o]}function i(l){if(!l||typeof l==="number"||b.fx.speeds[l])return true;if(typeof l==="string"&&!b.effects[l])return true;return false}b.effects={};b.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor",
"borderTopColor","borderColor","color","outlineColor"],function(l,k){b.fx.step[k]=function(m){if(!m.colorInit){m.start=g(m.elem,k);m.end=e(m.end);m.colorInit=true}m.elem.style[k]="rgb("+Math.max(Math.min(parseInt(m.pos*(m.end[0]-m.start[0])+m.start[0],10),255),0)+","+Math.max(Math.min(parseInt(m.pos*(m.end[1]-m.start[1])+m.start[1],10),255),0)+","+Math.max(Math.min(parseInt(m.pos*(m.end[2]-m.start[2])+m.start[2],10),255),0)+")"}});var j={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,
0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,
211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},n=["add","remove","toggle"],p={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};b.effects.animateClass=function(l,k,m,
o){if(b.isFunction(m)){o=m;m=null}return this.queue("fx",function(){var q=b(this),s=q.attr("style")||" ",r=a(f.call(this)),u,v=q.attr("className");b.each(n,function(w,y){l[y]&&q[y+"Class"](l[y])});u=a(f.call(this));q.attr("className",v);q.animate(c(r,u),k,m,function(){b.each(n,function(w,y){l[y]&&q[y+"Class"](l[y])});if(typeof q.attr("style")=="object"){q.attr("style").cssText="";q.attr("style").cssText=s}else q.attr("style",s);o&&o.apply(this,arguments)});r=b.queue(this);u=r.splice(r.length-1,1)[0];
r.splice(1,0,u);b.dequeue(this)})};b.fn.extend({_addClass:b.fn.addClass,addClass:function(l,k,m,o){return k?b.effects.animateClass.apply(this,[{add:l},k,m,o]):this._addClass(l)},_removeClass:b.fn.removeClass,removeClass:function(l,k,m,o){return k?b.effects.animateClass.apply(this,[{remove:l},k,m,o]):this._removeClass(l)},_toggleClass:b.fn.toggleClass,toggleClass:function(l,k,m,o,q){return typeof k=="boolean"||k===d?m?b.effects.animateClass.apply(this,[k?{add:l}:{remove:l},m,o,q]):this._toggleClass(l,
k):b.effects.animateClass.apply(this,[{toggle:l},k,m,o])},switchClass:function(l,k,m,o,q){return b.effects.animateClass.apply(this,[{add:k,remove:l},m,o,q])}});b.extend(b.effects,{version:"1.8.11",save:function(l,k){for(var m=0;m<k.length;m++)k[m]!==null&&l.data("ec.storage."+k[m],l[0].style[k[m]])},restore:function(l,k){for(var m=0;m<k.length;m++)k[m]!==null&&l.css(k[m],l.data("ec.storage."+k[m]))},setMode:function(l,k){if(k=="toggle")k=l.is(":hidden")?"show":"hide";return k},getBaseline:function(l,
k){var m;switch(l[0]){case "top":m=0;break;case "middle":m=0.5;break;case "bottom":m=1;break;default:m=l[0]/k.height}switch(l[1]){case "left":l=0;break;case "center":l=0.5;break;case "right":l=1;break;default:l=l[1]/k.width}return{x:l,y:m}},createWrapper:function(l){if(l.parent().is(".ui-effects-wrapper"))return l.parent();var k={width:l.outerWidth(true),height:l.outerHeight(true),"float":l.css("float")},m=b("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",
border:"none",margin:0,padding:0});l.wrap(m);m=l.parent();if(l.css("position")=="static"){m.css({position:"relative"});l.css({position:"relative"})}else{b.extend(k,{position:l.css("position"),zIndex:l.css("z-index")});b.each(["top","left","bottom","right"],function(o,q){k[q]=l.css(q);if(isNaN(parseInt(k[q],10)))k[q]="auto"});l.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})}return m.css(k).show()},removeWrapper:function(l){if(l.parent().is(".ui-effects-wrapper"))return l.parent().replaceWith(l);
return l},setTransition:function(l,k,m,o){o=o||{};b.each(k,function(q,s){unit=l.cssUnit(s);if(unit[0]>0)o[s]=unit[0]*m+unit[1]});return o}});b.fn.extend({effect:function(l){var k=h.apply(this,arguments),m={options:k[1],duration:k[2],callback:k[3]};k=m.options.mode;var o=b.effects[l];if(b.fx.off||!o)return k?this[k](m.duration,m.callback):this.each(function(){m.callback&&m.callback.call(this)});return o.call(this,m)},_show:b.fn.show,show:function(l){if(i(l))return this._show.apply(this,arguments);
else{var k=h.apply(this,arguments);k[1].mode="show";return this.effect.apply(this,k)}},_hide:b.fn.hide,hide:function(l){if(i(l))return this._hide.apply(this,arguments);else{var k=h.apply(this,arguments);k[1].mode="hide";return this.effect.apply(this,k)}},__toggle:b.fn.toggle,toggle:function(l){if(i(l)||typeof l==="boolean"||b.isFunction(l))return this.__toggle.apply(this,arguments);else{var k=h.apply(this,arguments);k[1].mode="toggle";return this.effect.apply(this,k)}},cssUnit:function(l){var k=this.css(l),
m=[];b.each(["em","px","%","pt"],function(o,q){if(k.indexOf(q)>0)m=[parseFloat(k),q]});return m}});b.easing.jswing=b.easing.swing;b.extend(b.easing,{def:"easeOutQuad",swing:function(l,k,m,o,q){return b.easing[b.easing.def](l,k,m,o,q)},easeInQuad:function(l,k,m,o,q){return o*(k/=q)*k+m},easeOutQuad:function(l,k,m,o,q){return-o*(k/=q)*(k-2)+m},easeInOutQuad:function(l,k,m,o,q){if((k/=q/2)<1)return o/2*k*k+m;return-o/2*(--k*(k-2)-1)+m},easeInCubic:function(l,k,m,o,q){return o*(k/=q)*k*k+m},easeOutCubic:function(l,
k,m,o,q){return o*((k=k/q-1)*k*k+1)+m},easeInOutCubic:function(l,k,m,o,q){if((k/=q/2)<1)return o/2*k*k*k+m;return o/2*((k-=2)*k*k+2)+m},easeInQuart:function(l,k,m,o,q){return o*(k/=q)*k*k*k+m},easeOutQuart:function(l,k,m,o,q){return-o*((k=k/q-1)*k*k*k-1)+m},easeInOutQuart:function(l,k,m,o,q){if((k/=q/2)<1)return o/2*k*k*k*k+m;return-o/2*((k-=2)*k*k*k-2)+m},easeInQuint:function(l,k,m,o,q){return o*(k/=q)*k*k*k*k+m},easeOutQuint:function(l,k,m,o,q){return o*((k=k/q-1)*k*k*k*k+1)+m},easeInOutQuint:function(l,
k,m,o,q){if((k/=q/2)<1)return o/2*k*k*k*k*k+m;return o/2*((k-=2)*k*k*k*k+2)+m},easeInSine:function(l,k,m,o,q){return-o*Math.cos(k/q*(Math.PI/2))+o+m},easeOutSine:function(l,k,m,o,q){return o*Math.sin(k/q*(Math.PI/2))+m},easeInOutSine:function(l,k,m,o,q){return-o/2*(Math.cos(Math.PI*k/q)-1)+m},easeInExpo:function(l,k,m,o,q){return k==0?m:o*Math.pow(2,10*(k/q-1))+m},easeOutExpo:function(l,k,m,o,q){return k==q?m+o:o*(-Math.pow(2,-10*k/q)+1)+m},easeInOutExpo:function(l,k,m,o,q){if(k==0)return m;if(k==
q)return m+o;if((k/=q/2)<1)return o/2*Math.pow(2,10*(k-1))+m;return o/2*(-Math.pow(2,-10*--k)+2)+m},easeInCirc:function(l,k,m,o,q){return-o*(Math.sqrt(1-(k/=q)*k)-1)+m},easeOutCirc:function(l,k,m,o,q){return o*Math.sqrt(1-(k=k/q-1)*k)+m},easeInOutCirc:function(l,k,m,o,q){if((k/=q/2)<1)return-o/2*(Math.sqrt(1-k*k)-1)+m;return o/2*(Math.sqrt(1-(k-=2)*k)+1)+m},easeInElastic:function(l,k,m,o,q){l=1.70158;var s=0,r=o;if(k==0)return m;if((k/=q)==1)return m+o;s||(s=q*0.3);if(r<Math.abs(o)){r=o;l=s/4}else l=
s/(2*Math.PI)*Math.asin(o/r);return-(r*Math.pow(2,10*(k-=1))*Math.sin((k*q-l)*2*Math.PI/s))+m},easeOutElastic:function(l,k,m,o,q){l=1.70158;var s=0,r=o;if(k==0)return m;if((k/=q)==1)return m+o;s||(s=q*0.3);if(r<Math.abs(o)){r=o;l=s/4}else l=s/(2*Math.PI)*Math.asin(o/r);return r*Math.pow(2,-10*k)*Math.sin((k*q-l)*2*Math.PI/s)+o+m},easeInOutElastic:function(l,k,m,o,q){l=1.70158;var s=0,r=o;if(k==0)return m;if((k/=q/2)==2)return m+o;s||(s=q*0.3*1.5);if(r<Math.abs(o)){r=o;l=s/4}else l=s/(2*Math.PI)*Math.asin(o/
r);if(k<1)return-0.5*r*Math.pow(2,10*(k-=1))*Math.sin((k*q-l)*2*Math.PI/s)+m;return r*Math.pow(2,-10*(k-=1))*Math.sin((k*q-l)*2*Math.PI/s)*0.5+o+m},easeInBack:function(l,k,m,o,q,s){if(s==d)s=1.70158;return o*(k/=q)*k*((s+1)*k-s)+m},easeOutBack:function(l,k,m,o,q,s){if(s==d)s=1.70158;return o*((k=k/q-1)*k*((s+1)*k+s)+1)+m},easeInOutBack:function(l,k,m,o,q,s){if(s==d)s=1.70158;if((k/=q/2)<1)return o/2*k*k*(((s*=1.525)+1)*k-s)+m;return o/2*((k-=2)*k*(((s*=1.525)+1)*k+s)+2)+m},easeInBounce:function(l,
k,m,o,q){return o-b.easing.easeOutBounce(l,q-k,0,o,q)+m},easeOutBounce:function(l,k,m,o,q){return(k/=q)<1/2.75?o*7.5625*k*k+m:k<2/2.75?o*(7.5625*(k-=1.5/2.75)*k+0.75)+m:k<2.5/2.75?o*(7.5625*(k-=2.25/2.75)*k+0.9375)+m:o*(7.5625*(k-=2.625/2.75)*k+0.984375)+m},easeInOutBounce:function(l,k,m,o,q){if(k<q/2)return b.easing.easeInBounce(l,k*2,0,o,q)*0.5+m;return b.easing.easeOutBounce(l,k*2-q,0,o,q)*0.5+o*0.5+m}})}(jQuery);
(function(b){b.effects.blind=function(d){return this.queue(function(){var e=b(this),g=["position","top","bottom","left","right"],f=b.effects.setMode(e,d.options.mode||"hide"),a=d.options.direction||"vertical";b.effects.save(e,g);e.show();var c=b.effects.createWrapper(e).css({overflow:"hidden"}),h=a=="vertical"?"height":"width";a=a=="vertical"?c.height():c.width();f=="show"&&c.css(h,0);var i={};i[h]=f=="show"?a:0;c.animate(i,d.duration,d.options.easing,function(){f=="hide"&&e.hide();b.effects.restore(e,
g);b.effects.removeWrapper(e);d.callback&&d.callback.apply(e[0],arguments);e.dequeue()})})}})(jQuery);
(function(b){b.effects.bounce=function(d){return this.queue(function(){var e=b(this),g=["position","top","bottom","left","right"],f=b.effects.setMode(e,d.options.mode||"effect"),a=d.options.direction||"up",c=d.options.distance||20,h=d.options.times||5,i=d.duration||250;/show|hide/.test(f)&&g.push("opacity");b.effects.save(e,g);e.show();b.effects.createWrapper(e);var j=a=="up"||a=="down"?"top":"left";a=a=="up"||a=="left"?"pos":"neg";c=d.options.distance||(j=="top"?e.outerHeight({margin:true})/3:e.outerWidth({margin:true})/
3);if(f=="show")e.css("opacity",0).css(j,a=="pos"?-c:c);if(f=="hide")c/=h*2;f!="hide"&&h--;if(f=="show"){var n={opacity:1};n[j]=(a=="pos"?"+=":"-=")+c;e.animate(n,i/2,d.options.easing);c/=2;h--}for(n=0;n<h;n++){var p={},l={};p[j]=(a=="pos"?"-=":"+=")+c;l[j]=(a=="pos"?"+=":"-=")+c;e.animate(p,i/2,d.options.easing).animate(l,i/2,d.options.easing);c=f=="hide"?c*2:c/2}if(f=="hide"){n={opacity:0};n[j]=(a=="pos"?"-=":"+=")+c;e.animate(n,i/2,d.options.easing,function(){e.hide();b.effects.restore(e,g);b.effects.removeWrapper(e);
d.callback&&d.callback.apply(this,arguments)})}else{p={};l={};p[j]=(a=="pos"?"-=":"+=")+c;l[j]=(a=="pos"?"+=":"-=")+c;e.animate(p,i/2,d.options.easing).animate(l,i/2,d.options.easing,function(){b.effects.restore(e,g);b.effects.removeWrapper(e);d.callback&&d.callback.apply(this,arguments)})}e.queue("fx",function(){e.dequeue()});e.dequeue()})}})(jQuery);
(function(b){b.effects.clip=function(d){return this.queue(function(){var e=b(this),g=["position","top","bottom","left","right","height","width"],f=b.effects.setMode(e,d.options.mode||"hide"),a=d.options.direction||"vertical";b.effects.save(e,g);e.show();var c=b.effects.createWrapper(e).css({overflow:"hidden"});c=e[0].tagName=="IMG"?c:e;var h={size:a=="vertical"?"height":"width",position:a=="vertical"?"top":"left"};a=a=="vertical"?c.height():c.width();if(f=="show"){c.css(h.size,0);c.css(h.position,
a/2)}var i={};i[h.size]=f=="show"?a:0;i[h.position]=f=="show"?0:a/2;c.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){f=="hide"&&e.hide();b.effects.restore(e,g);b.effects.removeWrapper(e);d.callback&&d.callback.apply(e[0],arguments);e.dequeue()}})})}})(jQuery);
(function(b){b.effects.drop=function(d){return this.queue(function(){var e=b(this),g=["position","top","bottom","left","right","opacity"],f=b.effects.setMode(e,d.options.mode||"hide"),a=d.options.direction||"left";b.effects.save(e,g);e.show();b.effects.createWrapper(e);var c=a=="up"||a=="down"?"top":"left";a=a=="up"||a=="left"?"pos":"neg";var h=d.options.distance||(c=="top"?e.outerHeight({margin:true})/2:e.outerWidth({margin:true})/2);if(f=="show")e.css("opacity",0).css(c,a=="pos"?-h:h);var i={opacity:f==
"show"?1:0};i[c]=(f=="show"?a=="pos"?"+=":"-=":a=="pos"?"-=":"+=")+h;e.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){f=="hide"&&e.hide();b.effects.restore(e,g);b.effects.removeWrapper(e);d.callback&&d.callback.apply(this,arguments);e.dequeue()}})})}})(jQuery);
(function(b){b.effects.explode=function(d){return this.queue(function(){var e=d.options.pieces?Math.round(Math.sqrt(d.options.pieces)):3,g=d.options.pieces?Math.round(Math.sqrt(d.options.pieces)):3;d.options.mode=d.options.mode=="toggle"?b(this).is(":visible")?"hide":"show":d.options.mode;var f=b(this).show().css("visibility","hidden"),a=f.offset();a.top-=parseInt(f.css("marginTop"),10)||0;a.left-=parseInt(f.css("marginLeft"),10)||0;for(var c=f.outerWidth(true),h=f.outerHeight(true),i=0;i<e;i++)for(var j=
0;j<g;j++)f.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-j*(c/g),top:-i*(h/e)}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:c/g,height:h/e,left:a.left+j*(c/g)+(d.options.mode=="show"?(j-Math.floor(g/2))*(c/g):0),top:a.top+i*(h/e)+(d.options.mode=="show"?(i-Math.floor(e/2))*(h/e):0),opacity:d.options.mode=="show"?0:1}).animate({left:a.left+j*(c/g)+(d.options.mode=="show"?0:(j-Math.floor(g/2))*(c/g)),top:a.top+
i*(h/e)+(d.options.mode=="show"?0:(i-Math.floor(e/2))*(h/e)),opacity:d.options.mode=="show"?1:0},d.duration||500);setTimeout(function(){d.options.mode=="show"?f.css({visibility:"visible"}):f.css({visibility:"visible"}).hide();d.callback&&d.callback.apply(f[0]);f.dequeue();b("div.ui-effects-explode").remove()},d.duration||500)})}})(jQuery);
(function(b){b.effects.fade=function(d){return this.queue(function(){var e=b(this),g=b.effects.setMode(e,d.options.mode||"hide");e.animate({opacity:g},{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){d.callback&&d.callback.apply(this,arguments);e.dequeue()}})})}})(jQuery);
(function(b){b.effects.fold=function(d){return this.queue(function(){var e=b(this),g=["position","top","bottom","left","right"],f=b.effects.setMode(e,d.options.mode||"hide"),a=d.options.size||15,c=!!d.options.horizFirst,h=d.duration?d.duration/2:b.fx.speeds._default/2;b.effects.save(e,g);e.show();var i=b.effects.createWrapper(e).css({overflow:"hidden"}),j=f=="show"!=c,n=j?["width","height"]:["height","width"];j=j?[i.width(),i.height()]:[i.height(),i.width()];var p=/([0-9]+)%/.exec(a);if(p)a=parseInt(p[1],
10)/100*j[f=="hide"?0:1];if(f=="show")i.css(c?{height:0,width:a}:{height:a,width:0});c={};p={};c[n[0]]=f=="show"?j[0]:a;p[n[1]]=f=="show"?j[1]:0;i.animate(c,h,d.options.easing).animate(p,h,d.options.easing,function(){f=="hide"&&e.hide();b.effects.restore(e,g);b.effects.removeWrapper(e);d.callback&&d.callback.apply(e[0],arguments);e.dequeue()})})}})(jQuery);
(function(b){b.effects.highlight=function(d){return this.queue(function(){var e=b(this),g=["backgroundImage","backgroundColor","opacity"],f=b.effects.setMode(e,d.options.mode||"show"),a={backgroundColor:e.css("backgroundColor")};if(f=="hide")a.opacity=0;b.effects.save(e,g);e.show().css({backgroundImage:"none",backgroundColor:d.options.color||"#ffff99"}).animate(a,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){f=="hide"&&e.hide();b.effects.restore(e,g);f=="show"&&!b.support.opacity&&
this.style.removeAttribute("filter");d.callback&&d.callback.apply(this,arguments);e.dequeue()}})})}})(jQuery);
(function(b){b.effects.pulsate=function(d){return this.queue(function(){var e=b(this),g=b.effects.setMode(e,d.options.mode||"show");times=(d.options.times||5)*2-1;duration=d.duration?d.duration/2:b.fx.speeds._default/2;isVisible=e.is(":visible");animateTo=0;if(!isVisible){e.css("opacity",0).show();animateTo=1}if(g=="hide"&&isVisible||g=="show"&&!isVisible)times--;for(g=0;g<times;g++){e.animate({opacity:animateTo},duration,d.options.easing);animateTo=(animateTo+1)%2}e.animate({opacity:animateTo},duration,
d.options.easing,function(){animateTo==0&&e.hide();d.callback&&d.callback.apply(this,arguments)});e.queue("fx",function(){e.dequeue()}).dequeue()})}})(jQuery);
(function(b){b.effects.puff=function(d){return this.queue(function(){var e=b(this),g=b.effects.setMode(e,d.options.mode||"hide"),f=parseInt(d.options.percent,10)||150,a=f/100,c={height:e.height(),width:e.width()};b.extend(d.options,{fade:true,mode:g,percent:g=="hide"?f:100,from:g=="hide"?c:{height:c.height*a,width:c.width*a}});e.effect("scale",d.options,d.duration,d.callback);e.dequeue()})};b.effects.scale=function(d){return this.queue(function(){var e=b(this),g=b.extend(true,{},d.options),f=b.effects.setMode(e,
d.options.mode||"effect"),a=parseInt(d.options.percent,10)||(parseInt(d.options.percent,10)==0?0:f=="hide"?0:100),c=d.options.direction||"both",h=d.options.origin;if(f!="effect"){g.origin=h||["middle","center"];g.restore=true}h={height:e.height(),width:e.width()};e.from=d.options.from||(f=="show"?{height:0,width:0}:h);a={y:c!="horizontal"?a/100:1,x:c!="vertical"?a/100:1};e.to={height:h.height*a.y,width:h.width*a.x};if(d.options.fade){if(f=="show"){e.from.opacity=0;e.to.opacity=1}if(f=="hide"){e.from.opacity=
1;e.to.opacity=0}}g.from=e.from;g.to=e.to;g.mode=f;e.effect("size",g,d.duration,d.callback);e.dequeue()})};b.effects.size=function(d){return this.queue(function(){var e=b(this),g=["position","top","bottom","left","right","width","height","overflow","opacity"],f=["position","top","bottom","left","right","overflow","opacity"],a=["width","height","overflow"],c=["fontSize"],h=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],i=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],
j=b.effects.setMode(e,d.options.mode||"effect"),n=d.options.restore||false,p=d.options.scale||"both",l=d.options.origin,k={height:e.height(),width:e.width()};e.from=d.options.from||k;e.to=d.options.to||k;if(l){l=b.effects.getBaseline(l,k);e.from.top=(k.height-e.from.height)*l.y;e.from.left=(k.width-e.from.width)*l.x;e.to.top=(k.height-e.to.height)*l.y;e.to.left=(k.width-e.to.width)*l.x}var m={from:{y:e.from.height/k.height,x:e.from.width/k.width},to:{y:e.to.height/k.height,x:e.to.width/k.width}};
if(p=="box"||p=="both"){if(m.from.y!=m.to.y){g=g.concat(h);e.from=b.effects.setTransition(e,h,m.from.y,e.from);e.to=b.effects.setTransition(e,h,m.to.y,e.to)}if(m.from.x!=m.to.x){g=g.concat(i);e.from=b.effects.setTransition(e,i,m.from.x,e.from);e.to=b.effects.setTransition(e,i,m.to.x,e.to)}}if(p=="content"||p=="both")if(m.from.y!=m.to.y){g=g.concat(c);e.from=b.effects.setTransition(e,c,m.from.y,e.from);e.to=b.effects.setTransition(e,c,m.to.y,e.to)}b.effects.save(e,n?g:f);e.show();b.effects.createWrapper(e);
e.css("overflow","hidden").css(e.from);if(p=="content"||p=="both"){h=h.concat(["marginTop","marginBottom"]).concat(c);i=i.concat(["marginLeft","marginRight"]);a=g.concat(h).concat(i);e.find("*[width]").each(function(){child=b(this);n&&b.effects.save(child,a);var o={height:child.height(),width:child.width()};child.from={height:o.height*m.from.y,width:o.width*m.from.x};child.to={height:o.height*m.to.y,width:o.width*m.to.x};if(m.from.y!=m.to.y){child.from=b.effects.setTransition(child,h,m.from.y,child.from);
child.to=b.effects.setTransition(child,h,m.to.y,child.to)}if(m.from.x!=m.to.x){child.from=b.effects.setTransition(child,i,m.from.x,child.from);child.to=b.effects.setTransition(child,i,m.to.x,child.to)}child.css(child.from);child.animate(child.to,d.duration,d.options.easing,function(){n&&b.effects.restore(child,a)})})}e.animate(e.to,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){e.to.opacity===0&&e.css("opacity",e.from.opacity);j=="hide"&&e.hide();b.effects.restore(e,
n?g:f);b.effects.removeWrapper(e);d.callback&&d.callback.apply(this,arguments);e.dequeue()}})})}})(jQuery);
(function(b){b.effects.shake=function(d){return this.queue(function(){var e=b(this),g=["position","top","bottom","left","right"];b.effects.setMode(e,d.options.mode||"effect");var f=d.options.direction||"left",a=d.options.distance||20,c=d.options.times||3,h=d.duration||d.options.duration||140;b.effects.save(e,g);e.show();b.effects.createWrapper(e);var i=f=="up"||f=="down"?"top":"left",j=f=="up"||f=="left"?"pos":"neg";f={};var n={},p={};f[i]=(j=="pos"?"-=":"+=")+a;n[i]=(j=="pos"?"+=":"-=")+a*2;p[i]=
(j=="pos"?"-=":"+=")+a*2;e.animate(f,h,d.options.easing);for(a=1;a<c;a++)e.animate(n,h,d.options.easing).animate(p,h,d.options.easing);e.animate(n,h,d.options.easing).animate(f,h/2,d.options.easing,function(){b.effects.restore(e,g);b.effects.removeWrapper(e);d.callback&&d.callback.apply(this,arguments)});e.queue("fx",function(){e.dequeue()});e.dequeue()})}})(jQuery);
(function(b){b.effects.slide=function(d){return this.queue(function(){var e=b(this),g=["position","top","bottom","left","right"],f=b.effects.setMode(e,d.options.mode||"show"),a=d.options.direction||"left";b.effects.save(e,g);e.show();b.effects.createWrapper(e).css({overflow:"hidden"});var c=a=="up"||a=="down"?"top":"left";a=a=="up"||a=="left"?"pos":"neg";var h=d.options.distance||(c=="top"?e.outerHeight({margin:true}):e.outerWidth({margin:true}));if(f=="show")e.css(c,a=="pos"?isNaN(h)?"-"+h:-h:h);
var i={};i[c]=(f=="show"?a=="pos"?"+=":"-=":a=="pos"?"-=":"+=")+h;e.animate(i,{queue:false,duration:d.duration,easing:d.options.easing,complete:function(){f=="hide"&&e.hide();b.effects.restore(e,g);b.effects.removeWrapper(e);d.callback&&d.callback.apply(this,arguments);e.dequeue()}})})}})(jQuery);
(function(b){b.effects.transfer=function(d){return this.queue(function(){var e=b(this),g=b(d.options.to),f=g.offset();g={top:f.top,left:f.left,height:g.innerHeight(),width:g.innerWidth()};f=e.offset();var a=b('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(d.options.className).css({top:f.top,left:f.left,height:e.innerHeight(),width:e.innerWidth(),position:"absolute"}).animate(g,d.duration,d.options.easing,function(){a.remove();d.callback&&d.callback.apply(e[0],arguments);
e.dequeue()})})}})(jQuery);
(function(b){b.widget("ui.accordion",{options:{active:0,animated:"slide",autoHeight:true,clearStyle:false,collapsible:false,event:"click",fillSpace:false,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:false,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase()}},_create:function(){var d=this,e=d.options;d.running=0;d.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix");d.headers=
d.element.find(e.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){e.disabled||b(this).addClass("ui-state-hover")}).bind("mouseleave.accordion",function(){e.disabled||b(this).removeClass("ui-state-hover")}).bind("focus.accordion",function(){e.disabled||b(this).addClass("ui-state-focus")}).bind("blur.accordion",function(){e.disabled||b(this).removeClass("ui-state-focus")});d.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
if(e.navigation){var g=d.element.find("a").filter(e.navigationFilter).eq(0);if(g.length){var f=g.closest(".ui-accordion-header");d.active=f.length?f:g.closest(".ui-accordion-content").prev()}}d.active=d._findActive(d.active||e.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");d.active.next().addClass("ui-accordion-content-active");d._createIcons();d.resize();d.element.attr("role","tablist");d.headers.attr("role","tab").bind("keydown.accordion",
function(a){return d._keydown(a)}).next().attr("role","tabpanel");d.headers.not(d.active||"").attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).next().hide();d.active.length?d.active.attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}):d.headers.eq(0).attr("tabIndex",0);b.browser.safari||d.headers.find("a").attr("tabIndex",-1);e.event&&d.headers.bind(e.event.split(" ").join(".accordion ")+".accordion",function(a){d._clickHandler.call(d,a,this);a.preventDefault()})},_createIcons:function(){var d=
this.options;if(d.icons){b("<span></span>").addClass("ui-icon "+d.icons.header).prependTo(this.headers);this.active.children(".ui-icon").toggleClass(d.icons.header).toggleClass(d.icons.headerSelected);this.element.addClass("ui-accordion-icons")}},_destroyIcons:function(){this.headers.children(".ui-icon").remove();this.element.removeClass("ui-accordion-icons")},destroy:function(){var d=this.options;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex");
this.headers.find("a").removeAttr("tabIndex");this._destroyIcons();var e=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");if(d.autoHeight||d.fillHeight)e.css("height","");return b.Widget.prototype.destroy.call(this)},_setOption:function(d,e){b.Widget.prototype._setOption.apply(this,arguments);d=="active"&&this.activate(e);if(d=="icons"){this._destroyIcons();
e&&this._createIcons()}if(d=="disabled")this.headers.add(this.headers.next())[e?"addClass":"removeClass"]("ui-accordion-disabled ui-state-disabled")},_keydown:function(d){if(!(this.options.disabled||d.altKey||d.ctrlKey)){var e=b.ui.keyCode,g=this.headers.length,f=this.headers.index(d.target),a=false;switch(d.keyCode){case e.RIGHT:case e.DOWN:a=this.headers[(f+1)%g];break;case e.LEFT:case e.UP:a=this.headers[(f-1+g)%g];break;case e.SPACE:case e.ENTER:this._clickHandler({target:d.target},d.target);
d.preventDefault()}if(a){b(d.target).attr("tabIndex",-1);b(a).attr("tabIndex",0);a.focus();return false}return true}},resize:function(){var d=this.options,e;if(d.fillSpace){if(b.browser.msie){var g=this.element.parent().css("overflow");this.element.parent().css("overflow","hidden")}e=this.element.parent().height();b.browser.msie&&this.element.parent().css("overflow",g);this.headers.each(function(){e-=b(this).outerHeight(true)});this.headers.next().each(function(){b(this).height(Math.max(0,e-b(this).innerHeight()+
b(this).height()))}).css("overflow","auto")}else if(d.autoHeight){e=0;this.headers.next().each(function(){e=Math.max(e,b(this).height("").height())}).height(e)}return this},activate:function(d){this.options.active=d;d=this._findActive(d)[0];this._clickHandler({target:d},d);return this},_findActive:function(d){return d?typeof d==="number"?this.headers.filter(":eq("+d+")"):this.headers.not(this.headers.not(d)):d===false?b([]):this.headers.filter(":eq(0)")},_clickHandler:function(d,e){var g=this.options;
if(!g.disabled)if(d.target){d=b(d.currentTarget||e);e=d[0]===this.active[0];g.active=g.collapsible&&e?false:this.headers.index(d);if(!(this.running||!g.collapsible&&e)){var f=this.active;i=d.next();c=this.active.next();h={options:g,newHeader:e&&g.collapsible?b([]):d,oldHeader:this.active,newContent:e&&g.collapsible?b([]):i,oldContent:c};var a=this.headers.index(this.active[0])>this.headers.index(d[0]);this.active=e?b([]):d;this._toggle(i,c,h,e,a);f.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(g.icons.headerSelected).addClass(g.icons.header);
if(!e){d.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(g.icons.header).addClass(g.icons.headerSelected);d.next().addClass("ui-accordion-content-active")}}}else if(g.collapsible){this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(g.icons.headerSelected).addClass(g.icons.header);this.active.next().addClass("ui-accordion-content-active");var c=this.active.next(),
h={options:g,newHeader:b([]),oldHeader:g.active,newContent:b([]),oldContent:c},i=this.active=b([]);this._toggle(i,c,h)}},_toggle:function(d,e,g,f,a){var c=this,h=c.options;c.toShow=d;c.toHide=e;c.data=g;var i=function(){if(c)return c._completed.apply(c,arguments)};c._trigger("changestart",null,c.data);c.running=e.size()===0?d.size():e.size();if(h.animated){g={};g=h.collapsible&&f?{toShow:b([]),toHide:e,complete:i,down:a,autoHeight:h.autoHeight||h.fillSpace}:{toShow:d,toHide:e,complete:i,down:a,autoHeight:h.autoHeight||
h.fillSpace};if(!h.proxied)h.proxied=h.animated;if(!h.proxiedDuration)h.proxiedDuration=h.duration;h.animated=b.isFunction(h.proxied)?h.proxied(g):h.proxied;h.duration=b.isFunction(h.proxiedDuration)?h.proxiedDuration(g):h.proxiedDuration;f=b.ui.accordion.animations;var j=h.duration,n=h.animated;if(n&&!f[n]&&!b.easing[n])n="slide";f[n]||(f[n]=function(p){this.slide(p,{easing:n,duration:j||700})});f[n](g)}else{if(h.collapsible&&f)d.toggle();else{e.hide();d.show()}i(true)}e.prev().attr({"aria-expanded":"false",
"aria-selected":"false",tabIndex:-1}).blur();d.prev().attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}).focus()},_completed:function(d){this.running=d?0:--this.running;if(!this.running){this.options.clearStyle&&this.toShow.add(this.toHide).css({height:"",overflow:""});this.toHide.removeClass("ui-accordion-content-active");if(this.toHide.length)this.toHide.parent()[0].className=this.toHide.parent()[0].className;this._trigger("change",null,this.data)}}});b.extend(b.ui.accordion,{version:"1.8.11",
animations:{slide:function(d,e){d=b.extend({easing:"swing",duration:300},d,e);if(d.toHide.size())if(d.toShow.size()){var g=d.toShow.css("overflow"),f=0,a={},c={},h;e=d.toShow;h=e[0].style.width;e.width(parseInt(e.parent().width(),10)-parseInt(e.css("paddingLeft"),10)-parseInt(e.css("paddingRight"),10)-(parseInt(e.css("borderLeftWidth"),10)||0)-(parseInt(e.css("borderRightWidth"),10)||0));b.each(["height","paddingTop","paddingBottom"],function(i,j){c[j]="hide";i=(""+b.css(d.toShow[0],j)).match(/^([\d+-.]+)(.*)$/);
a[j]={value:i[1],unit:i[2]||"px"}});d.toShow.css({height:0,overflow:"hidden"}).show();d.toHide.filter(":hidden").each(d.complete).end().filter(":visible").animate(c,{step:function(i,j){if(j.prop=="height")f=j.end-j.start===0?0:(j.now-j.start)/(j.end-j.start);d.toShow[0].style[j.prop]=f*a[j.prop].value+a[j.prop].unit},duration:d.duration,easing:d.easing,complete:function(){d.autoHeight||d.toShow.css("height","");d.toShow.css({width:h,overflow:g});d.complete()}})}else d.toHide.animate({height:"hide",
paddingTop:"hide",paddingBottom:"hide"},d);else d.toShow.animate({height:"show",paddingTop:"show",paddingBottom:"show"},d)},bounceslide:function(d){this.slide(d,{easing:d.down?"easeOutBounce":"swing",duration:d.down?1E3:200})}}})})(jQuery);
(function(b){var d=0;b.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:false,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var e=this,g=this.element[0].ownerDocument,f;this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(a){if(!(e.options.disabled||e.element.attr("readonly"))){f=
false;var c=b.ui.keyCode;switch(a.keyCode){case c.PAGE_UP:e._move("previousPage",a);break;case c.PAGE_DOWN:e._move("nextPage",a);break;case c.UP:e._move("previous",a);a.preventDefault();break;case c.DOWN:e._move("next",a);a.preventDefault();break;case c.ENTER:case c.NUMPAD_ENTER:if(e.menu.active){f=true;a.preventDefault()}case c.TAB:if(!e.menu.active)return;e.menu.select(a);break;case c.ESCAPE:e.element.val(e.term);e.close(a);break;default:clearTimeout(e.searching);e.searching=setTimeout(function(){if(e.term!=
e.element.val()){e.selectedItem=null;e.search(null,a)}},e.options.delay);break}}}).bind("keypress.autocomplete",function(a){if(f){f=false;a.preventDefault()}}).bind("focus.autocomplete",function(){if(!e.options.disabled){e.selectedItem=null;e.previous=e.element.val()}}).bind("blur.autocomplete",function(a){if(!e.options.disabled){clearTimeout(e.searching);e.closing=setTimeout(function(){e.close(a);e._change(a)},150)}});this._initSource();this.response=function(){return e._response.apply(e,arguments)};
this.menu=b("<ul></ul>").addClass("ui-autocomplete").appendTo(b(this.options.appendTo||"body",g)[0]).mousedown(function(a){var c=e.menu.element[0];b(a.target).closest(".ui-menu-item").length||setTimeout(function(){b(document).one("mousedown",function(h){h.target!==e.element[0]&&h.target!==c&&!b.ui.contains(c,h.target)&&e.close()})},1);setTimeout(function(){clearTimeout(e.closing)},13)}).menu({focus:function(a,c){c=c.item.data("item.autocomplete");false!==e._trigger("focus",a,{item:c})&&/^key/.test(a.originalEvent.type)&&
e.element.val(c.value)},selected:function(a,c){var h=c.item.data("item.autocomplete"),i=e.previous;if(e.element[0]!==g.activeElement){e.element.focus();e.previous=i;setTimeout(function(){e.previous=i;e.selectedItem=h},1)}false!==e._trigger("select",a,{item:h})&&e.element.val(h.value);e.term=e.element.val();e.close(a);e.selectedItem=h},blur:function(){e.menu.element.is(":visible")&&e.element.val()!==e.term&&e.element.val(e.term)}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu");
b.fn.bgiframe&&this.menu.element.bgiframe()},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");this.menu.element.remove();b.Widget.prototype.destroy.call(this)},_setOption:function(e,g){b.Widget.prototype._setOption.apply(this,arguments);e==="source"&&this._initSource();if(e==="appendTo")this.menu.element.appendTo(b(g||"body",this.element[0].ownerDocument)[0]);e==="disabled"&&
g&&this.xhr&&this.xhr.abort()},_initSource:function(){var e=this,g,f;if(b.isArray(this.options.source)){g=this.options.source;this.source=function(a,c){c(b.ui.autocomplete.filter(g,a.term))}}else if(typeof this.options.source==="string"){f=this.options.source;this.source=function(a,c){e.xhr&&e.xhr.abort();e.xhr=b.ajax({url:f,data:a,dataType:"json",autocompleteRequest:++d,success:function(h){this.autocompleteRequest===d&&c(h)},error:function(){this.autocompleteRequest===d&&c([])}})}}else this.source=
this.options.source},search:function(e,g){e=e!=null?e:this.element.val();this.term=this.element.val();if(e.length<this.options.minLength)return this.close(g);clearTimeout(this.closing);if(this._trigger("search",g)!==false)return this._search(e)},_search:function(e){this.pending++;this.element.addClass("ui-autocomplete-loading");this.source({term:e},this.response)},_response:function(e){if(!this.options.disabled&&e&&e.length){e=this._normalize(e);this._suggest(e);this._trigger("open")}else this.close();
this.pending--;this.pending||this.element.removeClass("ui-autocomplete-loading")},close:function(e){clearTimeout(this.closing);if(this.menu.element.is(":visible")){this.menu.element.hide();this.menu.deactivate();this._trigger("close",e)}},_change:function(e){this.previous!==this.element.val()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(e){if(e.length&&e[0].label&&e[0].value)return e;return b.map(e,function(g){if(typeof g==="string")return{label:g,value:g};return b.extend({label:g.label||
g.value,value:g.value||g.label},g)})},_suggest:function(e){var g=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(g,e);this.menu.deactivate();this.menu.refresh();g.show();this._resizeMenu();g.position(b.extend({of:this.element},this.options.position));this.options.autoFocus&&this.menu.next(new b.Event("mouseover"))},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth(),this.element.outerWidth()))},_renderMenu:function(e,g){var f=this;
b.each(g,function(a,c){f._renderItem(e,c)})},_renderItem:function(e,g){return b("<li></li>").data("item.autocomplete",g).append(b("<a></a>").text(g.label)).appendTo(e)},_move:function(e,g){if(this.menu.element.is(":visible"))if(this.menu.first()&&/^previous/.test(e)||this.menu.last()&&/^next/.test(e)){this.element.val(this.term);this.menu.deactivate()}else this.menu[e](g);else this.search(null,g)},widget:function(){return this.menu.element}});b.extend(b.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,
"\\$&")},filter:function(e,g){var f=new RegExp(b.ui.autocomplete.escapeRegex(g),"i");return b.grep(e,function(a){return f.test(a.label||a.value||a)})}})})(jQuery);
(function(b){b.widget("ui.menu",{_create:function(){var d=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(e){if(b(e.target).closest(".ui-menu-item a").length){e.preventDefault();d.select(e)}});this.refresh()},refresh:function(){var d=this;this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem").children("a").addClass("ui-corner-all").attr("tabindex",
-1).mouseenter(function(e){d.activate(e,b(this).parent())}).mouseleave(function(){d.deactivate()})},activate:function(d,e){this.deactivate();if(this.hasScroll()){var g=e.offset().top-this.element.offset().top,f=this.element.attr("scrollTop"),a=this.element.height();if(g<0)this.element.attr("scrollTop",f+g);else g>=a&&this.element.attr("scrollTop",f+g-a+e.height())}this.active=e.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end();this._trigger("focus",d,{item:e})},
deactivate:function(){if(this.active){this.active.children("a").removeClass("ui-state-hover").removeAttr("id");this._trigger("blur");this.active=null}},next:function(d){this.move("next",".ui-menu-item:first",d)},previous:function(d){this.move("prev",".ui-menu-item:last",d)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(d,e,g){if(this.active){d=this.active[d+"All"](".ui-menu-item").eq(0);
d.length?this.activate(g,d):this.activate(g,this.element.children(e))}else this.activate(g,this.element.children(e))},nextPage:function(d){if(this.hasScroll())if(!this.active||this.last())this.activate(d,this.element.children(".ui-menu-item:first"));else{var e=this.active.offset().top,g=this.element.height(),f=this.element.children(".ui-menu-item").filter(function(){var a=b(this).offset().top-e-g+b(this).height();return a<10&&a>-10});f.length||(f=this.element.children(".ui-menu-item:last"));this.activate(d,
f)}else this.activate(d,this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"))},previousPage:function(d){if(this.hasScroll())if(!this.active||this.first())this.activate(d,this.element.children(".ui-menu-item:last"));else{var e=this.active.offset().top,g=this.element.height();result=this.element.children(".ui-menu-item").filter(function(){var f=b(this).offset().top-e+g-b(this).height();return f<10&&f>-10});result.length||(result=this.element.children(".ui-menu-item:first"));
this.activate(d,result)}else this.activate(d,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"))},hasScroll:function(){return this.element.height()<this.element.attr("scrollHeight")},select:function(d){this._trigger("selected",d,{item:this.active})}})})(jQuery);
(function(b){var d,e=function(f){b(":ui-button",f.target.form).each(function(){var a=b(this).data("button");setTimeout(function(){a.refresh()},1)})},g=function(f){var a=f.name,c=f.form,h=b([]);if(a)h=c?b(c).find("[name='"+a+"']"):b("[name='"+a+"']",f.ownerDocument).filter(function(){return!this.form});return h};b.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",
e);if(typeof this.options.disabled!=="boolean")this.options.disabled=this.element.attr("disabled");this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var f=this,a=this.options,c=this.type==="checkbox"||this.type==="radio",h="ui-state-hover"+(!c?" ui-state-active":"");if(a.label===null)a.label=this.buttonElement.html();if(this.element.is(":disabled"))a.disabled=true;this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role","button").bind("mouseenter.button",
function(){if(!a.disabled){b(this).addClass("ui-state-hover");this===d&&b(this).addClass("ui-state-active")}}).bind("mouseleave.button",function(){a.disabled||b(this).removeClass(h)}).bind("focus.button",function(){b(this).addClass("ui-state-focus")}).bind("blur.button",function(){b(this).removeClass("ui-state-focus")});c&&this.element.bind("change.button",function(){f.refresh()});if(this.type==="checkbox")this.buttonElement.bind("click.button",function(){if(a.disabled)return false;b(this).toggleClass("ui-state-active");
f.buttonElement.attr("aria-pressed",f.element[0].checked)});else if(this.type==="radio")this.buttonElement.bind("click.button",function(){if(a.disabled)return false;b(this).addClass("ui-state-active");f.buttonElement.attr("aria-pressed",true);var i=f.element[0];g(i).not(i).map(function(){return b(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed",false)});else{this.buttonElement.bind("mousedown.button",function(){if(a.disabled)return false;b(this).addClass("ui-state-active");
d=this;b(document).one("mouseup",function(){d=null})}).bind("mouseup.button",function(){if(a.disabled)return false;b(this).removeClass("ui-state-active")}).bind("keydown.button",function(i){if(a.disabled)return false;if(i.keyCode==b.ui.keyCode.SPACE||i.keyCode==b.ui.keyCode.ENTER)b(this).addClass("ui-state-active")}).bind("keyup.button",function(){b(this).removeClass("ui-state-active")});this.buttonElement.is("a")&&this.buttonElement.keyup(function(i){i.keyCode===b.ui.keyCode.SPACE&&b(this).click()})}this._setOption("disabled",
a.disabled)},_determineButtonType:function(){this.type=this.element.is(":checkbox")?"checkbox":this.element.is(":radio")?"radio":this.element.is("input")?"input":"button";if(this.type==="checkbox"||this.type==="radio"){var f=this.element.parents().filter(":last"),a="label[for="+this.element.attr("id")+"]";this.buttonElement=f.find(a);if(!this.buttonElement.length){f=f.length?f.siblings():this.element.siblings();this.buttonElement=f.filter(a);if(!this.buttonElement.length)this.buttonElement=f.find(a)}this.element.addClass("ui-helper-hidden-accessible");
(f=this.element.is(":checked"))&&this.buttonElement.addClass("ui-state-active");this.buttonElement.attr("aria-pressed",f)}else this.buttonElement=this.element},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
this.hasTitle||this.buttonElement.removeAttr("title");b.Widget.prototype.destroy.call(this)},_setOption:function(f,a){b.Widget.prototype._setOption.apply(this,arguments);if(f==="disabled")a?this.element.attr("disabled",true):this.element.removeAttr("disabled");this._resetButton()},refresh:function(){var f=this.element.is(":disabled");f!==this.options.disabled&&this._setOption("disabled",f);if(this.type==="radio")g(this.element[0]).each(function(){b(this).is(":checked")?b(this).button("widget").addClass("ui-state-active").attr("aria-pressed",
true):b(this).button("widget").removeClass("ui-state-active").attr("aria-pressed",false)});else if(this.type==="checkbox")this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed",true):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed",false)},_resetButton:function(){if(this.type==="input")this.options.label&&this.element.val(this.options.label);else{var f=this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
a=b("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(f.empty()).text(),c=this.options.icons,h=c.primary&&c.secondary,i=[];if(c.primary||c.secondary){if(this.options.text)i.push("ui-button-text-icon"+(h?"s":c.primary?"-primary":"-secondary"));c.primary&&f.prepend("<span class='ui-button-icon-primary ui-icon "+c.primary+"'></span>");c.secondary&&f.append("<span class='ui-button-icon-secondary ui-icon "+c.secondary+"'></span>");if(!this.options.text){i.push(h?"ui-button-icons-only":
"ui-button-icon-only");this.hasTitle||f.attr("title",a)}}else i.push("ui-button-text-only");f.addClass(i.join(" "))}}});b.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(f,a){f==="disabled"&&this.buttons.button("option",f,a);b.Widget.prototype._setOption.apply(this,arguments)},refresh:function(){this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return b(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end()},
destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return b(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");b.Widget.prototype.destroy.call(this)}})})(jQuery);
(function(b,d){function e(){this.debug=false;this._curInst=null;this._keyEvent=false;this._disabledInputs=[];this._inDialog=this._datepickerShowing=false;this._mainDivId="ui-datepicker-div";this._inlineClass="ui-datepicker-inline";this._appendClass="ui-datepicker-append";this._triggerClass="ui-datepicker-trigger";this._dialogClass="ui-datepicker-dialog";this._disableClass="ui-datepicker-disabled";this._unselectableClass="ui-datepicker-unselectable";this._currentClass="ui-datepicker-current-day";this._dayOverClass=
"ui-datepicker-days-cell-over";this.regional=[];this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su",
"Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:false,showMonthAfterYear:false,yearSuffix:""};this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:false,hideIfNoPrevNext:false,navigationAsDateFormat:false,gotoCurrent:false,changeMonth:false,changeYear:false,yearRange:"c-10:c+10",showOtherMonths:false,selectOtherMonths:false,showWeek:false,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",
minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:true,showButtonPanel:false,autoSize:false};b.extend(this._defaults,this.regional[""]);this.dpDiv=b('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')}function g(a,c){b.extend(a,c);for(var h in c)if(c[h]==
null||c[h]==d)a[h]=c[h];return a}b.extend(b.ui,{datepicker:{version:"1.8.11"}});var f=(new Date).getTime();b.extend(e.prototype,{markerClassName:"hasDatepicker",log:function(){this.debug&&console.log.apply("",arguments)},_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(a){g(this._defaults,a||{});return this},_attachDatepicker:function(a,c){var h=null;for(var i in this._defaults){var j=a.getAttribute("date:"+i);if(j){h=h||{};try{h[i]=eval(j)}catch(n){h[i]=j}}}i=a.nodeName.toLowerCase();
j=i=="div"||i=="span";if(!a.id){this.uuid+=1;a.id="dp"+this.uuid}var p=this._newInst(b(a),j);p.settings=b.extend({},c||{},h||{});if(i=="input")this._connectDatepicker(a,p);else j&&this._inlineDatepicker(a,p)},_newInst:function(a,c){return{id:a[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1"),input:a,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:c,dpDiv:!c?this.dpDiv:b('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')}},
_connectDatepicker:function(a,c){var h=b(a);c.append=b([]);c.trigger=b([]);if(!h.hasClass(this.markerClassName)){this._attachments(h,c);h.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(i,j,n){c.settings[j]=n}).bind("getData.datepicker",function(i,j){return this._get(c,j)});this._autoSize(c);b.data(a,"datepicker",c)}},_attachments:function(a,c){var h=this._get(c,"appendText"),i=this._get(c,"isRTL");c.append&&
c.append.remove();if(h){c.append=b('<span class="'+this._appendClass+'">'+h+"</span>");a[i?"before":"after"](c.append)}a.unbind("focus",this._showDatepicker);c.trigger&&c.trigger.remove();h=this._get(c,"showOn");if(h=="focus"||h=="both")a.focus(this._showDatepicker);if(h=="button"||h=="both"){h=this._get(c,"buttonText");var j=this._get(c,"buttonImage");c.trigger=b(this._get(c,"buttonImageOnly")?b("<img/>").addClass(this._triggerClass).attr({src:j,alt:h,title:h}):b('<button type="button"></button>').addClass(this._triggerClass).html(j==
""?h:b("<img/>").attr({src:j,alt:h,title:h})));a[i?"before":"after"](c.trigger);c.trigger.click(function(){b.datepicker._datepickerShowing&&b.datepicker._lastInput==a[0]?b.datepicker._hideDatepicker():b.datepicker._showDatepicker(a[0]);return false})}},_autoSize:function(a){if(this._get(a,"autoSize")&&!a.inline){var c=new Date(2009,11,20),h=this._get(a,"dateFormat");if(h.match(/[DM]/)){var i=function(j){for(var n=0,p=0,l=0;l<j.length;l++)if(j[l].length>n){n=j[l].length;p=l}return p};c.setMonth(i(this._get(a,
h.match(/MM/)?"monthNames":"monthNamesShort")));c.setDate(i(this._get(a,h.match(/DD/)?"dayNames":"dayNamesShort"))+20-c.getDay())}a.input.attr("size",this._formatDate(a,c).length)}},_inlineDatepicker:function(a,c){var h=b(a);if(!h.hasClass(this.markerClassName)){h.addClass(this.markerClassName).append(c.dpDiv).bind("setData.datepicker",function(i,j,n){c.settings[j]=n}).bind("getData.datepicker",function(i,j){return this._get(c,j)});b.data(a,"datepicker",c);this._setDate(c,this._getDefaultDate(c),
true);this._updateDatepicker(c);this._updateAlternate(c);c.dpDiv.show()}},_dialogDatepicker:function(a,c,h,i,j){a=this._dialogInst;if(!a){this.uuid+=1;this._dialogInput=b('<input type="text" id="'+("dp"+this.uuid)+'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');this._dialogInput.keydown(this._doKeyDown);b("body").append(this._dialogInput);a=this._dialogInst=this._newInst(this._dialogInput,false);a.settings={};b.data(this._dialogInput[0],"datepicker",a)}g(a.settings,i||{});
c=c&&c.constructor==Date?this._formatDate(a,c):c;this._dialogInput.val(c);this._pos=j?j.length?j:[j.pageX,j.pageY]:null;if(!this._pos)this._pos=[document.documentElement.clientWidth/2-100+(document.documentElement.scrollLeft||document.body.scrollLeft),document.documentElement.clientHeight/2-150+(document.documentElement.scrollTop||document.body.scrollTop)];this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px");a.settings.onSelect=h;this._inDialog=true;this.dpDiv.addClass(this._dialogClass);
this._showDatepicker(this._dialogInput[0]);b.blockUI&&b.blockUI(this.dpDiv);b.data(this._dialogInput[0],"datepicker",a);return this},_destroyDatepicker:function(a){var c=b(a),h=b.data(a,"datepicker");if(c.hasClass(this.markerClassName)){var i=a.nodeName.toLowerCase();b.removeData(a,"datepicker");if(i=="input"){h.append.remove();h.trigger.remove();c.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",
this._doKeyUp)}else if(i=="div"||i=="span")c.removeClass(this.markerClassName).empty()}},_enableDatepicker:function(a){var c=b(a),h=b.data(a,"datepicker");if(c.hasClass(this.markerClassName)){var i=a.nodeName.toLowerCase();if(i=="input"){a.disabled=false;h.trigger.filter("button").each(function(){this.disabled=false}).end().filter("img").css({opacity:"1.0",cursor:""})}else if(i=="div"||i=="span")c.children("."+this._inlineClass).children().removeClass("ui-state-disabled");this._disabledInputs=b.map(this._disabledInputs,
function(j){return j==a?null:j})}},_disableDatepicker:function(a){var c=b(a),h=b.data(a,"datepicker");if(c.hasClass(this.markerClassName)){var i=a.nodeName.toLowerCase();if(i=="input"){a.disabled=true;h.trigger.filter("button").each(function(){this.disabled=true}).end().filter("img").css({opacity:"0.5",cursor:"default"})}else if(i=="div"||i=="span")c.children("."+this._inlineClass).children().addClass("ui-state-disabled");this._disabledInputs=b.map(this._disabledInputs,function(j){return j==a?null:
j});this._disabledInputs[this._disabledInputs.length]=a}},_isDisabledDatepicker:function(a){if(!a)return false;for(var c=0;c<this._disabledInputs.length;c++)if(this._disabledInputs[c]==a)return true;return false},_getInst:function(a){try{return b.data(a,"datepicker")}catch(c){throw"Missing instance data for this datepicker";}},_optionDatepicker:function(a,c,h){var i=this._getInst(a);if(arguments.length==2&&typeof c=="string")return c=="defaults"?b.extend({},b.datepicker._defaults):i?c=="all"?b.extend({},
i.settings):this._get(i,c):null;var j=c||{};if(typeof c=="string"){j={};j[c]=h}if(i){this._curInst==i&&this._hideDatepicker();var n=this._getDateDatepicker(a,true),p=this._getMinMaxDate(i,"min"),l=this._getMinMaxDate(i,"max");g(i.settings,j);if(p!==null&&j.dateFormat!==d&&j.minDate===d)i.settings.minDate=this._formatDate(i,p);if(l!==null&&j.dateFormat!==d&&j.maxDate===d)i.settings.maxDate=this._formatDate(i,l);this._attachments(b(a),i);this._autoSize(i);this._setDateDatepicker(a,n);this._updateDatepicker(i)}},
_changeDatepicker:function(a,c,h){this._optionDatepicker(a,c,h)},_refreshDatepicker:function(a){(a=this._getInst(a))&&this._updateDatepicker(a)},_setDateDatepicker:function(a,c){if(a=this._getInst(a)){this._setDate(a,c);this._updateDatepicker(a);this._updateAlternate(a)}},_getDateDatepicker:function(a,c){(a=this._getInst(a))&&!a.inline&&this._setDateFromField(a,c);return a?this._getDate(a):null},_doKeyDown:function(a){var c=b.datepicker._getInst(a.target),h=true,i=c.dpDiv.is(".ui-datepicker-rtl");
c._keyEvent=true;if(b.datepicker._datepickerShowing)switch(a.keyCode){case 9:b.datepicker._hideDatepicker();h=false;break;case 13:h=b("td."+b.datepicker._dayOverClass+":not(."+b.datepicker._currentClass+")",c.dpDiv);h[0]?b.datepicker._selectDay(a.target,c.selectedMonth,c.selectedYear,h[0]):b.datepicker._hideDatepicker();return false;case 27:b.datepicker._hideDatepicker();break;case 33:b.datepicker._adjustDate(a.target,a.ctrlKey?-b.datepicker._get(c,"stepBigMonths"):-b.datepicker._get(c,"stepMonths"),
"M");break;case 34:b.datepicker._adjustDate(a.target,a.ctrlKey?+b.datepicker._get(c,"stepBigMonths"):+b.datepicker._get(c,"stepMonths"),"M");break;case 35:if(a.ctrlKey||a.metaKey)b.datepicker._clearDate(a.target);h=a.ctrlKey||a.metaKey;break;case 36:if(a.ctrlKey||a.metaKey)b.datepicker._gotoToday(a.target);h=a.ctrlKey||a.metaKey;break;case 37:if(a.ctrlKey||a.metaKey)b.datepicker._adjustDate(a.target,i?+1:-1,"D");h=a.ctrlKey||a.metaKey;if(a.originalEvent.altKey)b.datepicker._adjustDate(a.target,a.ctrlKey?
-b.datepicker._get(c,"stepBigMonths"):-b.datepicker._get(c,"stepMonths"),"M");break;case 38:if(a.ctrlKey||a.metaKey)b.datepicker._adjustDate(a.target,-7,"D");h=a.ctrlKey||a.metaKey;break;case 39:if(a.ctrlKey||a.metaKey)b.datepicker._adjustDate(a.target,i?-1:+1,"D");h=a.ctrlKey||a.metaKey;if(a.originalEvent.altKey)b.datepicker._adjustDate(a.target,a.ctrlKey?+b.datepicker._get(c,"stepBigMonths"):+b.datepicker._get(c,"stepMonths"),"M");break;case 40:if(a.ctrlKey||a.metaKey)b.datepicker._adjustDate(a.target,
+7,"D");h=a.ctrlKey||a.metaKey;break;default:h=false}else if(a.keyCode==36&&a.ctrlKey)b.datepicker._showDatepicker(this);else h=false;if(h){a.preventDefault();a.stopPropagation()}},_doKeyPress:function(a){var c=b.datepicker._getInst(a.target);if(b.datepicker._get(c,"constrainInput")){c=b.datepicker._possibleChars(b.datepicker._get(c,"dateFormat"));var h=String.fromCharCode(a.charCode==d?a.keyCode:a.charCode);return a.ctrlKey||a.metaKey||h<" "||!c||c.indexOf(h)>-1}},_doKeyUp:function(a){a=b.datepicker._getInst(a.target);
if(a.input.val()!=a.lastVal)try{if(b.datepicker.parseDate(b.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,b.datepicker._getFormatConfig(a))){b.datepicker._setDateFromField(a);b.datepicker._updateAlternate(a);b.datepicker._updateDatepicker(a)}}catch(c){b.datepicker.log(c)}return true},_showDatepicker:function(a){a=a.target||a;if(a.nodeName.toLowerCase()!="input")a=b("input",a.parentNode)[0];if(!(b.datepicker._isDisabledDatepicker(a)||b.datepicker._lastInput==a)){var c=b.datepicker._getInst(a);
b.datepicker._curInst&&b.datepicker._curInst!=c&&b.datepicker._curInst.dpDiv.stop(true,true);var h=b.datepicker._get(c,"beforeShow");g(c.settings,h?h.apply(a,[a,c]):{});c.lastVal=null;b.datepicker._lastInput=a;b.datepicker._setDateFromField(c);if(b.datepicker._inDialog)a.value="";if(!b.datepicker._pos){b.datepicker._pos=b.datepicker._findPos(a);b.datepicker._pos[1]+=a.offsetHeight}var i=false;b(a).parents().each(function(){i|=b(this).css("position")=="fixed";return!i});if(i&&b.browser.opera){b.datepicker._pos[0]-=
document.documentElement.scrollLeft;b.datepicker._pos[1]-=document.documentElement.scrollTop}h={left:b.datepicker._pos[0],top:b.datepicker._pos[1]};b.datepicker._pos=null;c.dpDiv.empty();c.dpDiv.css({position:"absolute",display:"block",top:"-1000px"});b.datepicker._updateDatepicker(c);h=b.datepicker._checkOffset(c,h,i);c.dpDiv.css({position:b.datepicker._inDialog&&b.blockUI?"static":i?"fixed":"absolute",display:"none",left:h.left+"px",top:h.top+"px"});if(!c.inline){h=b.datepicker._get(c,"showAnim");
var j=b.datepicker._get(c,"duration"),n=function(){b.datepicker._datepickerShowing=true;var p=c.dpDiv.find("iframe.ui-datepicker-cover");if(p.length){var l=b.datepicker._getBorders(c.dpDiv);p.css({left:-l[0],top:-l[1],width:c.dpDiv.outerWidth(),height:c.dpDiv.outerHeight()})}};c.dpDiv.zIndex(b(a).zIndex()+1);b.effects&&b.effects[h]?c.dpDiv.show(h,b.datepicker._get(c,"showOptions"),j,n):c.dpDiv[h||"show"](h?j:null,n);if(!h||!j)n();c.input.is(":visible")&&!c.input.is(":disabled")&&c.input.focus();b.datepicker._curInst=
c}}},_updateDatepicker:function(a){var c=this,h=b.datepicker._getBorders(a.dpDiv);a.dpDiv.empty().append(this._generateHTML(a));var i=a.dpDiv.find("iframe.ui-datepicker-cover");i.length&&i.css({left:-h[0],top:-h[1],width:a.dpDiv.outerWidth(),height:a.dpDiv.outerHeight()});a.dpDiv.find("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a").bind("mouseout",function(){b(this).removeClass("ui-state-hover");this.className.indexOf("ui-datepicker-prev")!=-1&&b(this).removeClass("ui-datepicker-prev-hover");
this.className.indexOf("ui-datepicker-next")!=-1&&b(this).removeClass("ui-datepicker-next-hover")}).bind("mouseover",function(){if(!c._isDisabledDatepicker(a.inline?a.dpDiv.parent()[0]:a.input[0])){b(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");b(this).addClass("ui-state-hover");this.className.indexOf("ui-datepicker-prev")!=-1&&b(this).addClass("ui-datepicker-prev-hover");this.className.indexOf("ui-datepicker-next")!=-1&&b(this).addClass("ui-datepicker-next-hover")}}).end().find("."+
this._dayOverClass+" a").trigger("mouseover").end();h=this._getNumberOfMonths(a);i=h[1];i>1?a.dpDiv.addClass("ui-datepicker-multi-"+i).css("width",17*i+"em"):a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");a.dpDiv[(h[0]!=1||h[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi");a.dpDiv[(this._get(a,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl");a==b.datepicker._curInst&&b.datepicker._datepickerShowing&&a.input&&a.input.is(":visible")&&!a.input.is(":disabled")&&
a.input[0]!=document.activeElement&&a.input.focus();if(a.yearshtml){var j=a.yearshtml;setTimeout(function(){j===a.yearshtml&&a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml);j=a.yearshtml=null},0)}},_getBorders:function(a){var c=function(h){return{thin:1,medium:2,thick:3}[h]||h};return[parseFloat(c(a.css("border-left-width"))),parseFloat(c(a.css("border-top-width")))]},_checkOffset:function(a,c,h){var i=a.dpDiv.outerWidth(),j=a.dpDiv.outerHeight(),n=a.input?a.input.outerWidth():
0,p=a.input?a.input.outerHeight():0,l=document.documentElement.clientWidth+b(document).scrollLeft(),k=document.documentElement.clientHeight+b(document).scrollTop();c.left-=this._get(a,"isRTL")?i-n:0;c.left-=h&&c.left==a.input.offset().left?b(document).scrollLeft():0;c.top-=h&&c.top==a.input.offset().top+p?b(document).scrollTop():0;c.left-=Math.min(c.left,c.left+i>l&&l>i?Math.abs(c.left+i-l):0);c.top-=Math.min(c.top,c.top+j>k&&k>j?Math.abs(j+p):0);return c},_findPos:function(a){for(var c=this._get(this._getInst(a),
"isRTL");a&&(a.type=="hidden"||a.nodeType!=1||b.expr.filters.hidden(a));)a=a[c?"previousSibling":"nextSibling"];a=b(a).offset();return[a.left,a.top]},_hideDatepicker:function(a){var c=this._curInst;if(!(!c||a&&c!=b.data(a,"datepicker")))if(this._datepickerShowing){a=this._get(c,"showAnim");var h=this._get(c,"duration"),i=function(){b.datepicker._tidyDialog(c);this._curInst=null};b.effects&&b.effects[a]?c.dpDiv.hide(a,b.datepicker._get(c,"showOptions"),h,i):c.dpDiv[a=="slideDown"?"slideUp":a=="fadeIn"?
"fadeOut":"hide"](a?h:null,i);a||i();if(a=this._get(c,"onClose"))a.apply(c.input?c.input[0]:null,[c.input?c.input.val():"",c]);this._datepickerShowing=false;this._lastInput=null;if(this._inDialog){this._dialogInput.css({position:"absolute",left:"0",top:"-100px"});if(b.blockUI){b.unblockUI();b("body").append(this.dpDiv)}}this._inDialog=false}},_tidyDialog:function(a){a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(a){if(b.datepicker._curInst){a=
b(a.target);a[0].id!=b.datepicker._mainDivId&&a.parents("#"+b.datepicker._mainDivId).length==0&&!a.hasClass(b.datepicker.markerClassName)&&!a.hasClass(b.datepicker._triggerClass)&&b.datepicker._datepickerShowing&&!(b.datepicker._inDialog&&b.blockUI)&&b.datepicker._hideDatepicker()}},_adjustDate:function(a,c,h){a=b(a);var i=this._getInst(a[0]);if(!this._isDisabledDatepicker(a[0])){this._adjustInstDate(i,c+(h=="M"?this._get(i,"showCurrentAtPos"):0),h);this._updateDatepicker(i)}},_gotoToday:function(a){a=
b(a);var c=this._getInst(a[0]);if(this._get(c,"gotoCurrent")&&c.currentDay){c.selectedDay=c.currentDay;c.drawMonth=c.selectedMonth=c.currentMonth;c.drawYear=c.selectedYear=c.currentYear}else{var h=new Date;c.selectedDay=h.getDate();c.drawMonth=c.selectedMonth=h.getMonth();c.drawYear=c.selectedYear=h.getFullYear()}this._notifyChange(c);this._adjustDate(a)},_selectMonthYear:function(a,c,h){a=b(a);var i=this._getInst(a[0]);i._selectingMonthYear=false;i["selected"+(h=="M"?"Month":"Year")]=i["draw"+(h==
"M"?"Month":"Year")]=parseInt(c.options[c.selectedIndex].value,10);this._notifyChange(i);this._adjustDate(a)},_clickMonthYear:function(a){var c=this._getInst(b(a)[0]);c.input&&c._selectingMonthYear&&setTimeout(function(){c.input.focus()},0);c._selectingMonthYear=!c._selectingMonthYear},_selectDay:function(a,c,h,i){var j=b(a);if(!(b(i).hasClass(this._unselectableClass)||this._isDisabledDatepicker(j[0]))){j=this._getInst(j[0]);j.selectedDay=j.currentDay=b("a",i).html();j.selectedMonth=j.currentMonth=
c;j.selectedYear=j.currentYear=h;this._selectDate(a,this._formatDate(j,j.currentDay,j.currentMonth,j.currentYear))}},_clearDate:function(a){a=b(a);this._getInst(a[0]);this._selectDate(a,"")},_selectDate:function(a,c){a=this._getInst(b(a)[0]);c=c!=null?c:this._formatDate(a);a.input&&a.input.val(c);this._updateAlternate(a);var h=this._get(a,"onSelect");if(h)h.apply(a.input?a.input[0]:null,[c,a]);else a.input&&a.input.trigger("change");if(a.inline)this._updateDatepicker(a);else{this._hideDatepicker();
this._lastInput=a.input[0];typeof a.input[0]!="object"&&a.input.focus();this._lastInput=null}},_updateAlternate:function(a){var c=this._get(a,"altField");if(c){var h=this._get(a,"altFormat")||this._get(a,"dateFormat"),i=this._getDate(a),j=this.formatDate(h,i,this._getFormatConfig(a));b(c).each(function(){b(this).val(j)})}},noWeekends:function(a){a=a.getDay();return[a>0&&a<6,""]},iso8601Week:function(a){a=new Date(a.getTime());a.setDate(a.getDate()+4-(a.getDay()||7));var c=a.getTime();a.setMonth(0);
a.setDate(1);return Math.floor(Math.round((c-a)/864E5)/7)+1},parseDate:function(a,c,h){if(a==null||c==null)throw"Invalid arguments";c=typeof c=="object"?c.toString():c+"";if(c=="")return null;var i=(h?h.shortYearCutoff:null)||this._defaults.shortYearCutoff;i=typeof i!="string"?i:(new Date).getFullYear()%100+parseInt(i,10);for(var j=(h?h.dayNamesShort:null)||this._defaults.dayNamesShort,n=(h?h.dayNames:null)||this._defaults.dayNames,p=(h?h.monthNamesShort:null)||this._defaults.monthNamesShort,l=(h?
h.monthNames:null)||this._defaults.monthNames,k=h=-1,m=-1,o=-1,q=false,s=function(x){(x=y+1<a.length&&a.charAt(y+1)==x)&&y++;return x},r=function(x){var C=s(x);x=new RegExp("^\\d{1,"+(x=="@"?14:x=="!"?20:x=="y"&&C?4:x=="o"?3:2)+"}");x=c.substring(w).match(x);if(!x)throw"Missing number at position "+w;w+=x[0].length;return parseInt(x[0],10)},u=function(x,C,J){x=s(x)?J:C;for(C=0;C<x.length;C++)if(c.substr(w,x[C].length).toLowerCase()==x[C].toLowerCase()){w+=x[C].length;return C+1}throw"Unknown name at position "+
w;},v=function(){if(c.charAt(w)!=a.charAt(y))throw"Unexpected literal at position "+w;w++},w=0,y=0;y<a.length;y++)if(q)if(a.charAt(y)=="'"&&!s("'"))q=false;else v();else switch(a.charAt(y)){case "d":m=r("d");break;case "D":u("D",j,n);break;case "o":o=r("o");break;case "m":k=r("m");break;case "M":k=u("M",p,l);break;case "y":h=r("y");break;case "@":var B=new Date(r("@"));h=B.getFullYear();k=B.getMonth()+1;m=B.getDate();break;case "!":B=new Date((r("!")-this._ticksTo1970)/1E4);h=B.getFullYear();k=B.getMonth()+
1;m=B.getDate();break;case "'":if(s("'"))v();else q=true;break;default:v()}if(h==-1)h=(new Date).getFullYear();else if(h<100)h+=(new Date).getFullYear()-(new Date).getFullYear()%100+(h<=i?0:-100);if(o>-1){k=1;m=o;do{i=this._getDaysInMonth(h,k-1);if(m<=i)break;k++;m-=i}while(1)}B=this._daylightSavingAdjust(new Date(h,k-1,m));if(B.getFullYear()!=h||B.getMonth()+1!=k||B.getDate()!=m)throw"Invalid date";return B},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",
RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*1E7,formatDate:function(a,c,h){if(!c)return"";var i=(h?h.dayNamesShort:null)||this._defaults.dayNamesShort,j=(h?h.dayNames:null)||this._defaults.dayNames,n=(h?h.monthNamesShort:null)||this._defaults.monthNamesShort;h=(h?h.monthNames:null)||this._defaults.monthNames;var p=function(s){(s=q+1<a.length&&
a.charAt(q+1)==s)&&q++;return s},l=function(s,r,u){r=""+r;if(p(s))for(;r.length<u;)r="0"+r;return r},k=function(s,r,u,v){return p(s)?v[r]:u[r]},m="",o=false;if(c)for(var q=0;q<a.length;q++)if(o)if(a.charAt(q)=="'"&&!p("'"))o=false;else m+=a.charAt(q);else switch(a.charAt(q)){case "d":m+=l("d",c.getDate(),2);break;case "D":m+=k("D",c.getDay(),i,j);break;case "o":m+=l("o",(c.getTime()-(new Date(c.getFullYear(),0,0)).getTime())/864E5,3);break;case "m":m+=l("m",c.getMonth()+1,2);break;case "M":m+=k("M",
c.getMonth(),n,h);break;case "y":m+=p("y")?c.getFullYear():(c.getYear()%100<10?"0":"")+c.getYear()%100;break;case "@":m+=c.getTime();break;case "!":m+=c.getTime()*1E4+this._ticksTo1970;break;case "'":if(p("'"))m+="'";else o=true;break;default:m+=a.charAt(q)}return m},_possibleChars:function(a){for(var c="",h=false,i=function(n){(n=j+1<a.length&&a.charAt(j+1)==n)&&j++;return n},j=0;j<a.length;j++)if(h)if(a.charAt(j)=="'"&&!i("'"))h=false;else c+=a.charAt(j);else switch(a.charAt(j)){case "d":case "m":case "y":case "@":c+=
"0123456789";break;case "D":case "M":return null;case "'":if(i("'"))c+="'";else h=true;break;default:c+=a.charAt(j)}return c},_get:function(a,c){return a.settings[c]!==d?a.settings[c]:this._defaults[c]},_setDateFromField:function(a,c){if(a.input.val()!=a.lastVal){var h=this._get(a,"dateFormat"),i=a.lastVal=a.input?a.input.val():null,j,n;j=n=this._getDefaultDate(a);var p=this._getFormatConfig(a);try{j=this.parseDate(h,i,p)||n}catch(l){this.log(l);i=c?"":i}a.selectedDay=j.getDate();a.drawMonth=a.selectedMonth=
j.getMonth();a.drawYear=a.selectedYear=j.getFullYear();a.currentDay=i?j.getDate():0;a.currentMonth=i?j.getMonth():0;a.currentYear=i?j.getFullYear():0;this._adjustInstDate(a)}},_getDefaultDate:function(a){return this._restrictMinMax(a,this._determineDate(a,this._get(a,"defaultDate"),new Date))},_determineDate:function(a,c,h){var i=function(n){var p=new Date;p.setDate(p.getDate()+n);return p},j=function(n){try{return b.datepicker.parseDate(b.datepicker._get(a,"dateFormat"),n,b.datepicker._getFormatConfig(a))}catch(p){}var l=
(n.toLowerCase().match(/^c/)?b.datepicker._getDate(a):null)||new Date,k=l.getFullYear(),m=l.getMonth();l=l.getDate();for(var o=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,q=o.exec(n);q;){switch(q[2]||"d"){case "d":case "D":l+=parseInt(q[1],10);break;case "w":case "W":l+=parseInt(q[1],10)*7;break;case "m":case "M":m+=parseInt(q[1],10);l=Math.min(l,b.datepicker._getDaysInMonth(k,m));break;case "y":case "Y":k+=parseInt(q[1],10);l=Math.min(l,b.datepicker._getDaysInMonth(k,m));break}q=o.exec(n)}return new Date(k,
m,l)};if(c=(c=c==null||c===""?h:typeof c=="string"?j(c):typeof c=="number"?isNaN(c)?h:i(c):new Date(c.getTime()))&&c.toString()=="Invalid Date"?h:c){c.setHours(0);c.setMinutes(0);c.setSeconds(0);c.setMilliseconds(0)}return this._daylightSavingAdjust(c)},_daylightSavingAdjust:function(a){if(!a)return null;a.setHours(a.getHours()>12?a.getHours()+2:0);return a},_setDate:function(a,c,h){var i=!c,j=a.selectedMonth,n=a.selectedYear;c=this._restrictMinMax(a,this._determineDate(a,c,new Date));a.selectedDay=
a.currentDay=c.getDate();a.drawMonth=a.selectedMonth=a.currentMonth=c.getMonth();a.drawYear=a.selectedYear=a.currentYear=c.getFullYear();if((j!=a.selectedMonth||n!=a.selectedYear)&&!h)this._notifyChange(a);this._adjustInstDate(a);if(a.input)a.input.val(i?"":this._formatDate(a))},_getDate:function(a){return!a.currentYear||a.input&&a.input.val()==""?null:this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay))},_generateHTML:function(a){var c=new Date;c=this._daylightSavingAdjust(new Date(c.getFullYear(),
c.getMonth(),c.getDate()));var h=this._get(a,"isRTL"),i=this._get(a,"showButtonPanel"),j=this._get(a,"hideIfNoPrevNext"),n=this._get(a,"navigationAsDateFormat"),p=this._getNumberOfMonths(a),l=this._get(a,"showCurrentAtPos"),k=this._get(a,"stepMonths"),m=p[0]!=1||p[1]!=1,o=this._daylightSavingAdjust(!a.currentDay?new Date(9999,9,9):new Date(a.currentYear,a.currentMonth,a.currentDay)),q=this._getMinMaxDate(a,"min"),s=this._getMinMaxDate(a,"max");l=a.drawMonth-l;var r=a.drawYear;if(l<0){l+=12;r--}if(s){var u=
this._daylightSavingAdjust(new Date(s.getFullYear(),s.getMonth()-p[0]*p[1]+1,s.getDate()));for(u=q&&u<q?q:u;this._daylightSavingAdjust(new Date(r,l,1))>u;){l--;if(l<0){l=11;r--}}}a.drawMonth=l;a.drawYear=r;u=this._get(a,"prevText");u=!n?u:this.formatDate(u,this._daylightSavingAdjust(new Date(r,l-k,1)),this._getFormatConfig(a));u=this._canAdjustMonth(a,-1,r,l)?'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_'+f+".datepicker._adjustDate('#"+a.id+"', -"+k+", 'M');\" title=\""+u+'"><span class="ui-icon ui-icon-circle-triangle-'+
(h?"e":"w")+'">'+u+"</span></a>":j?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+u+'"><span class="ui-icon ui-icon-circle-triangle-'+(h?"e":"w")+'">'+u+"</span></a>";var v=this._get(a,"nextText");v=!n?v:this.formatDate(v,this._daylightSavingAdjust(new Date(r,l+k,1)),this._getFormatConfig(a));j=this._canAdjustMonth(a,+1,r,l)?'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_'+f+".datepicker._adjustDate('#"+a.id+"', +"+k+", 'M');\" title=\""+v+'"><span class="ui-icon ui-icon-circle-triangle-'+
(h?"w":"e")+'">'+v+"</span></a>":j?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+v+'"><span class="ui-icon ui-icon-circle-triangle-'+(h?"w":"e")+'">'+v+"</span></a>";k=this._get(a,"currentText");v=this._get(a,"gotoCurrent")&&a.currentDay?o:c;k=!n?k:this.formatDate(k,v,this._getFormatConfig(a));n=!a.inline?'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_'+f+'.datepicker._hideDatepicker();">'+this._get(a,
"closeText")+"</button>":"";i=i?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(h?n:"")+(this._isInRange(a,v)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_'+f+".datepicker._gotoToday('#"+a.id+"');\">"+k+"</button>":"")+(h?"":n)+"</div>":"";n=parseInt(this._get(a,"firstDay"),10);n=isNaN(n)?0:n;k=this._get(a,"showWeek");v=this._get(a,"dayNames");this._get(a,"dayNamesShort");var w=this._get(a,"dayNamesMin"),y=
this._get(a,"monthNames"),B=this._get(a,"monthNamesShort"),x=this._get(a,"beforeShowDay"),C=this._get(a,"showOtherMonths"),J=this._get(a,"selectOtherMonths");this._get(a,"calculateWeek");for(var M=this._getDefaultDate(a),K="",G=0;G<p[0];G++){for(var N="",H=0;H<p[1];H++){var O=this._daylightSavingAdjust(new Date(r,l,a.selectedDay)),A=" ui-corner-all",D="";if(m){D+='<div class="ui-datepicker-group';if(p[1]>1)switch(H){case 0:D+=" ui-datepicker-group-first";A=" ui-corner-"+(h?"right":"left");break;case p[1]-
1:D+=" ui-datepicker-group-last";A=" ui-corner-"+(h?"left":"right");break;default:D+=" ui-datepicker-group-middle";A="";break}D+='">'}D+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+A+'">'+(/all|left/.test(A)&&G==0?h?j:u:"")+(/all|right/.test(A)&&G==0?h?u:j:"")+this._generateMonthYearHeader(a,l,r,q,s,G>0||H>0,y,B)+'</div><table class="ui-datepicker-calendar"><thead><tr>';var E=k?'<th class="ui-datepicker-week-col">'+this._get(a,"weekHeader")+"</th>":"";for(A=0;A<7;A++){var z=
(A+n)%7;E+="<th"+((A+n+6)%7>=5?' class="ui-datepicker-week-end"':"")+'><span title="'+v[z]+'">'+w[z]+"</span></th>"}D+=E+"</tr></thead><tbody>";E=this._getDaysInMonth(r,l);if(r==a.selectedYear&&l==a.selectedMonth)a.selectedDay=Math.min(a.selectedDay,E);A=(this._getFirstDayOfMonth(r,l)-n+7)%7;E=m?6:Math.ceil((A+E)/7);z=this._daylightSavingAdjust(new Date(r,l,1-A));for(var P=0;P<E;P++){D+="<tr>";var Q=!k?"":'<td class="ui-datepicker-week-col">'+this._get(a,"calculateWeek")(z)+"</td>";for(A=0;A<7;A++){var I=
x?x.apply(a.input?a.input[0]:null,[z]):[true,""],F=z.getMonth()!=l,L=F&&!J||!I[0]||q&&z<q||s&&z>s;Q+='<td class="'+((A+n+6)%7>=5?" ui-datepicker-week-end":"")+(F?" ui-datepicker-other-month":"")+(z.getTime()==O.getTime()&&l==a.selectedMonth&&a._keyEvent||M.getTime()==z.getTime()&&M.getTime()==O.getTime()?" "+this._dayOverClass:"")+(L?" "+this._unselectableClass+" ui-state-disabled":"")+(F&&!C?"":" "+I[1]+(z.getTime()==o.getTime()?" "+this._currentClass:"")+(z.getTime()==c.getTime()?" ui-datepicker-today":
""))+'"'+((!F||C)&&I[2]?' title="'+I[2]+'"':"")+(L?"":' onclick="DP_jQuery_'+f+".datepicker._selectDay('#"+a.id+"',"+z.getMonth()+","+z.getFullYear()+', this);return false;"')+">"+(F&&!C?"&#xa0;":L?'<span class="ui-state-default">'+z.getDate()+"</span>":'<a class="ui-state-default'+(z.getTime()==c.getTime()?" ui-state-highlight":"")+(z.getTime()==o.getTime()?" ui-state-active":"")+(F?" ui-priority-secondary":"")+'" href="#">'+z.getDate()+"</a>")+"</td>";z.setDate(z.getDate()+1);z=this._daylightSavingAdjust(z)}D+=
Q+"</tr>"}l++;if(l>11){l=0;r++}D+="</tbody></table>"+(m?"</div>"+(p[0]>0&&H==p[1]-1?'<div class="ui-datepicker-row-break"></div>':""):"");N+=D}K+=N}K+=i+(b.browser.msie&&parseInt(b.browser.version,10)<7&&!a.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':"");a._keyEvent=false;return K},_generateMonthYearHeader:function(a,c,h,i,j,n,p,l){var k=this._get(a,"changeMonth"),m=this._get(a,"changeYear"),o=this._get(a,"showMonthAfterYear"),q='<div class="ui-datepicker-title">',
s="";if(n||!k)s+='<span class="ui-datepicker-month">'+p[c]+"</span>";else{p=i&&i.getFullYear()==h;var r=j&&j.getFullYear()==h;s+='<select class="ui-datepicker-month" onchange="DP_jQuery_'+f+".datepicker._selectMonthYear('#"+a.id+"', this, 'M');\" onclick=\"DP_jQuery_"+f+".datepicker._clickMonthYear('#"+a.id+"');\">";for(var u=0;u<12;u++)if((!p||u>=i.getMonth())&&(!r||u<=j.getMonth()))s+='<option value="'+u+'"'+(u==c?' selected="selected"':"")+">"+l[u]+"</option>";s+="</select>"}o||(q+=s+(n||!(k&&
m)?"&#xa0;":""));a.yearshtml="";if(n||!m)q+='<span class="ui-datepicker-year">'+h+"</span>";else{l=this._get(a,"yearRange").split(":");var v=(new Date).getFullYear();p=function(w){w=w.match(/c[+-].*/)?h+parseInt(w.substring(1),10):w.match(/[+-].*/)?v+parseInt(w,10):parseInt(w,10);return isNaN(w)?v:w};c=p(l[0]);l=Math.max(c,p(l[1]||""));c=i?Math.max(c,i.getFullYear()):c;l=j?Math.min(l,j.getFullYear()):l;for(a.yearshtml+='<select class="ui-datepicker-year" onchange="DP_jQuery_'+f+".datepicker._selectMonthYear('#"+
a.id+"', this, 'Y');\" onclick=\"DP_jQuery_"+f+".datepicker._clickMonthYear('#"+a.id+"');\">";c<=l;c++)a.yearshtml+='<option value="'+c+'"'+(c==h?' selected="selected"':"")+">"+c+"</option>";a.yearshtml+="</select>";if(b.browser.mozilla)q+='<select class="ui-datepicker-year"><option value="'+h+'" selected="selected">'+h+"</option></select>";else{q+=a.yearshtml;a.yearshtml=null}}q+=this._get(a,"yearSuffix");if(o)q+=(n||!(k&&m)?"&#xa0;":"")+s;q+="</div>";return q},_adjustInstDate:function(a,c,h){var i=
a.drawYear+(h=="Y"?c:0),j=a.drawMonth+(h=="M"?c:0);c=Math.min(a.selectedDay,this._getDaysInMonth(i,j))+(h=="D"?c:0);i=this._restrictMinMax(a,this._daylightSavingAdjust(new Date(i,j,c)));a.selectedDay=i.getDate();a.drawMonth=a.selectedMonth=i.getMonth();a.drawYear=a.selectedYear=i.getFullYear();if(h=="M"||h=="Y")this._notifyChange(a)},_restrictMinMax:function(a,c){var h=this._getMinMaxDate(a,"min");a=this._getMinMaxDate(a,"max");c=h&&c<h?h:c;return c=a&&c>a?a:c},_notifyChange:function(a){var c=this._get(a,
"onChangeMonthYear");if(c)c.apply(a.input?a.input[0]:null,[a.selectedYear,a.selectedMonth+1,a])},_getNumberOfMonths:function(a){a=this._get(a,"numberOfMonths");return a==null?[1,1]:typeof a=="number"?[1,a]:a},_getMinMaxDate:function(a,c){return this._determineDate(a,this._get(a,c+"Date"),null)},_getDaysInMonth:function(a,c){return 32-this._daylightSavingAdjust(new Date(a,c,32)).getDate()},_getFirstDayOfMonth:function(a,c){return(new Date(a,c,1)).getDay()},_canAdjustMonth:function(a,c,h,i){var j=this._getNumberOfMonths(a);
h=this._daylightSavingAdjust(new Date(h,i+(c<0?c:j[0]*j[1]),1));c<0&&h.setDate(this._getDaysInMonth(h.getFullYear(),h.getMonth()));return this._isInRange(a,h)},_isInRange:function(a,c){var h=this._getMinMaxDate(a,"min");a=this._getMinMaxDate(a,"max");return(!h||c.getTime()>=h.getTime())&&(!a||c.getTime()<=a.getTime())},_getFormatConfig:function(a){var c=this._get(a,"shortYearCutoff");c=typeof c!="string"?c:(new Date).getFullYear()%100+parseInt(c,10);return{shortYearCutoff:c,dayNamesShort:this._get(a,
"dayNamesShort"),dayNames:this._get(a,"dayNames"),monthNamesShort:this._get(a,"monthNamesShort"),monthNames:this._get(a,"monthNames")}},_formatDate:function(a,c,h,i){if(!c){a.currentDay=a.selectedDay;a.currentMonth=a.selectedMonth;a.currentYear=a.selectedYear}c=c?typeof c=="object"?c:this._daylightSavingAdjust(new Date(i,h,c)):this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return this.formatDate(this._get(a,"dateFormat"),c,this._getFormatConfig(a))}});b.fn.datepicker=
function(a){if(!this.length)return this;if(!b.datepicker.initialized){b(document).mousedown(b.datepicker._checkExternalClick).find("body").append(b.datepicker.dpDiv);b.datepicker.initialized=true}var c=Array.prototype.slice.call(arguments,1);if(typeof a=="string"&&(a=="isDisabled"||a=="getDate"||a=="widget"))return b.datepicker["_"+a+"Datepicker"].apply(b.datepicker,[this[0]].concat(c));if(a=="option"&&arguments.length==2&&typeof arguments[1]=="string")return b.datepicker["_"+a+"Datepicker"].apply(b.datepicker,
[this[0]].concat(c));return this.each(function(){typeof a=="string"?b.datepicker["_"+a+"Datepicker"].apply(b.datepicker,[this].concat(c)):b.datepicker._attachDatepicker(this,a)})};b.datepicker=new e;b.datepicker.initialized=false;b.datepicker.uuid=(new Date).getTime();b.datepicker.version="1.8.11";window["DP_jQuery_"+f]=b})(jQuery);
(function(b,d){var e={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},g={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true};b.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,position:{my:"center",at:"center",collision:"fit",using:function(f){var a=b(this).css(f).offset().top;a<0&&
b(this).css("top",f.top-a)}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1E3},_create:function(){this.originalTitle=this.element.attr("title");if(typeof this.originalTitle!=="string")this.originalTitle="";this.options.title=this.options.title||this.originalTitle;var f=this,a=f.options,c=a.title||"&#160;",h=b.ui.dialog.getTitleId(f.element),i=(f.uiDialog=b("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+a.dialogClass).css({zIndex:a.zIndex}).attr("tabIndex",
-1).css("outline",0).keydown(function(p){if(a.closeOnEscape&&p.keyCode&&p.keyCode===b.ui.keyCode.ESCAPE){f.close(p);p.preventDefault()}}).attr({role:"dialog","aria-labelledby":h}).mousedown(function(p){f.moveToTop(false,p)});f.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(i);var j=(f.uiDialogTitlebar=b("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(i),n=b('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role",
"button").hover(function(){n.addClass("ui-state-hover")},function(){n.removeClass("ui-state-hover")}).focus(function(){n.addClass("ui-state-focus")}).blur(function(){n.removeClass("ui-state-focus")}).click(function(p){f.close(p);return false}).appendTo(j);(f.uiDialogTitlebarCloseText=b("<span></span>")).addClass("ui-icon ui-icon-closethick").text(a.closeText).appendTo(n);b("<span></span>").addClass("ui-dialog-title").attr("id",h).html(c).prependTo(j);if(b.isFunction(a.beforeclose)&&!b.isFunction(a.beforeClose))a.beforeClose=
a.beforeclose;j.find("*").add(j).disableSelection();a.draggable&&b.fn.draggable&&f._makeDraggable();a.resizable&&b.fn.resizable&&f._makeResizable();f._createButtons(a.buttons);f._isOpen=false;b.fn.bgiframe&&i.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var f=this;f.overlay&&f.overlay.destroy();f.uiDialog.hide();f.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");f.uiDialog.remove();f.originalTitle&&
f.element.attr("title",f.originalTitle);return f},widget:function(){return this.uiDialog},close:function(f){var a=this,c,h;if(false!==a._trigger("beforeClose",f)){a.overlay&&a.overlay.destroy();a.uiDialog.unbind("keypress.ui-dialog");a._isOpen=false;if(a.options.hide)a.uiDialog.hide(a.options.hide,function(){a._trigger("close",f)});else{a.uiDialog.hide();a._trigger("close",f)}b.ui.dialog.overlay.resize();if(a.options.modal){c=0;b(".ui-dialog").each(function(){if(this!==a.uiDialog[0]){h=b(this).css("z-index");
isNaN(h)||(c=Math.max(c,h))}});b.ui.dialog.maxZ=c}return a}},isOpen:function(){return this._isOpen},moveToTop:function(f,a){var c=this,h=c.options;if(h.modal&&!f||!h.stack&&!h.modal)return c._trigger("focus",a);if(h.zIndex>b.ui.dialog.maxZ)b.ui.dialog.maxZ=h.zIndex;if(c.overlay){b.ui.dialog.maxZ+=1;c.overlay.$el.css("z-index",b.ui.dialog.overlay.maxZ=b.ui.dialog.maxZ)}f={scrollTop:c.element.attr("scrollTop"),scrollLeft:c.element.attr("scrollLeft")};b.ui.dialog.maxZ+=1;c.uiDialog.css("z-index",b.ui.dialog.maxZ);
c.element.attr(f);c._trigger("focus",a);return c},open:function(){if(!this._isOpen){var f=this,a=f.options,c=f.uiDialog;f.overlay=a.modal?new b.ui.dialog.overlay(f):null;f._size();f._position(a.position);c.show(a.show);f.moveToTop(true);a.modal&&c.bind("keypress.ui-dialog",function(h){if(h.keyCode===b.ui.keyCode.TAB){var i=b(":tabbable",this),j=i.filter(":first");i=i.filter(":last");if(h.target===i[0]&&!h.shiftKey){j.focus(1);return false}else if(h.target===j[0]&&h.shiftKey){i.focus(1);return false}}});
b(f.element.find(":tabbable").get().concat(c.find(".ui-dialog-buttonpane :tabbable").get().concat(c.get()))).eq(0).focus();f._isOpen=true;f._trigger("open");return f}},_createButtons:function(f){var a=this,c=false,h=b("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),i=b("<div></div>").addClass("ui-dialog-buttonset").appendTo(h);a.uiDialog.find(".ui-dialog-buttonpane").remove();typeof f==="object"&&f!==null&&b.each(f,function(){return!(c=true)});if(c){b.each(f,function(j,
n){n=b.isFunction(n)?{click:n,text:j}:n;j=b('<button type="button"></button>').attr(n,true).unbind("click").click(function(){n.click.apply(a.element[0],arguments)}).appendTo(i);b.fn.button&&j.button()});h.appendTo(a.uiDialog)}},_makeDraggable:function(){function f(j){return{position:j.position,offset:j.offset}}var a=this,c=a.options,h=b(document),i;a.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(j,n){i=
c.height==="auto"?"auto":b(this).height();b(this).height(b(this).height()).addClass("ui-dialog-dragging");a._trigger("dragStart",j,f(n))},drag:function(j,n){a._trigger("drag",j,f(n))},stop:function(j,n){c.position=[n.position.left-h.scrollLeft(),n.position.top-h.scrollTop()];b(this).removeClass("ui-dialog-dragging").height(i);a._trigger("dragStop",j,f(n));b.ui.dialog.overlay.resize()}})},_makeResizable:function(f){function a(j){return{originalPosition:j.originalPosition,originalSize:j.originalSize,
position:j.position,size:j.size}}f=f===d?this.options.resizable:f;var c=this,h=c.options,i=c.uiDialog.css("position");f=typeof f==="string"?f:"n,e,s,w,se,sw,ne,nw";c.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:c.element,maxWidth:h.maxWidth,maxHeight:h.maxHeight,minWidth:h.minWidth,minHeight:c._minHeight(),handles:f,start:function(j,n){b(this).addClass("ui-dialog-resizing");c._trigger("resizeStart",j,a(n))},resize:function(j,n){c._trigger("resize",j,a(n))},stop:function(j,
n){b(this).removeClass("ui-dialog-resizing");h.height=b(this).height();h.width=b(this).width();c._trigger("resizeStop",j,a(n));b.ui.dialog.overlay.resize()}}).css("position",i).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var f=this.options;return f.height==="auto"?f.minHeight:Math.min(f.minHeight,f.height)},_position:function(f){var a=[],c=[0,0],h;if(f){if(typeof f==="string"||typeof f==="object"&&"0"in f){a=f.split?f.split(" "):[f[0],f[1]];if(a.length===
1)a[1]=a[0];b.each(["left","top"],function(i,j){if(+a[i]===a[i]){c[i]=a[i];a[i]=j}});f={my:a.join(" "),at:a.join(" "),offset:c.join(" ")}}f=b.extend({},b.ui.dialog.prototype.options.position,f)}else f=b.ui.dialog.prototype.options.position;(h=this.uiDialog.is(":visible"))||this.uiDialog.show();this.uiDialog.css({top:0,left:0}).position(b.extend({of:window},f));h||this.uiDialog.hide()},_setOptions:function(f){var a=this,c={},h=false;b.each(f,function(i,j){a._setOption(i,j);if(i in e)h=true;if(i in
g)c[i]=j});h&&this._size();this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",c)},_setOption:function(f,a){var c=this,h=c.uiDialog;switch(f){case "beforeclose":f="beforeClose";break;case "buttons":c._createButtons(a);break;case "closeText":c.uiDialogTitlebarCloseText.text(""+a);break;case "dialogClass":h.removeClass(c.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+a);break;case "disabled":a?h.addClass("ui-dialog-disabled"):h.removeClass("ui-dialog-disabled");
break;case "draggable":var i=h.is(":data(draggable)");i&&!a&&h.draggable("destroy");!i&&a&&c._makeDraggable();break;case "position":c._position(a);break;case "resizable":(i=h.is(":data(resizable)"))&&!a&&h.resizable("destroy");i&&typeof a==="string"&&h.resizable("option","handles",a);!i&&a!==false&&c._makeResizable(a);break;case "title":b(".ui-dialog-title",c.uiDialogTitlebar).html(""+(a||"&#160;"));break}b.Widget.prototype._setOption.apply(c,arguments)},_size:function(){var f=this.options,a,c,h=
this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0});if(f.minWidth>f.width)f.width=f.minWidth;a=this.uiDialog.css({height:"auto",width:f.width}).height();c=Math.max(0,f.minHeight-a);if(f.height==="auto")if(b.support.minHeight)this.element.css({minHeight:c,height:"auto"});else{this.uiDialog.show();f=this.element.css("height","auto").height();h||this.uiDialog.hide();this.element.height(Math.max(f,c))}else this.element.height(Math.max(f.height-a,0));this.uiDialog.is(":data(resizable)")&&
this.uiDialog.resizable("option","minHeight",this._minHeight())}});b.extend(b.ui.dialog,{version:"1.8.11",uuid:0,maxZ:0,getTitleId:function(f){f=f.attr("id");if(!f){this.uuid+=1;f=this.uuid}return"ui-dialog-title-"+f},overlay:function(f){this.$el=b.ui.dialog.overlay.create(f)}});b.extend(b.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:b.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(f){return f+".dialog-overlay"}).join(" "),create:function(f){if(this.instances.length===
0){setTimeout(function(){b.ui.dialog.overlay.instances.length&&b(document).bind(b.ui.dialog.overlay.events,function(c){if(b(c.target).zIndex()<b.ui.dialog.overlay.maxZ)return false})},1);b(document).bind("keydown.dialog-overlay",function(c){if(f.options.closeOnEscape&&c.keyCode&&c.keyCode===b.ui.keyCode.ESCAPE){f.close(c);c.preventDefault()}});b(window).bind("resize.dialog-overlay",b.ui.dialog.overlay.resize)}var a=(this.oldInstances.pop()||b("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),
height:this.height()});b.fn.bgiframe&&a.bgiframe();this.instances.push(a);return a},destroy:function(f){var a=b.inArray(f,this.instances);a!=-1&&this.oldInstances.push(this.instances.splice(a,1)[0]);this.instances.length===0&&b([document,window]).unbind(".dialog-overlay");f.remove();var c=0;b.each(this.instances,function(){c=Math.max(c,this.css("z-index"))});this.maxZ=c},height:function(){var f,a;if(b.browser.msie&&b.browser.version<7){f=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
a=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);return f<a?b(window).height()+"px":f+"px"}else return b(document).height()+"px"},width:function(){var f,a;if(b.browser.msie&&b.browser.version<7){f=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);a=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);return f<a?b(window).width()+"px":f+"px"}else return b(document).width()+"px"},resize:function(){var f=b([]);b.each(b.ui.dialog.overlay.instances,
function(){f=f.add(this)});f.css({width:0,height:0}).css({width:b.ui.dialog.overlay.width(),height:b.ui.dialog.overlay.height()})}});b.extend(b.ui.dialog.overlay.prototype,{destroy:function(){b.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);
(function(b){b.ui=b.ui||{};var d=/left|center|right/,e=/top|center|bottom/,g=b.fn.position,f=b.fn.offset;b.fn.position=function(a){if(!a||!a.of)return g.apply(this,arguments);a=b.extend({},a);var c=b(a.of),h=c[0],i=(a.collision||"flip").split(" "),j=a.offset?a.offset.split(" "):[0,0],n,p,l;if(h.nodeType===9){n=c.width();p=c.height();l={top:0,left:0}}else if(h.setTimeout){n=c.width();p=c.height();l={top:c.scrollTop(),left:c.scrollLeft()}}else if(h.preventDefault){a.at="left top";n=p=0;l={top:a.of.pageY,
left:a.of.pageX}}else{n=c.outerWidth();p=c.outerHeight();l=c.offset()}b.each(["my","at"],function(){var k=(a[this]||"").split(" ");if(k.length===1)k=d.test(k[0])?k.concat(["center"]):e.test(k[0])?["center"].concat(k):["center","center"];k[0]=d.test(k[0])?k[0]:"center";k[1]=e.test(k[1])?k[1]:"center";a[this]=k});if(i.length===1)i[1]=i[0];j[0]=parseInt(j[0],10)||0;if(j.length===1)j[1]=j[0];j[1]=parseInt(j[1],10)||0;if(a.at[0]==="right")l.left+=n;else if(a.at[0]==="center")l.left+=n/2;if(a.at[1]==="bottom")l.top+=
p;else if(a.at[1]==="center")l.top+=p/2;l.left+=j[0];l.top+=j[1];return this.each(function(){var k=b(this),m=k.outerWidth(),o=k.outerHeight(),q=parseInt(b.curCSS(this,"marginLeft",true))||0,s=parseInt(b.curCSS(this,"marginTop",true))||0,r=m+q+(parseInt(b.curCSS(this,"marginRight",true))||0),u=o+s+(parseInt(b.curCSS(this,"marginBottom",true))||0),v=b.extend({},l),w;if(a.my[0]==="right")v.left-=m;else if(a.my[0]==="center")v.left-=m/2;if(a.my[1]==="bottom")v.top-=o;else if(a.my[1]==="center")v.top-=
o/2;v.left=Math.round(v.left);v.top=Math.round(v.top);w={left:v.left-q,top:v.top-s};b.each(["left","top"],function(y,B){b.ui.position[i[y]]&&b.ui.position[i[y]][B](v,{targetWidth:n,targetHeight:p,elemWidth:m,elemHeight:o,collisionPosition:w,collisionWidth:r,collisionHeight:u,offset:j,my:a.my,at:a.at})});b.fn.bgiframe&&k.bgiframe();k.offset(b.extend(v,{using:a.using}))})};b.ui.position={fit:{left:function(a,c){var h=b(window);h=c.collisionPosition.left+c.collisionWidth-h.width()-h.scrollLeft();a.left=
h>0?a.left-h:Math.max(a.left-c.collisionPosition.left,a.left)},top:function(a,c){var h=b(window);h=c.collisionPosition.top+c.collisionHeight-h.height()-h.scrollTop();a.top=h>0?a.top-h:Math.max(a.top-c.collisionPosition.top,a.top)}},flip:{left:function(a,c){if(c.at[0]!=="center"){var h=b(window);h=c.collisionPosition.left+c.collisionWidth-h.width()-h.scrollLeft();var i=c.my[0]==="left"?-c.elemWidth:c.my[0]==="right"?c.elemWidth:0,j=c.at[0]==="left"?c.targetWidth:-c.targetWidth,n=-2*c.offset[0];a.left+=
c.collisionPosition.left<0?i+j+n:h>0?i+j+n:0}},top:function(a,c){if(c.at[1]!=="center"){var h=b(window);h=c.collisionPosition.top+c.collisionHeight-h.height()-h.scrollTop();var i=c.my[1]==="top"?-c.elemHeight:c.my[1]==="bottom"?c.elemHeight:0,j=c.at[1]==="top"?c.targetHeight:-c.targetHeight,n=-2*c.offset[1];a.top+=c.collisionPosition.top<0?i+j+n:h>0?i+j+n:0}}}};if(!b.offset.setOffset){b.offset.setOffset=function(a,c){if(/static/.test(b.curCSS(a,"position")))a.style.position="relative";var h=b(a),
i=h.offset(),j=parseInt(b.curCSS(a,"top",true),10)||0,n=parseInt(b.curCSS(a,"left",true),10)||0;i={top:c.top-i.top+j,left:c.left-i.left+n};"using"in c?c.using.call(a,i):h.css(i)};b.fn.offset=function(a){var c=this[0];if(!c||!c.ownerDocument)return null;if(a)return this.each(function(){b.offset.setOffset(this,a)});return f.call(this)}}})(jQuery);
(function(b,d){b.widget("ui.progressbar",{options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()});this.valueDiv=b("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);this.oldValue=this._value();this._refreshValue()},destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
this.valueDiv.remove();b.Widget.prototype.destroy.apply(this,arguments)},value:function(e){if(e===d)return this._value();this._setOption("value",e);return this},_setOption:function(e,g){if(e==="value"){this.options.value=g;this._refreshValue();this._value()===this.options.max&&this._trigger("complete")}b.Widget.prototype._setOption.apply(this,arguments)},_value:function(){var e=this.options.value;if(typeof e!=="number")e=0;return Math.min(this.options.max,Math.max(this.min,e))},_percentage:function(){return 100*
this._value()/this.options.max},_refreshValue:function(){var e=this.value(),g=this._percentage();if(this.oldValue!==e){this.oldValue=e;this._trigger("change")}this.valueDiv.toggleClass("ui-corner-right",e===this.options.max).width(g.toFixed(0)+"%");this.element.attr("aria-valuenow",e)}});b.extend(b.ui.progressbar,{version:"1.8.11"})})(jQuery);
(function(b){b.widget("ui.slider",b.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var d=this,e=this.options;this._mouseSliding=this._keySliding=false;this._animateOff=true;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all");e.disabled&&this.element.addClass("ui-slider-disabled ui-disabled");
this.range=b([]);if(e.range){if(e.range===true){this.range=b("<div></div>");if(!e.values)e.values=[this._valueMin(),this._valueMin()];if(e.values.length&&e.values.length!==2)e.values=[e.values[0],e.values[0]]}else this.range=b("<div></div>");this.range.appendTo(this.element).addClass("ui-slider-range");if(e.range==="min"||e.range==="max")this.range.addClass("ui-slider-range-"+e.range);this.range.addClass("ui-widget-header")}b(".ui-slider-handle",this.element).length===0&&b("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
if(e.values&&e.values.length)for(;b(".ui-slider-handle",this.element).length<e.values.length;)b("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");this.handles=b(".ui-slider-handle",this.element).addClass("ui-state-default ui-corner-all");this.handle=this.handles.eq(0);this.handles.add(this.range).filter("a").click(function(g){g.preventDefault()}).hover(function(){e.disabled||b(this).addClass("ui-state-hover")},function(){b(this).removeClass("ui-state-hover")}).focus(function(){if(e.disabled)b(this).blur();
else{b(".ui-slider .ui-state-focus").removeClass("ui-state-focus");b(this).addClass("ui-state-focus")}}).blur(function(){b(this).removeClass("ui-state-focus")});this.handles.each(function(g){b(this).data("index.ui-slider-handle",g)});this.handles.keydown(function(g){var f=true,a=b(this).data("index.ui-slider-handle"),c,h,i;if(!d.options.disabled){switch(g.keyCode){case b.ui.keyCode.HOME:case b.ui.keyCode.END:case b.ui.keyCode.PAGE_UP:case b.ui.keyCode.PAGE_DOWN:case b.ui.keyCode.UP:case b.ui.keyCode.RIGHT:case b.ui.keyCode.DOWN:case b.ui.keyCode.LEFT:f=
false;if(!d._keySliding){d._keySliding=true;b(this).addClass("ui-state-active");c=d._start(g,a);if(c===false)return}break}i=d.options.step;c=d.options.values&&d.options.values.length?(h=d.values(a)):(h=d.value());switch(g.keyCode){case b.ui.keyCode.HOME:h=d._valueMin();break;case b.ui.keyCode.END:h=d._valueMax();break;case b.ui.keyCode.PAGE_UP:h=d._trimAlignValue(c+(d._valueMax()-d._valueMin())/5);break;case b.ui.keyCode.PAGE_DOWN:h=d._trimAlignValue(c-(d._valueMax()-d._valueMin())/5);break;case b.ui.keyCode.UP:case b.ui.keyCode.RIGHT:if(c===
d._valueMax())return;h=d._trimAlignValue(c+i);break;case b.ui.keyCode.DOWN:case b.ui.keyCode.LEFT:if(c===d._valueMin())return;h=d._trimAlignValue(c-i);break}d._slide(g,a,h);return f}}).keyup(function(g){var f=b(this).data("index.ui-slider-handle");if(d._keySliding){d._keySliding=false;d._stop(g,f);d._change(g,f);b(this).removeClass("ui-state-active")}});this._refreshValue();this._animateOff=false},destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
this._mouseDestroy();return this},_mouseCapture:function(d){var e=this.options,g,f,a,c,h;if(e.disabled)return false;this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();g=this._normValueFromMouse({x:d.pageX,y:d.pageY});f=this._valueMax()-this._valueMin()+1;c=this;this.handles.each(function(i){var j=Math.abs(g-c.values(i));if(f>j){f=j;a=b(this);h=i}});if(e.range===true&&this.values(1)===e.min){h+=1;a=b(this.handles[h])}if(this._start(d,
h)===false)return false;this._mouseSliding=true;c._handleIndex=h;a.addClass("ui-state-active").focus();e=a.offset();this._clickOffset=!b(d.target).parents().andSelf().is(".ui-slider-handle")?{left:0,top:0}:{left:d.pageX-e.left-a.width()/2,top:d.pageY-e.top-a.height()/2-(parseInt(a.css("borderTopWidth"),10)||0)-(parseInt(a.css("borderBottomWidth"),10)||0)+(parseInt(a.css("marginTop"),10)||0)};this.handles.hasClass("ui-state-hover")||this._slide(d,h,g);return this._animateOff=true},_mouseStart:function(){return true},
_mouseDrag:function(d){var e=this._normValueFromMouse({x:d.pageX,y:d.pageY});this._slide(d,this._handleIndex,e);return false},_mouseStop:function(d){this.handles.removeClass("ui-state-active");this._mouseSliding=false;this._stop(d,this._handleIndex);this._change(d,this._handleIndex);this._clickOffset=this._handleIndex=null;return this._animateOff=false},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(d){var e;
if(this.orientation==="horizontal"){e=this.elementSize.width;d=d.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)}else{e=this.elementSize.height;d=d.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)}e=d/e;if(e>1)e=1;if(e<0)e=0;if(this.orientation==="vertical")e=1-e;d=this._valueMax()-this._valueMin();return this._trimAlignValue(this._valueMin()+e*d)},_start:function(d,e){var g={handle:this.handles[e],value:this.value()};if(this.options.values&&this.options.values.length){g.value=
this.values(e);g.values=this.values()}return this._trigger("start",d,g)},_slide:function(d,e,g){var f;if(this.options.values&&this.options.values.length){f=this.values(e?0:1);if(this.options.values.length===2&&this.options.range===true&&(e===0&&g>f||e===1&&g<f))g=f;if(g!==this.values(e)){f=this.values();f[e]=g;d=this._trigger("slide",d,{handle:this.handles[e],value:g,values:f});this.values(e?0:1);d!==false&&this.values(e,g,true)}}else if(g!==this.value()){d=this._trigger("slide",d,{handle:this.handles[e],
value:g});d!==false&&this.value(g)}},_stop:function(d,e){var g={handle:this.handles[e],value:this.value()};if(this.options.values&&this.options.values.length){g.value=this.values(e);g.values=this.values()}this._trigger("stop",d,g)},_change:function(d,e){if(!this._keySliding&&!this._mouseSliding){var g={handle:this.handles[e],value:this.value()};if(this.options.values&&this.options.values.length){g.value=this.values(e);g.values=this.values()}this._trigger("change",d,g)}},value:function(d){if(arguments.length){this.options.value=
this._trimAlignValue(d);this._refreshValue();this._change(null,0)}return this._value()},values:function(d,e){var g,f,a;if(arguments.length>1){this.options.values[d]=this._trimAlignValue(e);this._refreshValue();this._change(null,d)}if(arguments.length)if(b.isArray(arguments[0])){g=this.options.values;f=arguments[0];for(a=0;a<g.length;a+=1){g[a]=this._trimAlignValue(f[a]);this._change(null,a)}this._refreshValue()}else return this.options.values&&this.options.values.length?this._values(d):this.value();
else return this._values()},_setOption:function(d,e){var g,f=0;if(b.isArray(this.options.values))f=this.options.values.length;b.Widget.prototype._setOption.apply(this,arguments);switch(d){case "disabled":if(e){this.handles.filter(".ui-state-focus").blur();this.handles.removeClass("ui-state-hover");this.handles.attr("disabled","disabled");this.element.addClass("ui-disabled")}else{this.handles.removeAttr("disabled");this.element.removeClass("ui-disabled")}break;case "orientation":this._detectOrientation();
this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case "value":this._animateOff=true;this._refreshValue();this._change(null,0);this._animateOff=false;break;case "values":this._animateOff=true;this._refreshValue();for(g=0;g<f;g+=1)this._change(null,g);this._animateOff=false;break}},_value:function(){var d=this.options.value;return d=this._trimAlignValue(d)},_values:function(d){var e,g;if(arguments.length){e=this.options.values[d];
return e=this._trimAlignValue(e)}else{e=this.options.values.slice();for(g=0;g<e.length;g+=1)e[g]=this._trimAlignValue(e[g]);return e}},_trimAlignValue:function(d){if(d<=this._valueMin())return this._valueMin();if(d>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,g=(d-this._valueMin())%e;alignValue=d-g;if(Math.abs(g)*2>=e)alignValue+=g>0?e:-e;return parseFloat(alignValue.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},
_refreshValue:function(){var d=this.options.range,e=this.options,g=this,f=!this._animateOff?e.animate:false,a,c={},h,i,j,n;if(this.options.values&&this.options.values.length)this.handles.each(function(p){a=(g.values(p)-g._valueMin())/(g._valueMax()-g._valueMin())*100;c[g.orientation==="horizontal"?"left":"bottom"]=a+"%";b(this).stop(1,1)[f?"animate":"css"](c,e.animate);if(g.options.range===true)if(g.orientation==="horizontal"){if(p===0)g.range.stop(1,1)[f?"animate":"css"]({left:a+"%"},e.animate);
if(p===1)g.range[f?"animate":"css"]({width:a-h+"%"},{queue:false,duration:e.animate})}else{if(p===0)g.range.stop(1,1)[f?"animate":"css"]({bottom:a+"%"},e.animate);if(p===1)g.range[f?"animate":"css"]({height:a-h+"%"},{queue:false,duration:e.animate})}h=a});else{i=this.value();j=this._valueMin();n=this._valueMax();a=n!==j?(i-j)/(n-j)*100:0;c[g.orientation==="horizontal"?"left":"bottom"]=a+"%";this.handle.stop(1,1)[f?"animate":"css"](c,e.animate);if(d==="min"&&this.orientation==="horizontal")this.range.stop(1,
1)[f?"animate":"css"]({width:a+"%"},e.animate);if(d==="max"&&this.orientation==="horizontal")this.range[f?"animate":"css"]({width:100-a+"%"},{queue:false,duration:e.animate});if(d==="min"&&this.orientation==="vertical")this.range.stop(1,1)[f?"animate":"css"]({height:a+"%"},e.animate);if(d==="max"&&this.orientation==="vertical")this.range[f?"animate":"css"]({height:100-a+"%"},{queue:false,duration:e.animate})}}});b.extend(b.ui.slider,{version:"1.8.11"})})(jQuery);
(function(b,d){function e(){return++f}function g(){return++a}var f=0,a=0;b.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:false,cookie:null,collapsible:false,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(true)},_setOption:function(c,h){if(c=="selected")this.options.collapsible&&
h==this.options.selected||this.select(h);else{this.options[c]=h;this._tabify()}},_tabId:function(c){return c.title&&c.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+e()},_sanitizeSelector:function(c){return c.replace(/:/g,"\\:")},_cookie:function(){var c=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+g());return b.cookie.apply(null,[c].concat(b.makeArray(arguments)))},_ui:function(c,h){return{tab:c,panel:h,index:this.anchors.index(c)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var c=
b(this);c.html(c.data("label.tabs")).removeData("label.tabs")})},_tabify:function(c){function h(r,u){r.css("display","");!b.support.opacity&&u.opacity&&r[0].style.removeAttribute("filter")}var i=this,j=this.options,n=/^#.+/;this.list=this.element.find("ol,ul").eq(0);this.lis=b(" > li:has(a[href])",this.list);this.anchors=this.lis.map(function(){return b("a",this)[0]});this.panels=b([]);this.anchors.each(function(r,u){var v=b(u).attr("href"),w=v.split("#")[0],y;if(w&&(w===location.toString().split("#")[0]||
(y=b("base")[0])&&w===y.href)){v=u.hash;u.href=v}if(n.test(v))i.panels=i.panels.add(i.element.find(i._sanitizeSelector(v)));else if(v&&v!=="#"){b.data(u,"href.tabs",v);b.data(u,"load.tabs",v.replace(/#.*$/,""));v=i._tabId(u);u.href="#"+v;u=i.element.find("#"+v);if(!u.length){u=b(j.panelTemplate).attr("id",v).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(i.panels[r-1]||i.list);u.data("destroy.tabs",true)}i.panels=i.panels.add(u)}else j.disabled.push(r)});if(c){this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.lis.addClass("ui-state-default ui-corner-top");this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");if(j.selected===d){location.hash&&this.anchors.each(function(r,u){if(u.hash==location.hash){j.selected=r;return false}});if(typeof j.selected!=="number"&&j.cookie)j.selected=parseInt(i._cookie(),10);if(typeof j.selected!=="number"&&this.lis.filter(".ui-tabs-selected").length)j.selected=
this.lis.index(this.lis.filter(".ui-tabs-selected"));j.selected=j.selected||(this.lis.length?0:-1)}else if(j.selected===null)j.selected=-1;j.selected=j.selected>=0&&this.anchors[j.selected]||j.selected<0?j.selected:0;j.disabled=b.unique(j.disabled.concat(b.map(this.lis.filter(".ui-state-disabled"),function(r){return i.lis.index(r)}))).sort();b.inArray(j.selected,j.disabled)!=-1&&j.disabled.splice(b.inArray(j.selected,j.disabled),1);this.panels.addClass("ui-tabs-hide");this.lis.removeClass("ui-tabs-selected ui-state-active");
if(j.selected>=0&&this.anchors.length){i.element.find(i._sanitizeSelector(i.anchors[j.selected].hash)).removeClass("ui-tabs-hide");this.lis.eq(j.selected).addClass("ui-tabs-selected ui-state-active");i.element.queue("tabs",function(){i._trigger("show",null,i._ui(i.anchors[j.selected],i.element.find(i._sanitizeSelector(i.anchors[j.selected].hash))[0]))});this.load(j.selected)}b(window).bind("unload",function(){i.lis.add(i.anchors).unbind(".tabs");i.lis=i.anchors=i.panels=null})}else j.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"));
this.element[j.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible");j.cookie&&this._cookie(j.selected,j.cookie);c=0;for(var p;p=this.lis[c];c++)b(p)[b.inArray(c,j.disabled)!=-1&&!b(p).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");j.cache===false&&this.anchors.removeData("cache.tabs");this.lis.add(this.anchors).unbind(".tabs");if(j.event!=="mouseover"){var l=function(r,u){u.is(":not(.ui-state-disabled)")&&u.addClass("ui-state-"+r)},k=function(r,u){u.removeClass("ui-state-"+
r)};this.lis.bind("mouseover.tabs",function(){l("hover",b(this))});this.lis.bind("mouseout.tabs",function(){k("hover",b(this))});this.anchors.bind("focus.tabs",function(){l("focus",b(this).closest("li"))});this.anchors.bind("blur.tabs",function(){k("focus",b(this).closest("li"))})}var m,o;if(j.fx)if(b.isArray(j.fx)){m=j.fx[0];o=j.fx[1]}else m=o=j.fx;var q=o?function(r,u){b(r).closest("li").addClass("ui-tabs-selected ui-state-active");u.hide().removeClass("ui-tabs-hide").animate(o,o.duration||"normal",
function(){h(u,o);i._trigger("show",null,i._ui(r,u[0]))})}:function(r,u){b(r).closest("li").addClass("ui-tabs-selected ui-state-active");u.removeClass("ui-tabs-hide");i._trigger("show",null,i._ui(r,u[0]))},s=m?function(r,u){u.animate(m,m.duration||"normal",function(){i.lis.removeClass("ui-tabs-selected ui-state-active");u.addClass("ui-tabs-hide");h(u,m);i.element.dequeue("tabs")})}:function(r,u){i.lis.removeClass("ui-tabs-selected ui-state-active");u.addClass("ui-tabs-hide");i.element.dequeue("tabs")};
this.anchors.bind(j.event+".tabs",function(){var r=this,u=b(r).closest("li"),v=i.panels.filter(":not(.ui-tabs-hide)"),w=i.element.find(i._sanitizeSelector(r.hash));if(u.hasClass("ui-tabs-selected")&&!j.collapsible||u.hasClass("ui-state-disabled")||u.hasClass("ui-state-processing")||i.panels.filter(":animated").length||i._trigger("select",null,i._ui(this,w[0]))===false){this.blur();return false}j.selected=i.anchors.index(this);i.abort();if(j.collapsible)if(u.hasClass("ui-tabs-selected")){j.selected=
-1;j.cookie&&i._cookie(j.selected,j.cookie);i.element.queue("tabs",function(){s(r,v)}).dequeue("tabs");this.blur();return false}else if(!v.length){j.cookie&&i._cookie(j.selected,j.cookie);i.element.queue("tabs",function(){q(r,w)});i.load(i.anchors.index(this));this.blur();return false}j.cookie&&i._cookie(j.selected,j.cookie);if(w.length){v.length&&i.element.queue("tabs",function(){s(r,v)});i.element.queue("tabs",function(){q(r,w)});i.load(i.anchors.index(this))}else throw"jQuery UI Tabs: Mismatching fragment identifier.";
b.browser.msie&&this.blur()});this.anchors.bind("click.tabs",function(){return false})},_getIndex:function(c){if(typeof c=="string")c=this.anchors.index(this.anchors.filter("[href$="+c+"]"));return c},destroy:function(){var c=this.options;this.abort();this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");this.anchors.each(function(){var h=
b.data(this,"href.tabs");if(h)this.href=h;var i=b(this).unbind(".tabs");b.each(["href","load","cache"],function(j,n){i.removeData(n+".tabs")})});this.lis.unbind(".tabs").add(this.panels).each(function(){b.data(this,"destroy.tabs")?b(this).remove():b(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide")});c.cookie&&this._cookie(null,c.cookie);return this},add:function(c,
h,i){if(i===d)i=this.anchors.length;var j=this,n=this.options;h=b(n.tabTemplate.replace(/#\{href\}/g,c).replace(/#\{label\}/g,h));c=!c.indexOf("#")?c.replace("#",""):this._tabId(b("a",h)[0]);h.addClass("ui-state-default ui-corner-top").data("destroy.tabs",true);var p=j.element.find("#"+c);p.length||(p=b(n.panelTemplate).attr("id",c).data("destroy.tabs",true));p.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");if(i>=this.lis.length){h.appendTo(this.list);p.appendTo(this.list[0].parentNode)}else{h.insertBefore(this.lis[i]);
p.insertBefore(this.panels[i])}n.disabled=b.map(n.disabled,function(l){return l>=i?++l:l});this._tabify();if(this.anchors.length==1){n.selected=0;h.addClass("ui-tabs-selected ui-state-active");p.removeClass("ui-tabs-hide");this.element.queue("tabs",function(){j._trigger("show",null,j._ui(j.anchors[0],j.panels[0]))});this.load(0)}this._trigger("add",null,this._ui(this.anchors[i],this.panels[i]));return this},remove:function(c){c=this._getIndex(c);var h=this.options,i=this.lis.eq(c).remove(),j=this.panels.eq(c).remove();
if(i.hasClass("ui-tabs-selected")&&this.anchors.length>1)this.select(c+(c+1<this.anchors.length?1:-1));h.disabled=b.map(b.grep(h.disabled,function(n){return n!=c}),function(n){return n>=c?--n:n});this._tabify();this._trigger("remove",null,this._ui(i.find("a")[0],j[0]));return this},enable:function(c){c=this._getIndex(c);var h=this.options;if(b.inArray(c,h.disabled)!=-1){this.lis.eq(c).removeClass("ui-state-disabled");h.disabled=b.grep(h.disabled,function(i){return i!=c});this._trigger("enable",null,
this._ui(this.anchors[c],this.panels[c]));return this}},disable:function(c){c=this._getIndex(c);var h=this.options;if(c!=h.selected){this.lis.eq(c).addClass("ui-state-disabled");h.disabled.push(c);h.disabled.sort();this._trigger("disable",null,this._ui(this.anchors[c],this.panels[c]))}return this},select:function(c){c=this._getIndex(c);if(c==-1)if(this.options.collapsible&&this.options.selected!=-1)c=this.options.selected;else return this;this.anchors.eq(c).trigger(this.options.event+".tabs");return this},
load:function(c){c=this._getIndex(c);var h=this,i=this.options,j=this.anchors.eq(c)[0],n=b.data(j,"load.tabs");this.abort();if(!n||this.element.queue("tabs").length!==0&&b.data(j,"cache.tabs"))this.element.dequeue("tabs");else{this.lis.eq(c).addClass("ui-state-processing");if(i.spinner){var p=b("span",j);p.data("label.tabs",p.html()).html(i.spinner)}this.xhr=b.ajax(b.extend({},i.ajaxOptions,{url:n,success:function(l,k){h.element.find(h._sanitizeSelector(j.hash)).html(l);h._cleanup();i.cache&&b.data(j,
"cache.tabs",true);h._trigger("load",null,h._ui(h.anchors[c],h.panels[c]));try{i.ajaxOptions.success(l,k)}catch(m){}},error:function(l,k){h._cleanup();h._trigger("load",null,h._ui(h.anchors[c],h.panels[c]));try{i.ajaxOptions.error(l,k,c,j)}catch(m){}}}));h.element.dequeue("tabs");return this}},abort:function(){this.element.queue([]);this.panels.stop(false,true);this.element.queue("tabs",this.element.queue("tabs").splice(-2,2));if(this.xhr){this.xhr.abort();delete this.xhr}this._cleanup();return this},
url:function(c,h){this.anchors.eq(c).removeData("cache.tabs").data("load.tabs",h);return this},length:function(){return this.anchors.length}});b.extend(b.ui.tabs,{version:"1.8.11"});b.extend(b.ui.tabs.prototype,{rotation:null,rotate:function(c,h){var i=this,j=this.options,n=i._rotate||(i._rotate=function(p){clearTimeout(i.rotation);i.rotation=setTimeout(function(){var l=j.selected;i.select(++l<i.anchors.length?l:0)},c);p&&p.stopPropagation()});h=i._unrotate||(i._unrotate=!h?function(p){p.clientX&&
i.rotate(null)}:function(){t=j.selected;n()});if(c){this.element.bind("tabsshow",n);this.anchors.bind(j.event+".tabs",h);n()}else{clearTimeout(i.rotation);this.element.unbind("tabsshow",n);this.anchors.unbind(j.event+".tabs",h);delete this._rotate;delete this._unrotate}return this}})})(jQuery);
/**
 * Backbone localStorage Adapter v1.0
 * https://github.com/jeromegn/Backbone.localStorage
 */

// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
window.Store = function(name) {
  this.name = name;
  var store = localStorage.getItem(this.name);
  this.records = (store && store.split(",")) || [];
};

_.extend(Store.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    localStorage.setItem(this.name, this.records.join(","));
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id) model.id = model.attributes.id = guid();
    localStorage.setItem(this.name+"-"+model.id, JSON.stringify(model));
    this.records.push(model.id.toString());
    this.save();
    return model;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    localStorage.setItem(this.name+"-"+model.id, JSON.stringify(model));
    if (!_.include(this.records, model.id.toString())) this.records.push(model.id.toString()); this.save();
    return model;
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return JSON.parse(localStorage.getItem(this.name+"-"+model.id));
  },

  // Return the array of all models currently in storage.
  findAll: function() {
    return _.map(this.records, function(id){return JSON.parse(localStorage.getItem(this.name+"-"+id));}, this);
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    localStorage.removeItem(this.name+"-"+model.id);
    this.records = _.reject(this.records, function(record_id){return record_id == model.id.toString();});
    this.save();
    return model;
  }

});

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
Backbone.localSync = function(method, model, options, error) {

  // Backwards compatibility with Backbone <= 0.3.3
  if (typeof options == 'function') {
    options = {
      success: options,
      error: error
    };
  }

  var resp;
  var store = model.localStorage || model.collection.localStorage;

  switch (method) {
    case "read":    resp = model.id != undefined ? store.find(model) : store.findAll(); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};

// Override 'Backbone.sync' to default to localSync, 
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.ajaxSync = Backbone.sync;
Backbone.sync = Backbone.localSync;
(this.require.define({
  "views/new_todo_view": function(exports, require, module) {
    (function() {
  var newTodoTemplate,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  newTodoTemplate = require('./templates/new_todo');

  exports.NewTodoView = (function(_super) {

    __extends(NewTodoView, _super);

    function NewTodoView() {
      NewTodoView.__super__.constructor.apply(this, arguments);
    }

    NewTodoView.prototype.id = 'new-todo-view';

    NewTodoView.prototype.events = {
      'keypress #new-todo': 'createOnEnter',
      'keyup #new-todo': 'showHint'
    };

    NewTodoView.prototype.render = function() {
      this.$(this.el).html(newTodoTemplate());
      return this;
    };

    NewTodoView.prototype.newAttributes = function() {
      var attributes;
      attributes = {
        order: app.todoList.nextOrder()
      };
      if (this.$('#new-todo').val()) {
        attributes.content = this.$('#new-todo').val();
      }
      return attributes;
    };

    NewTodoView.prototype.createOnEnter = function(event) {
      if (event.keyCode !== 13) return;
      app.todoList.create(this.newAttributes());
      return this.$('#new-todo').val('');
    };

    NewTodoView.prototype.showHint = function(event) {
      var input, tooltip;
      tooltip = this.$('.ui-tooltip-top');
      input = this.$('#new-todo');
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (input.val() === '' || input.val() === input.attr('placeholder')) return;
      return this.tooltipTimeout = setTimeout((function() {
        return tooltip.fadeIn();
      }), 1000);
    };

    return NewTodoView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/stats_view": function(exports, require, module) {
    (function() {
  var statsTemplate,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  statsTemplate = require('./templates/stats');

  exports.StatsView = (function(_super) {

    __extends(StatsView, _super);

    function StatsView() {
      StatsView.__super__.constructor.apply(this, arguments);
    }

    StatsView.prototype.id = 'stats-view';

    StatsView.prototype.events = {
      'click .todo-clear': 'clearCompleted'
    };

    StatsView.prototype.render = function() {
      var data;
      data = {
        total: app.todoList.length,
        done: app.todoList.done().length,
        remaining: app.todoList.remaining().length
      };
      this.$(this.el).html(statsTemplate({
        stats: data
      }));
      return this;
    };

    StatsView.prototype.clearCompleted = function() {
      return app.todoList.clearCompleted();
    };

    return StatsView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/todo_list_view": function(exports, require, module) {
    (function() {
  var TodoView, todoListTemplate,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TodoView = require('views/todo_view').TodoView;

  todoListTemplate = require('./templates/todo_list');

  exports.TodoListView = (function(_super) {

    __extends(TodoListView, _super);

    function TodoListView() {
      this.renderStats = __bind(this.renderStats, this);
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      TodoListView.__super__.constructor.apply(this, arguments);
    }

    TodoListView.prototype.id = 'todos-view';

    TodoListView.prototype.addOne = function(todo) {
      var view;
      view = new TodoView({
        model: todo
      });
      return $(this.el).find('#todos').append(view.render().el);
    };

    TodoListView.prototype.addAll = function() {
      return app.todoList.each(this.addOne);
    };

    TodoListView.prototype.initialize = function() {
      app.todoList.bind('add', this.addOne);
      app.todoList.bind('reset', this.addAll);
      return app.todoList.bind('all', this.renderStats);
    };

    TodoListView.prototype.render = function() {
      $(this.el).html(todoListTemplate());
      return this;
    };

    TodoListView.prototype.renderStats = function() {
      return app.views.stats.render();
    };

    return TodoListView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/todo_view": function(exports, require, module) {
    (function() {
  var todoTemplate,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  todoTemplate = require('./templates/todo');

  exports.TodoView = (function(_super) {

    __extends(TodoView, _super);

    function TodoView() {
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.prototype.tagName = 'li';

    TodoView.prototype.events = {
      'click .check': 'toggleDone',
      'dblclick .todo-content': 'edit',
      'click .todo-destroy': 'clear',
      'keypress .todo-input': 'updateOnEnter'
    };

    TodoView.prototype.initialize = function() {
      this.model.bind('change', this.render);
      return this.model.view = this;
    };

    TodoView.prototype.render = function() {
      this.$(this.el).html(todoTemplate({
        todo: this.model.toJSON()
      }));
      this.$('.todo-input').bind('blur', this.update);
      return this;
    };

    TodoView.prototype.toggleDone = function() {
      return this.model.toggle();
    };

    TodoView.prototype.edit = function() {
      this.$(this.el).addClass('editing');
      return $('.todo-input').focus();
    };

    TodoView.prototype.update = function() {
      this.model.save({
        content: this.$('.todo-input').val()
      });
      return this.$(this.el).removeClass('editing');
    };

    TodoView.prototype.updateOnEnter = function(event) {
      if (event.keyCode === $.ui.keyCode.ENTER) return this.update();
    };

    TodoView.prototype.remove = function() {
      return $(this.el).remove();
    };

    TodoView.prototype.clear = function() {
      return this.model.clear();
    };

    return TodoView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/user": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.User = (function(_super) {

    __extends(User, _super);

    function User() {
      User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var BrunchApplication, HomeView, MainRouter, NewTodoView, StatsView, TodoList, TodoListView, TodoView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  TodoList = require('collections/todo_list').TodoList;

  MainRouter = require('routers/main_router').MainRouter;

  HomeView = require('views/home_view').HomeView;

  NewTodoView = require('views/new_todo_view').NewTodoView;

  StatsView = require('views/stats_view').StatsView;

  TodoView = require('views/todo_view').TodoView;

  TodoListView = require('views/todo_list_view').TodoListView;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      this.todoList = new TodoList;
      this.routers.main = new MainRouter;
      this.views.home = new HomeView;
      this.views.newTodo = new NewTodoView;
      this.views.todoList = new TodoListView;
      this.views.stats = new StatsView;
      return Backbone.history.start();
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;

}).call(this);

  }
}));
(this.require.define({
  "helpers": function(exports, require, module) {
    (function() {

  exports.BrunchApplication = (function() {

    function BrunchApplication() {
      var _this = this;
      this.routers = {};
      this.models = {};
      this.collections = {};
      this.views = {};
      this.utils = {};
      jQuery(function() {
        return _this.initialize(_this);
      });
    }

    BrunchApplication.prototype.onReady = function() {
      return null;
    };

    return BrunchApplication;

  })();

}).call(this);

  }
}));
(this.require.define({
  "collections/todo_list": function(exports, require, module) {
    (function() {
  var Todo,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Todo = require('models/todo').Todo;

  exports.TodoList = (function(_super) {

    __extends(TodoList, _super);

    function TodoList() {
      TodoList.__super__.constructor.apply(this, arguments);
    }

    TodoList.prototype.model = Todo;

    TodoList.prototype.initialize = function() {
      return this.localStorage = new Store('todos');
    };

    TodoList.prototype.done = function() {
      return this.filter(function(todo) {
        return todo.get('done');
      });
    };

    TodoList.prototype.remaining = function() {
      return this.without.apply(this, this.done());
    };

    TodoList.prototype.nextOrder = function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    };

    TodoList.prototype.comparator = function(todo) {
      return todo.get('order');
    };

    TodoList.prototype.clearCompleted = function() {
      return _.each(this.done(), function(todo) {
        return todo.clear();
      });
    };

    return TodoList;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/todo": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.Todo = (function(_super) {

    __extends(Todo, _super);

    function Todo() {
      Todo.__super__.constructor.apply(this, arguments);
    }

    Todo.prototype.defaults = {
      content: 'Empty todo...',
      done: false
    };

    Todo.prototype.toggle = function() {
      return this.save({
        done: !this.get('done')
      });
    };

    Todo.prototype.clear = function() {
      this.destroy();
      return this.view.remove();
    };

    return Todo;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/home": function(exports, require, module) {
    module.exports = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
    
      _print(_safe('<div id="todo-app">\n  <h1>Todos</h1>\n</div>\n<ul id="instructions">\n  <li>Double-click to edit a todo.</li>\n  <!-- <li><a href="../docs/todos.html">View the annotated source.</a></li> -->\n</ul>\n<div id="credits">\n  <span>Originally created by</span>\n  <a href="http://jgn.me/">J&eacute;r&ocirc;me Gravel-Niquet</a>\n  <span>Rewritten by</span>\n  <a href="https://github.com/brunch">Brunch Team</a>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
  }
}));
(this.require.define({
  "views/templates/new_todo": function(exports, require, module) {
    module.exports = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
    
      _print(_safe('<input id="new-todo" placeholder="What needs to be done?" type="text">\n<div class="ui-tooltip-top">Press Enter to save this task</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
  }
}));
(this.require.define({
  "routers/main_router": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'home'
    };

    MainRouter.prototype.home = function() {
      app.views.home.render();
      return app.todoList.fetch();
    };

    return MainRouter;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var homeTemplate,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  homeTemplate = require('./templates/home');

  exports.HomeView = (function(_super) {

    __extends(HomeView, _super);

    function HomeView() {
      HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.el = '#home-view';

    HomeView.prototype.render = function() {
      var $todo, viewName, _i, _len, _ref;
      this.$(this.el).html(homeTemplate());
      $todo = this.$(this.el).find('#todo-app');
      _ref = ['newTodo', 'todoList', 'stats'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        viewName = _ref[_i];
        $todo.append(app.views[viewName].render().el);
      }
      return this;
    };

    return HomeView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/stats": function(exports, require, module) {
    module.exports = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
    
      if (this.stats.total) {
        _print(_safe('\n  <span class="todo-count">\n    <span class="number">'));
        _print(this.stats.remaining);
        _print(_safe('</span>\n    <span class="word">\n      '));
        if (this.stats.remaining === 1) {
          _print(_safe('item'));
        } else {
          _print(_safe('items'));
        }
        _print(_safe('\n    </span>\n    left.\n  </span>\n'));
      }
    
      _print(_safe('\n\n'));
    
      if (this.stats.done) {
        _print(_safe('\n  <a class="todo-clear">\n    Clear <span class="number-done">'));
        _print(this.stats.done);
        _print(_safe('</span> completed\n    <span class="word-done">\n      '));
        if (this.stats.done === 1) {
          _print(_safe('item'));
        } else {
          _print(_safe('items'));
        }
        _print(_safe('\n    </span>\n  </span>\n'));
      }
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
  }
}));
(this.require.define({
  "views/templates/todo_list": function(exports, require, module) {
    module.exports = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
    
      _print(_safe('<ul id="todos"></ul>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
  }
}));
(this.require.define({
  "views/templates/todo": function(exports, require, module) {
    module.exports = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
    
      _print(_safe('<div class="todo '));
    
      if (this.todo.done) _print(_safe('done'));
    
      _print(_safe('">\n  <div class="display">\n    <input class="check" type="checkbox" '));
    
      if (this.todo.done) _print(_safe('checked="checked"'));
    
      _print(_safe('>\n  <div class="todo-content">'));
    
      _print(this.todo.content);
    
      _print(_safe('</div>\n    <span class="todo-destroy"></span>\n  </div>\n  <div class="edit">\n    <input class="todo-input" type="text" value="'));
    
      _print(this.todo.content);
    
      _print(_safe('">\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
  }
}));
