User Authentication with Node.js and Mongodb
=========

Prerequisites
---------------
- [MongoDB](http://www.mongodb.org/downloads)
- [Node.js](http://nodejs.org)

Getting Started
---------------

To get started, clone the repository:

```bash
git clone https://github.com/thehackerati/node-starter-app myproject

cd myproject

npm install

sudo mongod

node app.js

#point the browser to localhost:3000 to visit the site
```

Obtaining API keys
---------------

The default keys that accompany this project are dummies. 
To use any of the included OAuth authentication methods, you will need
to obtain appropriate credentials from each provider. 

<img src="http://images.google.com/intl/en_ALL/images/srpr/logo6w.png" width="100">
- Visit [Google Cloud Console](https://cloud.google.com/console/project)
- Click **CREATE PROJECT** button
- Enter *Project Name*, then click **CREATE**
- Then select *APIs & auth* from the sidebar and click on *Credentials* tab
- Click **CREATE NEW CLIENT ID** button
 - **Application Type**: Web Application
 - **Authorized Javascript origins**: http://localhost:3000
 - **Authorized redirect URI**: http://localhost:3000/auth/google/callback
- Copy and paste *Client ID* and *Client secret* keys into `config/settings/auth.js`

<img src="http://www.doit.ba/img/facebook.jpg" width="100">
- Visit [Facebook Developers](https://developers.facebook.com/)
- Click **Apps > Create a New App** in the navigation bar
- Enter *Display Name*, then choose a category, then click **Create app**
- Copy and paste *App ID* and *App Secret* keys into `config/settings/auth.js`
 - *App ID* is **clientID**, *App Secret* is **clientSecret**
- Click on *Settings* on the sidebar, then click **+ Add Platform**
- Select **Website**
- Enter `http://localhost:3000` for *Site URL*

<img src="https://g.twimg.com/Twitter_logo_blue.png" width="50">
- Sign in at [https://dev.twitter.com](https://dev.twitter.com/)
- From the profile picture dropdown menu select **My Applications**
- Click **Create a new application**
- Enter your application name, website and description
- For **Callback URL**: http://127.0.0.1:3000/auth/twitter/callback
- Go to **Settings** tab
- Under *Application Type* select **Read and Write** access
- Check the box **Allow this application to be used to Sign in with Twitter**
- Click **Update this Twitter's applications settings**
- Copy and paste *Consumer Key* and *Consumer Secret* keys into `config/settings/auth.js`

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