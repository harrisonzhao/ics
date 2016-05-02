~~~ INFINITE CLOUD STORAGE ~~~
=========

Project completed for the Cooper Union's ECE 464 Databases course. Probably does not work anymore. Server is down. Read about in the [paper](./writeup).  

Prerequisites
---------------
- [Node.js](http://nodejs.org)
- [Bower](http://bower.io/)
- [Sass](http://sass-lang.com/)

Getting Started
---------------
edit config/settings/secrets.js

run these commands before starting server (only need to do once):

npm install

bower install

sass public/css/main.scss > public/css/main.css

to run server:

node app.js
#point the browser to localhost:3000 to visit the site
```

Project Structure
-----------------

File structure:

    app.js              --> app config and main point of entry
    config/             --> various configurations
    controllers/        --> controllers for api and updating data
    data/               --> automatic generated folder by flickr api
    lib/                --> user defined libraries
    models/             --> data model containing CRUD for database
    node_modules/       --> modules for node npm installed
    package.json        --> for npm
    .bowerrc            --> bower stuff
    Gruntfile.js        --> for running mocha tests
    public/             --> all of the files to be used in on the client side
      css/              --> css and sass files
        main.scss       --> default sass stylesheet
      img/              --> image files
      js/               --> javascript files
        app.js          --> declare top-level app module
        controllers/    --> application controllers
        services/       --> custom angular services
        vendor/         --> 3rd party JavaScript libraries
    routes/
      api.js            --> register all endpoints
      index.js          --> serving static files
    views/
      index.html        --> main page for app
      partials/         --> angular view partials
        partial1.html
        partial2.html
