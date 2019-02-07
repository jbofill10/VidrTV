import React from "react";
import { Route, NavLink, BrowserRouter, Switch } from "react-router-dom";
import { ProfileArea } from "./components";
import { DefaultView, RoomView, EmbedView } from "./views";
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
				<Switch>
					<Route path="/embed/*" component={EmbedView} />
					<Route
						render={() => (
							<div className="App">
								<header
									className="app-header"
									style={{
										backgroundColor: "#2c2834",
										display: "flex",
										padding: "8px 16px",
										color: "white",
										height: 40
									}}
								>
									<NavLink
										to="/"
										style={{
											display: "inline-block",
											background: "rgba(56, 51, 66, 0.5)",
											color: "rgb(242,242,242)",
											verticalAlign: "middle",
											textAlign: "center",
											height: 40,
											padding: "0 16px 0 16px",
											lineHeight: "42px",
											fontSize: 14,
											textTransform: "uppercase",
											userSelect: "none",
											borderRadius: 4
										}}
									>
										Home
									</NavLink>
									<div style={{ flex: 1 }} />
									<ProfileArea />
								</header>
								<div
									className="content"
									style={{
										position: "absolute",
										left: "50%",
										margin: "20px 0",
										transform: "translateX(-50%)"
									}}
								>
									<Route
										exact
										path="/"
										component={DefaultView}
									/>
									<Route path="/r/*" component={RoomView} />
									<Route
										path="/embed/*"
										component={EmbedView}
									/>
								</div>
							</div>
						)}
					/>
				</Switch>
			</BrowserRouter>
		);
	}
}
