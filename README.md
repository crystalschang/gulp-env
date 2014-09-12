gulp-env
========

Add env vars from a .env or .env.json file to your process.env


Install
========

```
npm i --save-dev gulp-env
```

Usage
========

gulp-env handles two kinds of .env files:

```
//.env.json
{
	MONGO_URI: "mongodb://localhost:27017/testdb
}
```

```
//.env
module.exports = {
	MONGO_URI: "mongodb://localhost:27017/testdb
}
```

You can add the properties of this object to your process.env via
`env({file: ".env"})` or `env({file: ".env.json"})` in your gulpfile.

```
//gulpfile.js
gulp = require('gulp'),
  nodemon = require('nodemon'),
  env = require('gulp-env');

gulp.task('nodemon', function() {
	//nodemon server ...
});

gulp.task('set-env', function () {
	env({file: ".env.json"});
});

gulp.task('default', ['set-env', 'nodemon'])
```

TODO
========

For now, this plug-in is stupid simple.

Seriously, this is all of the code!

```
'use strict';

module.exports = function(options) {
  if (options.file) {
    var env = require(process.cwd() + "/" + options.file);

    for (var prop in env) {
      process.env[prop] = env[prop]
    }
  }
}
```

TODO:

- handle ini files
- allow for simple variable setting (i.e. `env({PORT: 4000})`, etc.)
