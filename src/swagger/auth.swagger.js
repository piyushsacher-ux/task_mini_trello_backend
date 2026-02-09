> taskmanagerapi@1.0.0 dev
> nodemon src/app.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/app.js`
[dotenv@17.2.3] injecting env (5) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
node:internal/modules/cjs/loader:1413
  throw err;
  ^

Error: Cannot find module '../controllers'
Require stack:
- /Users/piyushsacher/Desktop/TaskManagerAPI/src/routes/v1/project.routes.js
- /Users/piyushsacher/Desktop/TaskManagerAPI/src/routes/v1/index.js
- /Users/piyushsacher/Desktop/TaskManagerAPI/src/routes/index.js
- /Users/piyushsacher/Desktop/TaskManagerAPI/src/app.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1410:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1051:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1056:22)
    at Module._load (node:internal/modules/cjs/loader:1219:37)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:238:24)
    at Module.require (node:internal/modules/cjs/loader:1493:12)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/Users/piyushsacher/Desktop/TaskManagerAPI/src/routes/v1/project.routes.js:4:31)
    at Module._compile (node:internal/modules/cjs/loader:1738:14) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/piyushsacher/Desktop/TaskManagerAPI/src/routes/v1/project.routes.js',
    '/Users/piyushsacher/Desktop/TaskManagerAPI/src/routes/v1/index.js',
    '/Users/piyushsacher/Desktop/TaskManagerAPI/src/routes/index.js',
    '/Users/piyushsacher/Desktop/TaskManagerAPI/src/app.js'
  ]
}

Node.js v24.7.0
[nodemon] app crashed - waiting for file changes before starting...
