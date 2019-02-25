import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { IconContext } from "react-icons";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { default as theme } from "./theme";
import rootReducer from "./reducers";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
	uri: "http://localhost:3000/graphql"
});

const store = createStore(rootReducer);

render(
	<Provider store={store}>
		<IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
			<MuiThemeProvider theme={theme}>
				<App />
			</MuiThemeProvider>
		</IconContext.Provider>
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

export { client };
