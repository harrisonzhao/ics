~~~ INFINITE CLOUD STORAGE ~~~
=========

Prerequisites
---------------
- [Node.js](http://nodejs.org)

Getting Started
---------------

#point the browser to localhost:3000 to visit the site
```

Project Structure
-----------------

| Name                               | Description                                                 |
| ---------------------------------- |:-----------------------------------------------------------:|
| **config**/auth/passport.js        | Passport local and OAuth strategies                         |
| **config**/settings/auth.js        | Your API keys                                               |
| **config**/settings/secrets.js     | Database url and other settings                             |
| **config**/settings/exports.js     | Exports all files inside settings folder                    |
| **config**/config.js               | Has application configurations and middleware               |
| **controllers**/auth.js            | Controller for authentication                               |
| **controllers**/error.js           | Controller for handling errors                              |
| **controllers**/pages.js           | Controller for serving pages                                |
| **models**/User.js                 | Mongoose schema and model for User                          |
| **lib**/                           | User-created libraries to be included in controllers        |
| **public**/                        | Static assets such as fonts, css, js,img                    |
| **test**/                          | Mocha and Chai tests                                        |
| **views**/                         | Templates for *login, signup, profile*                      |
| app.js                             | Main application file where all routes are loaded           |


TODO: delete or set up mail