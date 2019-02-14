## Setup

> You’ll need to have Node 8.10.0 or later on your local development machine

> [Visual Studio Code](https://code.visualstudio.com/) is not required, but highly recommended.

After cloning the repo, run the following in the project's root directory:
```sh
npm run setup
```
The script should have made a .env file.  You need to get the keys from someone and put them in there.

You need to build the client at least once with:
```sh
npm run build-client
```
---
## Starting the App

Now that everything is in place, you can start working on the app.

There are two scripts for you to burn into your memory (and your keyboard):
```sh
npm run client-dev
```
```sh
npm run server-dev
```

Go ahead and start them up.
**(at the same time)**

> *Tip: If you are using VSCode, you can split the built-in terminal in half and run them side-by-side.*

### The client and server are now running in Development Mode.

When you edit something in one of the `src/` folders, it will **auto reload** the client or server.  So all you have to do is *ctrl+s* to run your code.

You will want to keep them both on screen while you're working since they both lint your code for errors.  For the server, if the linter finds an error, it will not reload until you fix it.

Use *ctrl+c* to close each script when you're done.

---
## Folder Structure

The project is divided into two sub-projects:

`client/` - The front-end of the project. (handled by [create-react-app](https://facebook.github.io/create-react-app/) and its [folder structure](https://facebook.github.io/create-react-app/docs/folder-structure))

`server/` - The back-end of the project.

They both share the same basic structure:

`src/` - **source code (the code you edit)**

`build/` - where the source code "compiles" to (don't touch)

everything else is just config files and build scripts.


### Notes

 - When adding a new npm package, make sure you install it in the right sub directory (`client/` or `server/`) and not the project's root.  Packages installed in the project root are only for project management scripts.
