import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, NavLink, BrowserRouter, Switch } from "react-router-dom";
import { ProfileArea } from "./components";
import {
	DefaultView,
	RoomView,
	EmbedView,
	CreateRoomView,
	JoinRoomView
} from "./views";
import "./App.css";

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			// user: {}
		};

		// load gapi auth2
		if (window.gapi) {
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
	}

	render() {
		const { theme } = this.props;

		return (
			<BrowserRouter>
				<Switch>
					<Route path="/embed/*" component={EmbedView} />
					<Route
						render={({ ...props }) => (
							<div
								className="App"
								style={{
									display: "flex",
									background:
										theme.palette.background.default,
									width: "100%",
									height: "100%",
									overflow: "hidden",
									flexDirection: "column",
									alignContent: "flex-start"
								}}
							>
								<div
									className="bg"
									style={{
										background:
											"radial-gradient(circle at 50% 120%, #6200ea, #311b92)",
										transition: "opacity 0.33s",
										opacity:
											props.location.pathname === "/"
												? 1
												: 0,
										position: "absolute",
										left: 0,
										right: 0,
										top: 0,
										bottom: 0,
										zIndex: 0
									}}
								/>
								{props.location.pathname !== "/" && (
									<header
										className="app-header"
										style={{
											backgroundColor: "#2c2834",
											display: "flex",
											padding: "8px 16px",
											color: "white",
											height: 40,
											flexShrink: 0,
											zIndex: 1
										}}
									>
										<NavLink
											to="/"
											style={{
												flex: 0,
												display: "inline-block",
												// background: "rgba(56, 51, 66, 0.5)",
												color: "rgb(242,242,242)",
												verticalAlign: "middle",
												textAlign: "center",
												height: 40,
												marginLeft: -8,
												padding: "0 12px 0 12px",
												lineHeight: "38px",
												fontSize: 24,
												fontFamily: `"Dosis", sans-serif`,
												// textTransform: "uppercase",
												userSelect: "none",
												borderRadius: 4
											}}
										>
											Vidr.tv
										</NavLink>
										<div
											style={{
												flex: 1,
												display: "flex",
												justifyContent: "flex-end"
											}}
										>
											<ProfileArea />
										</div>
									</header>
								)}
								<div
									className="content"
									style={{
										display: "flex",
										flex: 1,
										zIndex: 1
									}}
								>
									<Route
										exact
										path="/"
										component={DefaultView}
									/>
									<Route path="/r/:id" component={RoomView} />
									<Route
										path="/join"
										component={JoinRoomView}
									/>
									<Route
										path="/create"
										component={CreateRoomView}
									/>
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

export default withStyles({}, { withTheme: true })(App);
