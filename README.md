# bld-js-env
A steps by steps how to build a JavaScript Environment with nodeJS


//- #Plurasight# Building a JavaScript Development Environment //
//- #Plurasight# Building a JavaScript Development Environment //
# JS Starter Kits contents:
- Package Management
- Bundling
- Minification
- Sourcemaps
- Transpiling
- Dynamic HTML Generation
- Centralised HTTP
- Mock API framework
- Component libraries
- Development Webserver
- Linting
- Automated testing
- Continuous Integration
- Automated build
- Automated deployment
- Working example app


# > Github setup
to start create a repository on github and set git to ignore node module folder


# > Choosing and setting up an EditorConfig
EditorConfig helps developers define and maintain consistent coding styles between different editors and IDEs.
Most of IDEs has a plugin but in a case not provided, simply create a file 'editorconfig.org' at the root of your project
with setting as
	# editorconfig.org
	root = true
	[*]
	indent_style = space
	indent_size = 2
	end_of_line = lf
	charset = utf-8
	trim_trailing_whitespace = true
	insert_final_newline = true

	[*.md]
	trim_trailing_whitespace = false


# > Choosing and setting up a package management
.There are the 3 most popular ones: bower, npm, jspm with npm considered the most popular ones

# > Install node with at least v4
. Use node version manager in order to switch which version of node to install for your application  (check JavaScript ES6 HOWTO-tutorial)
. copy this package.json file to your project root directory  http://bit.ly/jsdevpackagejson
. to install the package run project env $ npm install
. to check for security vunerablilty in node_modules or downloaded packages use retire.js
	$ npm install -g nsp
. to run it $ nsp check

# > Choosing a development webserver
. http-server -- ultra-simple - simple command serves current directory
. live-server -- lightweight - support live-reloading
. Express -- more comprehensive, highly configurable, production grade, serves comlex api via node, run everywhere. There are some alternatives such as koa, hapi
. budo -- integrates with Browserify, includes hot reloading
. webpack web server -- builtin to webpack which simply you won't have to pull another dependencies. serves from memory also includes hot reloading
. browsersync -- dedicated IP for sharing work on LAN, all interactions remain in synchronized. Great for cross devices testing. Integrates with webpack, browserify, gulp
> Please note all of these webservers are not for production in exception of express.

# > Setup Express (dev and prod web server)
. if it's already included in package.json, run npm install
. create a folder buildScripts > inside create a file srcServer.js that will be configured as a webserver
. Setup the webser as follows:
e.g./buildScripts/srcServer.js
var express = require('express');
var path = require('path');
var open = require('open');

var port = '2000';
var app = express();

/* tell express which route to handle */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, function(err){
  if (err){
    console.log(err);
  } else {
    open('http://localhost:'+port);
  }
});

. create a folder called src and a sample html file named index.html with some boilerplate content
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>

. now start your webserver with this command from your project directory & your content will be served from
	$ node buildScripts/srcServer.js

# > Sharing your work in progress
. to share your work with your customer or client locally, you might consider browsersync
but over the internet with spending extra on a cloud based solution, these tool can be the best options
 -- localtunnel, ngrok, surge, now

. localtunnel -- easily share work on your local machine over a public IP
$ npm install localtunnel -g
* in order to share,
* startup your app
* to serve your app
$ lt --port 3000
* no security, anyone with a URL can access your app
* you can create a custom subdomain by serving your app
$ lt --port 3000 --subdomain mecxi


. ngrok -- easily create a tunnel to your local machine
* sign up
* install ngrok
* install authtoken
* start your app
* /.ngrok http 3000
* With ngrok you can password protect access your app

. now -- deploys instead your app over the cloud so others can review it
* npm install -g now
* create start script such as express
* to deploy just type $ now
* you don't have to leave your machine on for plublic access and review

. Surge -- quickly hots static files to the public URL
. deploy your files to their public server and serve your app
* $ npm install -g surge
* $ surge
* please note that only static files, no nodejs projects


# > Automated your build process you may use these options
-- Grunt, Gulp, npm scripts

> Grunt -- was the first JS task runner to be popular.
	- It's a configuration based
	- Writes intermediary files between steps
	- Large plugin ecosystem

> Gulp -- focus in memory stream called pipes
	- faster than Grunt
	- code based
	- Large plugin ecosystem

> npm Scripts
	- Declared in package.json file
	- Leverage your OS' command line
	- Directly use npm packages
	- Call separate Node scripts
	- Convention-based pre/post hooks
	- Leverage world's largest package manager

Why npm Scripts?
	- Use tools directly
	- No need for separate plugins
	- Simpler debugging
	- Better docs
	- Easy to learn

## Demo - NPM Scripts
. edit the package.json file of your project
. add under 'scripts':{"start": "node buildScripts/srcServer.js"}
. to run it $ npm start
. you can also specify a startup message that shows up.
	> create a file in buildScripts/startMessage.js
	> add
var chalk = require('chalk');
console.log(chalk.green('Starting app in dev mode...'));
	> add a prestart in package.json under 'scripts': {"prestart": "node buildScripts/startMessage.js"}

. note that in npm any hooks you preface with the word pre, will run before the said word and post, will run after.

. Create security check | when using npm scripts, there's no need to install nsp (node security check) globally
in node_modules/bin already comes with these packages installed locally in the project directory
@@ notice - nsp check -- Error: Client request error: getaddrinfo ENOTFOUND api.nodesecurity.io @@@
<<
"beginning with npm@6, a new command, npm audit, recursively analyzes your dependency trees to identify specifically what’s insecure, recommend a replacement,
or fix it automatically with  npm audit fix."  nsp check to npm audit --audit-level high
more detail can be found here : https://docs.npmjs.com/cli/audit
>>
	> add security check 'scripts': {"security-check": "npm audit fix"}

. add share your work using npm scripts
	> 'scripts': {"share": "lt --port 2000"}

. we can run all these npm scripts at once using a package called npm-run-all to run all task in parallel
	  "scripts": {
    "prestart": "node buildScripts/startMessage.js",
    "start":"npm-run-all --parallel security-check open:src",
    "open:src": "node buildScripts/srcServer.js",
    "security-check": "nsp check",
    "share": "lt --port 2000"
  },

. to run just type npm run start || npm start -s  /. for silent

. You can also personalise the share hooks by running in parallel the buildScripts and open localtunnel
	{
	"localtunnel" : "lt --port 2000",
	"share": "npm-run-all --parallel open:src localtunnel"
	}


# > Which transpiler to choose  from?
-- babel, typeScript, Elm

 . babel - Modern, standards-based JS, today
 . typeScript - is a superset of JS which typically add type safety to JS, enhanced autocompletion, safer refactoring,
 additional non-standard features.
 . Elm - compiles down to JS, clear syntax, immutable data structures, friendly errors, all errors are compiled time errors, interops with JS

 The preferable choice here will be babel as it's more commonly use.

	> if you prefer to use experimental feature, you can setup a babel configuration file, placed either in package.json file
or external file with extension .babelrc which is not npm specific with the use of plugins
		{
			"name":"my-package",
			"version":"1.0.0",
			"babel": {
				// my babel config here
			}
		}

	> also note that whether you are using nodejs env or Electron, each env can only transpile features not currenly supported by the env.

	> Babel Setup
	. create a file .babelrc with the following contents
{
	"presets":[
		"latest"
	]
}

	. for testing, change /buildScripts/startMessage.js content to ES6 syntax
	'old syntax':var chalk = require('chalk');  to 'new syntax': import chalk from 'chalk';
	. add babel-node in the npm scripts - prestart for this build
	"scripts": {
    "prestart": "babel-node buildScripts/startMessage.js",
	...

	. also add babel-node to npm scripts - start as well and convert /buildScripts/srcServer.js syntax to ES6
	import express from 'express';
import path from 'path';
import open from 'open';

const port = '2000';
const app = express();

...

# > Why Bundle?
. bundling is a process of packaging project into files or package which is used for the browser or to include in your app to speed up downloading and bandwith.

	> These are the most used JS modules formats - Immediately Invoke Function Expression (IIFE), Asynchronous Module Definition (AMD), CommonJS (CJS), Universal Module Definition (UMD), ES6 Modules
	. to avoid the utilisation of global variables these solution were implemeted -- a way to encapuslate JS packages:

	- Immediately Invoke Function Expression (IIFE) | this format is deprecated
	e.g
	(function(){
	// my code here
	})();

	- Asynchronous Module Definition (AMD) | this format is deprecated
	e.g
		define(['jq'], function(jq){});

	- CommonJS | mostly used in nodeJS | can still be used
	e.g
		var jquery = require('jquery');

	- ES6 Module | more recommanded
	e.g
	import jQuery from 'jquery'

. ES6 modules should also be known ES2015 modules should be the format to use with these benefits:
	- Standardised
	- Statically analysable
		- Improved autocomplete
		- Intelligent refactoring
		- Fails fast
		- Tree shaking
	- Easy to read
		- Named imports
		- default exports
> Choosing a bundler which packages your javascript code for the browser or node
- browserify, webpack, Rollup, JSPM

	> browserify
		- the first bundler to reach mass adoption
		- bundle npm packages for the web
		- Large plugin ecosystem

	> Webpack
		- bundles more than just JS
		- import CSS, images, etc like JS
		- built in hot-reloading web server

	> Rollup
		- tree shaking -- meaning it will eliminate code you're not using in the final bundle.
		- faster loading production code
		- quite new
		- Great for library authors
		- not hot reloading and code splitting

	> JSPM
		- Uses systemJS behind the scene. A universal module loader
		- can load modules at runtime
		- has its hown package manager
		- Uses Rollup in builder

For now what is recommened as a bundler 'Webpack' for these reasons
	- Much more than just JS
		- CSS, Images, Fonts, HTML5
	- Offers strategic bundle splitting whereby your users don't have to download all packages at once only the needed ones for that section of the app
	- Has built-in web server for hot-module-reloading
	- Webpack2 will offer tree-shaking (eliminate the code not being used in the final bundle)


# > Configuring Webpack
. webpack is config at the root of your project.
. create a file called webpack.config.dev.js and the content below:

import path from 'path';

export default {
  debug: true, 															/. debug information to be display
  devtool: 'inline-source-map',												/.
  moInfo: false,															/. display a list of files that is being compiled
  entry: [																	/. set the entry point of your application
    path.resolve(_dirname, 'src/index')
  ],
  target: 'web',															/. to the target running env
  output:{																	/. where to create our bundle but technically the bundle will be loaded into memory and seves to the browser
    path: path.resolve(_dirname, 'src'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [],															    /. includes plugins such as hot-reloading, lintting files, caching errors,etc...
  module: {																	/. specify which files types to load
    loaders:[
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
      {test: /\.css$/, loaders: ['style', 'css']}
    ]
  }
}

. then configure webpack with express
import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';

const port = '2000';
const app = express();
const compiler = webpack(config);

/* tell express to use webpack */
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
...

. create an entry point of your application as per the webpack configuration in this case src/index and add below
./src/index.js
import numeral from 'numeral';
const coursevalue = numeral(1000).format('$0.0.00');
console.log(`I would pay ${courseValue} for this awesome course!`);

. include the bundle.js in your html as set webpack config
./src/index.html
...
<body>
  <h1>Hello World</h1>
  <script src="bundle.js"></script>
</body>
...


. to test if the CSS is being compiled. Create in src directory index.css with the content below
./src/index.css
body {
  font-family: sans-serif;
  color: red;
}

table th {
  padding: 5px;
}

. and load the css into the entry point
./src/index.js
import './index.css';
import numeral from 'numeral';


# > Soucemaps - to debug transpiled code back to original
. to debug our transpiled code we are going to use sourcemaps
. code is downloaded only if open in a developer tool

	> setting up the sourcemaps code generator
	. simply add debugger; into your src/index.js to enable debugging mode

./src/index.js
import './index.css';
import numeral from 'numeral';

const courseValue = numeral(1000).format('$0.0.00');
debugger;

# > Linting
Linting is the process of running a program that will analyse code for potential errors.
Linting tool a static code analysis tool used in software development for checking if JavaScript source code complies with coding rules.
. The ability to catch any errors in your code before runtime.
. why do you need Lint?
	> enforce consistency and standardization usage like avoid the usage of features or methods a team has decided not to.
		. curly brace position
		. confirm /alert
		. Trailing commas
		. Globals
		. evals

	> Avoid mistakes
		. Extra parenthesis
		. OVerwriting function
		. Assignment in conditional
		. Missing default case in switch
		. leaving degugger / console.log statement in your code

. Type of Linters
	> JSLint, this tool was the orignal created by Douglas Crockford
	> JSHint, commonly used which offers more configuration than JSLint
	> ESLint, the defacto standard for code analysis

# > Configuring ESLint
- Core Decisions for configuration
. choose the format
. Which built-in rules
. Whether to use warning or errors
. Which plugins
. Use a preset instead which offers a standard rules already defined and ready to go

- Configuration file formats
ESLint supports these files formats
JavaScript -> use .eslintrc.js and export an object containing your config
YAML -> use .eslintrc.yaml or eslintrc.yml to define config structures
JSON - use .eslintrc.json to define config structures
package.json - create an eslintConfig property in your package.json file and define your config

Let's use package.json as our config choice
"eslintConfig": {
	"plugins": ["example"],
	"env": {
	"example/custom":true
	}
}

. for more info check https://eslint.org/docs/user-guide/getting-started
. you can choose any plugins based on your current framework and offored features

# > Watching files with ESLint
. By default ESLint doesn't watch files for any changes to enforce rules.
. If you want to automatically run ESLint on every file save, add eslint-loader or eslint-watch
	> eslint-loader included with Webpack
	. re-lints all files upon save
	> eslint-watch
	. ESLint wrapper that adds file watch
	. Not tied to webpack
	. better warning/error formatting
	. displays clean message
	. Easily lint test and build scripts too

. Lint via an Automated Build Process

# > Demo : ESLint Set up as a separate file
. create /.eslintrc.json at the root of your project
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "parseOptions":{
    "ecmaVersion":7,
    "sourceType":"module"
  },
  "env":{
    "browser":true,
    "node": true,
    "mocha": true
  },
  "rules":{
    "no-console":1
  }
}
. rules values - 0 off, 1 Warning, 2 Error
. add eslint to a npm script with an handy package (eslint-watch) to watch change when saved
./package.json
{
	....
	"scripts": {
	...
	"lint": "esw webpack.config* src buildScripts --color"
	}
}

. addding --color helps to highlight console report error and then run to analyse
$ npm run lint

. by the rule we define 'no-console'; this should display errors related
. to fix that simply add to the related files, comment like //eslink-disable-line no-console  || /* eslint-disable no-console */
. if all the rules are followed eslint-watch should display a 'clean message report'

[ERROR] : Eslint parsing error: Keyword “import” is reserved
. The import keyword is a recent addition to the standard, therefore on parsers that follow the older revisions of the syntax, it would not work.
. If you are using Babel, you can use the babel-eslint parser and eslint-plugin-babel to use any option available in Babel.
$ $ npm install eslint@4.x babel-eslint@8 --save-dev
. update eslint config file as
{
  "parser": "babel-eslint",
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "env":{
    "browser":true,
    "node": true,
    "mocha": true
  },
  "rules":{
    "no-console":1
  }
}

# > Demo : Watch your files with ESLint-watch
. add to your package.json under npm scripts these line;
"scripts":{
	"lint:watch": "npm run lint -- --watch"
}
. to make eslint to watch your files when your server runs all task in npm scripts, simply add these lines to npm scripts 'start'
"start":"npm-run-all --parallel security-check open:src lint:watch"


# > Testing and continuous Integration
. Javascript testing styles
	> Unit Testing : single function or module in an automated fashion
	> Integration Testing: Interaction between modules
	> UI : Automate interactions with UI which test an app by automated key strokes on the actual UI

. Choose  a testing framework
	> Mocha
	> Jasmine
	> Tape
	> QUnit
	> AVA
	> Jest

. Choose an assertion libraries
	> An assertion is the ability to declare what you will expect
	e.g
	expect(2+2).to.equal(4)
	assert(2+2).equals(4)

	> The most popular assertion library is Chai https://www.chaijs.com/

. Choose your helper library
	. JSDOM : simulate the browser's DOM that you can run in nodejs; run DOM-related tests without a browser
	. Cherio : jQuery for the server; Query virtual DOM using jQuery selectors

. Where to run our tests
	> Browser (karma, testem)
		. Run in a browser using karma, Testem test-runner for running test on the browser
	> Headless Browser (PhantomJS)
		. this is a browser which doesn't have a visible UI.
	> In-memory DOM (JSDOM)
		. JSDOM is a lighweight version of PhantomJS which focuses to simulate DOM in memory

. Where Do Test Files Belong?
	> Centralised : files that can sit at the root in a folder called test
	> Alongside : Placing them on the same file

. Where the unit test should run
	> Unit test should run everytime you click save
		. For rapid feedback
		. Facilitates TDD (Test Driven Development)
		. Automatic = Low friction

	> 	Unit Tests :
		. Test a small unit
		. Often signle function
		. fast
		. run upon save

		Integration Tests
		. Test multiple units
		. Often involves clicking and waiting
		. slow
		. often run on demand, or in QA


# > Demo : Testing and continuous Integration using Mocha
For more how to use mocha https://mochajs.org/

. Create a file in ./buildScripts called testSetup.js
// This file isn't transpiled, so must use CommonJS and ES5
// Register babel to transpile before our tests run.
require('babel-register')();
// Disable webpack features that Mocha doesn't understand
require.extensions['.css'] = function(){};

.Include the test in npm scripts ./package.json
"test": "mocha --reporter progress buildScripts/testSetup.js \"src/**/*.test.js\""

. Create a test file in ./src/ called index.test.js where we are going to use chai as an assertion library
import {expect} from 'chai';

describe('Our first test', ()=>{
  it('should pass', ()=>{
    expect(true).to.equal(true);
  });
});

and run in node and the test should pass
$ npm test

. run our test using JSDOM
import {expect} from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';
describe('index.html', ()=>{
  it('should say hello', (done)=>{
    const index = fs.readFileSync('./src/index.html', "utf-8");
    jsdom.env(index, function(err, window){
      const p = window.document.getElementsByTagName('p')[0];
      expect(p.innerHTML).to.equal("Hello World");
      done();
      window.close();
    });
  });
});

. Watching our tests automatically by adding these lines in your package.json file and update your npm start scripts to reference it
"test:watch": "npm run test -- --watch"

. Why setting a Contineous integration server (CI) Server?
	# When a team has commit a code, you get notified quickly that a change has been made that breaks the built
		> Forgot to commit new file
		> Forgot to update package.json
		> Commit which doesn't run cross-platform
		> Node version conflicts
		> Bad merge
		> Didn't run test
		> Catch mistakes quickly

	# the benefit of setting up a CI server
		> Run Automated build
		> Run your tests
		> Check code coverage
		> Automate deployment

	# Choosing a CI server
		> Travis CI - a linux based CI server, a hosted solutions
		> appveyor - a Windows CI
		> Jenkins - can be hosted on your own
		> Circleci
		> semaphore
		> SnapCI

	. for this build, we'll host Travis CI and Appveyor to make sure that our build can run on both Windows and Linux

# > Setting up Travis CI for more details here https://travis-ci.org/  | https://docs.travis-ci.com/user/tutorial/
	. first sign up to travis-ci using your github account and all github repo will be displayed
	. In getting_started click on add new repo. to add your existing repo from github
	. Click on turn on to the target repo. Check also the config settings icon as well
	. add travis-ci to your project configuration by creating a file .travis.yml and add those lines
		./.travis.yml
		language: node_js
		node_js:
		  - "12.6.0"

	. now make some changes to your files that can fail by your unit test and commit them to your github account
	. travis-ci will be able to pick up your changes committed and run a build process

[Error] Can't seem to use "npm ci" for a production install  -- during travis-CI build process
solution: run node install to update your package-lock.json file


# > Setting up Appveyor for Windows environment https://www.appveyor.com/
	. Sign up for free using your github account
	. add your project by using the option for public git repo
	. back to your project to add a appveyor config file
		./appveyor.yml
		# Test against this version of Node.js
		environment:
		  matrix:
		  # node.js
		  - nodejs_version: "12.6.0"

		# Install scripts. (run after repo cloning)
		install:
		  # Get the latest stable version of Node.js or io.js
		  - ps: Install-Product node $env:nodejs_version
		  # install modules
		  npm install

		# Post-install test scripts.
		test_script:
		  # Output usefull info for debugging.
		  - node --version
		  - npm --version
		  # run tests
		  - npm test

		# Don't actually build.
		build: off

	. then commit your changes to github and check the build process


# > Making HTTP Calls in JS
	. HTTP Call Approaches
		> Node
			. http: a low level library that provides basic fonctionality to make http request
			. request : a high level library
		>  Browser
			. XMLHttpRequest : this has been used since 1999
			. jquery - Ajax:
			. Framework-based like angularJs that includes their own http request obj
			. Fetch : proposed by W3C which all browser support it

		> Node & Browser
			. isomorphic-fetch
			. xhr: a package available on npm
			. SuperAgent : a package available on npm
			. Axios : a package available on npm

	. Why Centralise API Calls?
		> Congigure all calls
		> Handle preloader logic that get displays on the screen
		> Handle errors
		> Single seam for mocking

# > Demo - fetch
. Open your srcServer.js file and add another route to return user data
 ./srcServer.js
 app.get('/users', function(req, res){
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    {"id":1, "firstName":"Bob", "lastName":"Smith", "email":"bob@gmail.com"},
    {"id":2, "firstName":"Tammy", "lastName":"Norton", "email":"Norton@gmail.com"},
    {"id":3, "firstName":"Tina", "lastName":"Lee", "email":"Lee@gmail.com"}
  ]);
});

. Create a folder ./src called api and add userApi.js
only one function is being exported. All others functions are private


import 'whatwg-fetch';
/* import this polyfill package to make sure that fetch can run on all browsers that doesn't
 support fetch natively */

/* make this function public by including export */
export function getUsers(){
  return get('users');
}


/* all others functions defined below are private */
function get(url){
  return fetch(url).then(onSuccess, onError);
}

function onSuccess(response){
  return response.json();
}

function onError(error){
  console.log(error); //eslint-disable-line no-console
}


. Update your index file
  <h1>Users</h1>
  <table>
    <thead>
      <th>&nbsp;</th>
      <th>Id</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
    </thead>
    <tbody id="users"></tbody>
  </table>

. Update your index.js file
// Populate table of users via API call.
getUsers().then(result =>{
  let userBody = "";

  result.forEach(user =>{
    userBody += `<tr>
    <td><a href="#" data-id="${user.id}" class="deleteUser">Delete</a></td>
    <td>${user.id}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    </tr>`
  });
  global.document.getElementById('users').innerHTML = usersBody;
});

. Why send a polyfill to all browsers?
Polyfills allow web developers to use an API regardless of whether or not it is supported by a browser, and usually with minimal overhead.
Typically they first check if a browser supports an API, and use it if available, otherwise using their own implementation.

	> to send a polyfill only to browser that needs it, there is a handy service called polyfill.io (https://polyfill.io/v3/)
	add this to your <head> tag <script src="https://cdn.polyfill.io/v2/polyfill.js?features=fetch"></script> and it will determine if the browser requires
	a polyfill for the features listed.


. Why mock HTTP?
	> for unit testing to get instant reponse for slow or busy env
	> keep working when the services are down
	> rapid prototying
	> Avoid inter-team bottlenecks
	> Work offline

. How to mock HTTP?
	> for Unit test, Nock is an handy way to mock http request in your test
	> you create a static JSON file with encoded data needed for your HTTP request
	> create a webserver that mocks out real API with these libraries
		- api-mock
		- JSON server ( with this you create static JSON files that the webserver will server behind the scene)
		- JSON Schema faker ( for dynamic data that generate fake data for you)
		- Browsersync
		- Express

. Planning a mock API.
	> Declare our schema using JSON Schema faker (https://json-schema.org)
	> Generate random data using faker.js, chance.js, randexp.js all these 3 libraries comes bundled with JSON Schema faker
	> Serve data via API using JSON Server

	for more info on faker.js check this Docs github.com/Marak/faker.js/wiki | marak.github.io/faker.js/index.html


# > Demo - Creating a Mock API Data Schema
. We are going to use json-schema faker which comes with 3 bundles libraries
. We are going to use JSON Server

. Create  a file in your buildScripts folder calledd mockDataSchema.js and paste data from this url
https://bit.ly/ps-mock-data-schema

export const schema = {
  "type": "object", // top level our data structure should be an object
  "properties": { // our data as a set of properties
    "users": { // first properties
      "type": "array",
      "minItems": 3,
      "maxItems": 5,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "unique": true,  //each number should be unique as a primary key in a database
            "minimum": 1
          },
          "firstName": {
            "type": "string",
            "faker": "name.firstName"
          },
          "lastName": {
            "type": "string",
            "faker": "name.lastName"
          },
          "email": {
            "type": "string",
            "faker": "internet.email"
          }
        },
        "required": ["id", "firstName", "lastName", "email"]
      }
    }
  },
  "required": ["users"]
};


# > Demo : Generating Mock Data
. create another file to generate mock data called generateMockData.js in buildScripts foler
import jsf from 'json-schema-faker';
import {schema} from './mockDataSchema';
import fs from 'fs';
import chalk from 'chalk';

const json = JSON.stringify(jsf(schema));

fs.writeFile("./src/api/db.json", json, function(err){
  if (err){
    return console.log(chalk.red(err));
  } else {
    console.log(chalk.green("Mock data generated."));
  }
});

. update your npm script file ./package.json by adding these lines
"scripts":{
...
	"generate-mock-data": "babel-node buildScripts/generateMockData"
}

. on your node env run the script which should generate a db.json file in the specificied destination folder
$ npm run generate-mock-data


# > Demo : Serving Mock Data via JSON Server
. In your ./package.json file update your npm scripts. Make sure the port is opened via firewall and available
"scripts":{
...
	"start-mockapi": "json-server --watch src/api/db.json --port 2100"
}

. run npm script to run the JSON-server and from generated resources access them in your browser to view data
$ npm run start-mockapi

. to generate different data everytime we reload the page add this update to your npm scripts
"scripts":{
...
"start": "npm-run-all --parallel open:src lint:watch test:watch start-mockapi", //run this everytime we start our express server
...
 "generate-mock-data": "babel-node buildScripts/generateMockData",
"prestart-mockapi": "npm run generate-mock-data", // first generate new data before running json-server
"start-mockapi":"json-server --watch src/api/db.json --port 2100"

}


. in order to only run our mock-api only on dev environment and the actual data in production
create a file baseURL.js in api folder that will check your working environment

export default function getBaseURL(){
  const inDevelopment = window.location.hostname === '192.168.1.159';
  return inDevelopment ? 'http://192.168.1.159:2100/': '/';
}


. Update your UserApi.js file
import getBaseURL from './baseURL';

const baseUrl = getBaseURL();

/* make this function public by including export */
export function getUsers(){
  return get('users');
}


/* all others functions defined below are private */
function get(url){
  return fetch(baseUrl + url).then(onSuccess, onError);
}

. refresh your app via http://192.168.1.159:2000/


# > Demo : Manipulating Data via JSON Server
. Edit your userApi.js file by adding a delete function.

import {getUsers, deleteUser} from './api/userApi';
...
/* delete a user */
export function deleteUser(id){
  return del(`users/${id}`);
}

/* all others functions defined below are private */
function get(url){
  return fetch(baseUrl + url).then(onSuccess, onError);
}

function del(url){
  const request = new Request(baseUrl+ url, {
    method: 'DELETE'
  });
  return fetch(request).then(onSuccess, onError);
}


. And update your index.js file with delete action

// Populate table of users via API call.
getUsers().then(result =>{
  let usersBody = "";

  result.forEach(user =>{
    usersBody += `<tr>
    <td><a href="#" data-id="${user.id}" class="deleteUser">Delete</a></td>
    <td>${user.id}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    </tr>`
  });
  global.document.getElementById('users').innerHTML = usersBody;

  const deleteLinks = global.document.getElementsByClassName('deleteUser');
  // Must use array.from to create a real array from DOM collection
  // getElementsByClassName only returns an "array like" object
  Array.from(deleteLinks, link =>{
    link.onclick = function(event){
      const element = event.target;
      event.preventDefault();
      deleteUser(element.attributes["data-id"].value);
      const row = element.parentNode.parentNode;
      row.parentNode.removeChild(row);
    };
  });
});


# > Setting up Project Structure
. Always put your javascript in .js file
. Why include a Demo App?
	> Directory structure and file naming
	> Framework usage
	> Testing
	> Mock API
	> Automated deployment
	> proviiding some interactive working examples


. Consider organising by feature
	> organising by File Type
		./components
		./data
		./models
		./views

	> Organising by feature
		./authors
		./courses


# > Create an automated Production build
	> Mimification: to speed page load
		- A JavaScript mimifier helps
			. shortens variable and function names
			. removes comments
			. removes whitespace and new lines
			. Dead code elimination by a process called tree-shaking
			. debug via sourcemap
		- Demo how to mimify:
			. create a file called webpack.config.prod.js at the root of your project

import path from 'path';
import  webpack from 'webpack'; // for additional webpack feature added into plugins

export default {
  debug: true,
  devtool: 'source-map', // this recommended for production
  noInfo: false,
  entry: [
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output:{
    path: path.resolve(__dirname, 'dist'), // change your project to dist
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
  // Mimify JS
  new webpack.optimize.UglifyJsPlugin()
  // Eliminae duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin()
  ],
  module: {
    loaders:[
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
      {test: /\.css$/, loaders: ['style', 'css']}
    ]
  }
}
			 . into buildScripts, create a file called build.js

			 /* eslint-disable no-console */
import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod.js';
import  chalk from 'chalk';

process.env.NODE_ENV = 'production';
// run node in production. This is useful if you have .babelrc file

webpack(webpackConfig).run((err, stats) =>{
  if (err) { // so a fatal error occurred. Stop here.
    console.log(chalk.red(err));
    return 1;
  }

    /* this is part isn't really required. It's error logging for the stat */
  const jsonStats = stats.toJson();
  if (jsonStats.hasErrors){
    return jsonStats.errors.map(error => console.log(chalk.red(error)));
  }

  if (jsonStats.hasWarnings){
    console.log(chalk.yellow('Webpack generated the following warnings: '));
    jsonStats.warnings.map(warning => console.log(chalk.yellow(warning)));
  }
  console.log(chalk.green('Your app has been built for production and written to /dist'));
  return 0;
});
			 . config local /dist server just to make sure our distribution will run
				* create a file called distServer.js and copy the content of your srcServer.js into it
				* remove all references to webpack as we'll be serving static files

import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';

const port = '2000';
const app = express();

/* tell express to serve static files */
app.use(express.static('dist'));
/* enable Gzip compression in express*/
app.use(compression());

/* tell express which route to handle */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

...

			  . Update your baseURL api source that points to a MockAPI, to point to a production database which in our case
			  we are simply returning a static JSON data

export default function getBaseURL(){
  return getQueryStringParameterByName('useMockApi') ? '192.168.1.159' : '/';
}

function getQueryStringParameterByName(name, url){
  if (!url) url = window.location.href;
  name = name.replace(/[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
			. to test the swtich  of pointing to a mockApi or a production build, try this in the URL http://192.168.1.159:2000/?useMockApi=true


			   . add these npm scripts to your package.json file
"scripts": {
...
    "clean-dist": "rimraf ./dist && mkdir dist",  // clean the dist folder. more about this command https://www.npmjs.com/package/rimraf
    "prebuild": "npm-run-all clean-dist test lint",
    "build": "babel-node buildScripts/build.js",
    "postbuild": "babel-node buildScripts/distServer.js"

}
		$ npm run build


	> Sourcemaps: for debugging in production
		. From this your build process will generate a bundle.js and bundle.js.map

	> Dynamic HTML handling
		. why do you need to manipulate HTML for production
			- Reference bundles automatically
			- Handle dynamic bundle names
			- Inject production only resources
			- mimify html for production

		. how do you reference bundled assests in your html
			- hard code like shown below
		<html>
			<head>...</head>
			<body>
				<script src="bundle.js"></script>
			</body>
		</html>
			- Manipulate via Node that add it dynamically
			- Via webpack plugin called html-webpack-plugin

		. Demo: Dynamically generating your HTML via html-webpack-plugin
			- update your webpack.config.prod file to include the plugin
import HtmlWebpackPlugin from 'html-webpack-plugin';
...
 plugins: [
    // Mimify JS
    new webpack.optimize.UglifyJsPlugin(),
    // Eliminae duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin(),
    // Create HTML file that includes reference to bundled JS.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    })

		- remove the bundle.js reference in your html as this will be dynamically generated and also update your webpack.config.dev with the same plugin
			- run your npm run build to generate your html dynamically
			- to also dynamically mimified your html add this config into your html-webpack-plugin
				new HtmlWebpackPlugin({
				  template: 'src/index.html',
				  inject: true,
				  minify: {
					removeComments: true,
					collapseWhitespace: true,
					removeRedudantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyJS: true,
					minifyCSS: true,
					minifyURLs: true
				  }
				})

	> Bundle splitting so users don't have to download the entire application
		. Why bundle splitting?
			- When it comes to a large application, it's very usefull to split your javascript bundle.js into multiple files for faster page load
			- avoid re-downloading all libraries

		. Demo : Bundle splitting
			- There are different approach to this that we can set in our webpack config
				on an single page app uses 3 combinations of pages can be splitted.
			- in your webpack.config.prod file, update your entry points from an array to an object
export default {
debug: true,
devtool: 'source-map',
noInfo: false,
entry: {
vendor: path.resolve(__dirname, 'src/vendor'),
main: path.resolve(__dirname, 'src/index')
}, ...

			-  and create a vendor.js file in your src folder and include import package currently being used in your application
			in our case we are only using
			./src/vendor.js
			import 'whatwg-fetch';

			- add this webpack plugin to enable bundle splitting in webpack.config.prod under plugins []

	// Use CommonsChunkPlugin to create a separate bundle
    // of vendor libraries so that they're cached separately.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
			- change your output bundle.js name to ['name'].js so that webpack can generate dynamically reference entry names defined :{vendor, main}


	> Cache busting so users use the latest version of our code upon deployment
		. to save bandwith and avoid unnecesary http request, you can configure your production server so that your javascript files doesn't expire up to a year
		. save HTTP request to tell your http headers not to request assets up to a year
		. Force request for latest version
		. to accomplish this we need :
			- hash bundle filename, this way the bundle filename will only changes if bundle changes
			- generate the bundle file into html dynamically

		. Demo: Cache Busting
			- First add webpack-md5-hash tool that generate a deterministic filename in your webpack.config file and update the output.filename as below

			import WebpackMd5hash from 'webpack-md5-hash';
			...

			output:{
				path: path.resolve(__dirname, 'dist'),
				publicPath: '/',
				filename: '[name].[chunkhash].js' // tells [name]= referenced to entry name, [chunkhash]= a generate hash as part of the filename
			},
			plugins: [
				...
				 new WebpackMd5hash()
			]


			- rebuild your script
			$ npm run build

		. Demo: Extract and mimify CSS using extract-text-webpack-plugin

				import ExtractTextPlugin from 'extract-text-webpack-plugin';
				...
				plugins: [
				...
				new ExtractTextPlugin('[name].[contenthash].css')
				],
				module: {
					loaders:[
					  {test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
					  {test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap')}  // update your css module reference as well
					]
				}




	> Error logging to track bugs
		. There are a numbers of libraries provided such TrackJS, Sentry, New Relic, Raygun which all are paid services for free trial
		. Why use a JS Error logging?
			- Error Metadata
				* Browser
				* Stack trace
				* Previous actions
				* Custom API for enhanced tracking
			- Notifications & integrations
			- Analytics and filtering
			- Pricing

		. Demo : Error tracking via Track.js https://trackjs.com/
			- sign up for a demo acc
			- add your track.js CDN into your head
				<!-- BEGIN TRACKJS -->
				<script type="text/javascript">window_trackJS = {}</script>
				...



		. Demo : HTML templates via EmbeddedJS  https://github.com/h5p/embeddedjs
			- In order to only add the track.js CDN only on production, we are going to use embedded.js
			- add your tackjs token into your webpack.config plugins

			new HtmlWebpackPlugin({
		  template: 'src/index.html',
		  inject: true,
		  trackJSToken: 'token_no',
		  ...


		<head>
			<meta charset="UTF-8">
		  <% if (htmlWebpackPlugin.options.trackJSToken){ %>
			<!-- BEGIN TRACKJS -->
			<script type="text/javascript">window._trackJS = {token: '<%=htmlWebpackPlugin.options.trackJSToken%>'}</script>
			<script type="text/javascript" src="https://cdn.trackjs.com/releases/current/tracker.js"></script>
			<!-- END TRACKJS -->
		  <% } %>
		</head>

		Once this section is added to your html file the file is no longer an html file but .ejs file


# > Production Deployment
	> Separating the UI fron the API
	. Why separate the UI and API
		- Simple, low-risk, UI only deploys
		- Separates concerns
			* Separate teams
			* Less to understand
			* Scale back-end separately
		- Cheap UI hosting
		- Serve UI via a content delivery network
		- Use the API tech you like

	> Automated Deployment
	. Where should we host the app
		- Cloud hosting
			* Amazon Web services
			* Microsoft Azure
			* Heroku
			* Firebase
			* Google Cloud Platform
			* Githab pages - only serve static files
			* Surge - only serve static files

		- for this course, we only going to focus on using
			* for API hosting - Heroku
			* for static files - Surge

	> Demo: Automated API deploy via Heroku (https://devcenter.heroku.com)
	. First check getting started page on heroku on how to setup with Node.js
	https://devcenter.heroku.com/articles/getting-started-with-nodejs

		### setup instructions on Heroku ###
		. create a free account on heroku
		. install the Heroku CLI to manage and scale your applications, provision add-ons, view your application logs, and run your application locally.
			$ sudo snap install heroku --classic

			. Snap is the app store for Linux for more information check this link for setup https://snapcraft.io/docs/installing-snapd
			. On centos 'snap' isn't available, we are going to install it first
			. Installing snap on CentOS
				- The EPEL repository can be added to your system with the following command:
				$ sudo yum install epel-release
				$ sudo yum install snapd
				- Once installed, the systemd unit that manages the main snap communication socket needs to be enabled:
				$ sudo systemctl enable --now snapd.socket
				- To enable classic snap support, enter the following to create a symbolic link between /var/lib/snapd/snap and /snap:
				$ sudo ln -s /var/lib/snapd/snap /snap
				- Either log out and back in again, or restart your system, to ensure snap’s paths are updated correctly.

			. install now heroku CLI installation
				$ sudo snap install heroku --classic

			. Use the heroku login command to log in to the Heroku CLI
				$ heroku login

			. Follow the steps for a sample application deployment that’s ready to be deployed to Heroku.
				- fork the getting started repo https://github.com/heroku/node-js-getting-started.git
				- Update the package.json to include your repository and make sure you have this dependency ("cors": "2.8.1",)
				which will be used to enabled cross origin call, as the heroku based api will be called from a different domain
				-  index.js has been slighted modified
				- Procfile which declare the command that heroku should run and this is needed by heroku to host our node and express based api
					web: node index.js
				- now make your app ready for deployment by running the command below which will create a random domain for your app
				$ heroku create
				- now set your git remote to point an heroku assined named in this case 'polar-savannah-26307' which was automatically generated
				$ heroku git:remote - a polar-savannah-26307
				- now push your repo to heroku. Heroku will take our repo from git and deploy it
				$ git push heroku master

			. now you can check your deployment by visiting this https://polar-savannah-26307.herokuapp.com/users to see your json file API data

	. Update your get back to your baseURL.js the production value to point to heroku where the production API is hosted.
	export default function getBaseURL(){
	  return getQueryStringParameterByName('useMockApi') ? 'http://192.168.1.159:2100/' : 'https://polar-savannah-26307.herokuapp.com/';
	}

	. Also update your production build.js to reference your production URL by remove a local reference
	app.get('/users', function(req, res){...}


	> Demo: Automated UI Deploy via Surge (https://surge.sh/) for the front-end deployment
	. in order to deploy:
		- first you run your npm start in  dev env
		- then npm run build, to build your dev env ready for production
		- npm run deploy, to deploy the app

	. make sure surge install via npm. Check your package.json
	. Update the package.json to enable deployment to surge
	"scripts":{
		"deploy": "surge ./dist"
	}
	. check your local build process is actually pointing to heroku host for API call
	. and run the command below to deploy your static to surge. a random url will be generated for testing
	$ npm run deploy


# > Starter kit Update Automated approaches
	. Down the line, you may want to push updates frequently, this can be manually or can be automated.
	. there are 3 ways to automated updates
		- Yeoman (https://yeoman.io/)
			. a handy scaffolding tool to start new project
			. it hosts a lot of ready made project for more info https://yeoman.io/generators
		- github
			. host your project on github
			. fork starter kit for new project
			. pull the starter kit from master over time
		- npm
			. Encapsulate kit in npm package
			. Update npm package to recieve the latest

	. What can we centralise in our starter kit?
		item 							Approaches
		buildScripts					can be moved to npm package
		npm scripts in package.json	Call scripts in npm package
		webpack.config files 			npm package
		.eslintrc						create preset


	.More for starter kits project check these links
		- for reactJS starter kit project
		check out https://www.javascriptstuff.com/  | https://github.com/ahfarmer/minimal-react-starter

		- for angularJS starter kit project
		check out https://github.com/gianarb/awesome-angularjs