# Frontend

If you don't want to change anything in the frontend, Django will serve the last build. You only need to follow the steps in this file if you are working on the front end code.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

After building the production bundle you can stop the development server. Django will start serving the new version.

## Deploy

Don't forget to run `./manage.py collectstatic`.
