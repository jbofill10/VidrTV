import React from "react";
import { Route, NavLink, BrowserRouter } from "react-router-dom";
import { ProfileArea } from "./components";
import { DefaultView, RoomView } from "./views";
import "./App.css";

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			// user: {}
		};

		// load gapi auth2
		window.gapi.load("auth2", () => {
			if (!window.gapi.auth2.getAuthInstance()) {
				// init auth2 with params
				window.gapi.auth2
					.init({
						client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
						ux_mode: "popup"
					})
					.then(
						res => {
							// console.log('auth2 init', res);
						},
						err => {
							console.error("auth2 init error", err);
						}
					);
			}
		});
	}

	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<header className="app-header">
						<NavLink to="/">Home</NavLink>
						<div style={{ flex: 1 }} />
						<ProfileArea />
					</header>
					<div className="content">
						<Route exact path="/" component={DefaultView} />
						<Route path="/r/*" component={RoomView} />
					</div>
				</div>
			</BrowserRouter>
		);
	}
}
