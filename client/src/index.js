import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import reducers from "./reducers";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const store = createStore(
	reducers,
	// redux dev tools
	process.env.NODE_ENV === "development" &&
		typeof window !== "undefined" &&
		window.__REDUX_DEVTOOLS_EXTENSION__ &&
		window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(
	<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<App />
		</MuiThemeProvider>
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
