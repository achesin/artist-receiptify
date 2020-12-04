# Receiptify
Web application inspired by https://www.instagram.com/albumreceipts/ and  https://receiptify.herokuapp.com/. Generates receipts that list out top 10 tracks from an artist!

I do not take credit for this idea, I just wanted to mess around with the Spotify APIs and see what I could create!

## Notes/ TODO
There is currently a bug for when there are artists of the same name that can be selected. If you select the second or third one of the same name, it will return the data for the first.

## Running the App Locally

This app runs on Node.js. On [its website](http://www.nodejs.org/download/) you can find instructions on how to install it. You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm.

Once installed, clone the repository and install its dependencies running:

    $ npm install

### Using your own credentials
You will need to register your app and get your own credentials from the Spotify for Developers Dashboard.

To do so, go to [your Spotify for Developers Dashboard](https://beta.developer.spotify.com/dashboard) and create your application. In my own development process, I registered this Redirect URI:

* http://localhost:3000/callback

Once you have created your app, load the `client_id`, `redirect_uri` and `client_secret` into a `.env` file. You can see an example under `.env.dist`

In order to run the app, open the folder, and run its `app.js` file:

    $ node app.js

Then, open `http://localhost:3000` in a browser.
