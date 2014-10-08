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

File structure:

    app.js              --> app config and main point of entry
    config/             --> various configurations
    controllers/        --> controllers for api and updating data
    data/               --> automatic generated folder by flickr api
    lib/                --> user defined libraries
    models/             --> data model containing CRUD for database
    node_modules/       --> modules for node npm installed
    package.json        --> for npm
    public/             --> all of the files to be used in on the client side
      css/              --> css files
        app.css         --> default stylesheet
      img/              --> image files
      js/               --> javascript files
        app.js          --> declare top-level app module
        controllers.js  --> application controllers
        directives.js   --> custom angular directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
        lib/            --> angular and 3rd party JavaScript libraries
          angular/
            angular.js            --> the latest angular js
            angular.min.js        --> the latest minified angular js
            angular-*.js          --> angular add-on modules
            version.txt           --> version number
    routes/
      api.js            --> route for serving JSON
      index.js          --> route for serving HTML pages and partials
    views/
      index.hbs         --> main page for app
      layout.hbs        --> doctype, title, head boilerplate
      partials/         --> angular view partials (partial hbs templates)
        partial1.hbs
        partial2.hbs

CRUD = Create Read Update Delete

http://bgrins.github.io/filereader.js/

For writing file to downloads:

    window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
        fs.root.getFile('test.bin', {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                var arr = new Uint8Array(3);
    
                arr[0] = 97;
                arr[1] = 98;
                arr[2] = 99;
    
                var blob = new Blob([arr]);
    
                fileWriter.addEventListener("writeend", function() {
                    // navigate to file, will download
                    location.href = fileEntry.toURL();
                }, false);
    
                fileWriter.write(blob);
            }, function() {});
        }, function() {});
    }, function() {});


access-control-allow-origin: 
cross site http

to get photos:
https://www.flickr.com/services/api/flickr.photos.getSizes.html
