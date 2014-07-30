#Connect Session Store for Sequelize

connect-sequelize is a SQL session store using [Sequelize](http://sequelizejs.com).

#IMPORTANT

**NOTE** this module was in large part derived from Michael Weibel's "connect-session-sequelize" unfortunately there
 were a few gotchas that needed to be worked out, along with a need to be able to pass any Model options as you
 would normally with Sequelize. Hence the original module was modified to suit those needs.

With that said big thanks to [Michael Weibel](https://github.com/mweibel) for the awesome work would be appropriate!

**It is important to note that the signature is slightly different. see below.**

connect-sequelize takes three arguments.

- db the sequelize connection.
- options an object containing any model options (optional).
- modelName the name of the model. (optional).



#Installation

```
$ npm install connect-sequelize
```

#Requirements

Express 4.x or greater.

#Options

see [Sequelize Docs](http://sequelizejs.com/docs/latest/models) all Model define options are available.
for example you may wish to specify the tableName explicitly or change updatedAt and createdAt, a brief example below.

**NOTE** the default table name is the model name if provided or "Session". If you wish to have the table 
name be something other than the provided model name or session, you can specify as described below. This is useful
if you wanted your model name to be "Session" but you have some convention for your table names such as express_session.

```
{
    updatedAt: 'modifiedAt'
    tableName: 'Session' // creates table exactly as specified.
    freezeTableName: true // prevents table name from being pluralized.
}
```

In addition you can specify a 'callback' in options that takes a function with
one argument ("error"). The callback is triggered when database model was
synchronized with the database.

#Usage

With connect

```javascript
var connect = require('connect')
	// for express, just call it with 'require('express-session').Store
	SequelizeStore = require('connect-sequelize')(connect.session.Store);

connect().use(connect.session({
	store: new SequelizeStore(db, options, modelName),
	secret: 'CHANGEME'
}));
```

With express 4:

```javascript
// load dependencies
var express = require('express'),
    Sequelize = require('sequelize'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

// initalize sequelize with session store
var SequelizeStore = require('connect-sequelize')(session),
    modelName = 'Session',
    options = {
        // our options if any. see above for example.
    };

// create database, ensure 'sqlite3' in your package.json
var db = new Sequelize(
    "database",
    "username",
    "password", {
        "dialect": "sqlite",
        "storage": "./session.sqlite"
});

// configure express
var app = express()
app.use(cookieParser())
app.use(session({
  secret: 'keyboard cat',
  store: new SequelizeStore(db, options, modelName),
  proxy: true // if you do SSL outside of node.
}));
// continue as normal
```

#License

Origin1 Technologies 12/24/2013


connect-sequelize session module for Express

Copyright (C) 2013-2014  Origin1 Technologies

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

You should have received a copy of the MIT license.
If not, see http://serverside-boilerplate.mit-license.org.
