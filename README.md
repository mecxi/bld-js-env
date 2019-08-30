# bld-js-env
A steps by steps how to build a JavaScript Environment with nodeJS


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
	
# > Setting up Travis CI for more details here https://travis-ci.org/
	. first sign up to travis-ci using your github account
	. all github repo will be shown up 
	
