iFactuur - uurtjefactuurtje (public name) - uurtjefactuurtje.marcbakker.com (public url)
## Notes
For authentication React Context API and HOCs (Higher Order Components) are used.
- FirebaseContextProvider.Provider wraps App component (src/Firebase/context.js:FirebaseContext wraps <App> in /index.js);
- AuthUserContext.Provider HOC wraps App component (src/components/Session/withAuthentication.js wraps class App in src/components/App/index.js). This component sets a listener on firebase.auth.onAuthStateChanged and uses this as the value for the Provider.
- authorizationContextConsumer.js also sets a listener on onAuthStateChanged. AuthUserContext.Consumer only renders fed component if authUser exists. Side effect: whenever authentication state of user changes the callback redirects to SignIn component if user is not signed in (src/components/Session/authorizationContextConsumer wraps class NavigationForm in src/components/Navigation/index.js). NavigationForm class gets access to router props via authorizationContextConsumer;

TL;DR

authorizationContext.Consumer controls access to App.
if user is _not_ signed in, authorizationContext.Consumer redirects to SignIn component and does _not_ display the signInForm it has been fed. If the user _is_ signed in no redirection happens and the fed signInForm component is displayed.

withAuthentication = Provider pf authUser - authorizationContextConsumer is consumer of authUser and redirects to SignIn



## IMPORTANT deploy notice
use node version 10.4.0 to install this app.

Perform these steps in a terminal window:
- nvm ls: *first check if 10.4.0 is among the available node versions*
- nvm install 10.4.0: *do this if you need to install node v10.4.0*
- nvm use 10.4.0: *tell NVM to use version 10.4.0*
- start the application by running `npm install` or `yarn`
- once installed, run `npm start` or `yarn start`

# Netlify hosted

[![Netlify Status](https://api.netlify.com/api/v1/badges/eb893292-e753-441b-bfb2-ca354ffaf503/deploy-status)](https://app.netlify.com/sites/uurtjefactuurtje/deploys)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
