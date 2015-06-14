gulp-env
========

Add or modify variables in your `process.env`.

Benefit
========

Often, two processes running at the same time need different environmental variables (for example: running tests and a server from the same gulp process). `gulp-env` helps simplify that problem, by letting you establish your env vars whenever you'd like, in a simpler interface. You can set values from an external `.json`, `.ini`, or other file, or hardcode the vars directly by using `env({vars:{}})`.

Install
========

```
npm i --save-dev gulp-env
```

The TypeScript definition file is available in gulp-env.d.ts within the base directory.

Usage
========

## Example

Nodemon server

```js
// gulpfile.js
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var env = require('gulp-env');

gulp.task('nodemon', function() {
  env({
    file: ".env.json",
    vars: {
      // any variables you want to overwrite
    }
  });

  nodemon({
    script: 'server.js',
    ext: 'js html'
    // other config ...
  });
});

gulp.task('default', ['nodemon'])
```

ES6 web development

```js
var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('debug', function() {
  return gulp.src('src/main.js')
    .pipe(env.set({
      NODE_ENV: 'debug'
    }))
    .pipe(babel({optional: [
      'utility.inlineEnvironmentVariables'
    ]}))
    .pipe(uglify())
    .pipe(transform(function(file) {
      return browserify(file).bundle();
    }))
    .pipe(gulp.dest('dist'));
});
```

## Details

`gulp-env` has full test coverage for JSON files, JS modules, INI files, and custom handlers. The entire API below is covered as well. It can also be used in the middle of a Gulp pipeline, where this returns a no-op stream. Note that the `process.env` changes happen synchronously, at the time when the function is called.

Read a file and set `process.env` accordingly:

```js
env(file: string);
```

Set one or more hardcoded values in `process.env` directly.

```js
env({vars: Object});
env.set(vars: Object);
```

Parse a file, overriding some of its variables.

```js
env({
  // file to read
  file: string,

  // overrides
  vars: Object,
});
```

Parse a file with a custom parser.

```js
env({
  // file to read
  file: string,

  // custom handling, `contents` is the file's contents
  handler: (contents: string) => Object,

  // optional overrides
  vars?: Object,
});
```

Parse a file as a different type.

```js
env({
  // file to read
  file: string,

  // Treat it like this type. See `options.type` for limitations.
  type: string,

  // overrides
  vars?: Object,
});
```

### `file`, `options.file`

The `file` option loads the file's contents automatically, calling `require` if it isn't a `.ini` file or if there is no `handler`. You can omit the extension as far as `require` allows if it's already registered, since this uses `require` under the hood as a fallback.

```js
// .env.json
{
  MONGO_URI: "mongodb://localhost:27017/testdb"
}

// .env.js
module.exports = {
  MONGO_URI: "mongodb://localhost:27017/testdb",
};

// gulpfile.js
var env = require('gulp-env');

process.env.MONGO_URI === "mongodb://localhost:27017/testdb"; // maybe false

// Any of these will work:
env(".env"); // if the file can be found via `require`
env(".env.json");
env({file: ".env"}); // if the file can be found via `require`
env({file: ".env.json"});

process.env.MONGO_URI === "mongodb://localhost:27017/testdb"; // true
```

### `options.vars`

Properties on this object overwrite all existing external properties given by file loading, handlers, etc. All of these will also be added to `process.env`.

```js
// gulpfile.js
var env = require('gulp-env');
env({
  file: 'env.ini',
  vars: {
    MONGO_URI: "mongodb://localhost:27017/testdb-for-british-eyes-only",
    PORT: 9001
	}
});
```

For the case of just setting environment variables, you can use `env.set`.

```js
// These two are equivalent. They both can also be used in Gulp streams.
env({vars: vars});
env.set(vars);
```

### `options.handler`

This customizes the parsing of the file. If this is given, the extension name is ignored, and the handler itself is directly called. This is very useful in cases where this module doesn't already support the format. Internally, the module uses this hook for its INI and JSON readers.

The function, if given, is called with two arguments:

- `contents` - the file's contents
- `filename` - the file's name

Notes:

- You don't need this if the file type itself is already registered in `require.extensions`.
- If the file doesn't exist, then `contents` is undefined. `filename` is still passed, though.
- If the extension is omitted, then `filename` reflects that, i.e. the extension is omitted.

```coffee
# CSON is frequently used in CoffeeScript projects. Why not use that?
env = require 'gulp-env'
CSON = require 'cson-safe'

env
  file: '.env.cson'
  handler: (contents) -> CSON.parse contents
```

```js
// Or, why can't we use YAML?
var env = require('gulp-env');
var jsyaml = require('js-yaml');

env({
  file: '.env.yaml',
  handler: function(contents, filename) {
    return jsyaml.safeLoad(contents, {filename: filename});
  },
});
```

### `options.type`

Treats the file input as if its extension was `type`. It doesn't work for `require`d files, since Node.js doesn't have hooks to do that, but it currently works for `json` and `ini` types. Others may potentially be added over time.

```js
var env = require('gulp-env');

env({
  file: '.env',
  type: 'ini',
});

// You can also specify it as an extension, as opposed to a type.
env({
  file: '.env',
  type: '.ini',
});
```
