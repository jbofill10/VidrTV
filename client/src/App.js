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
import "simplebar/dist/simplebar.min.css";
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
									id="bg1"
									style={{
										background:
											theme.palette.background.grad1,
										backgroundBlendMode: "multiply",
										transition: "opacity 0.4s",
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
								<div
									className="bg"
									id="bg2"
									style={{
										background:
											theme.palette.background.grad2,
										backgroundBlendMode: "multiply",
										transition: "opacity 0.4s",
										opacity:
											props.location.pathname !== "/" &&
											props.location.pathname.lastIndexOf(
												"/r/",
												0
											) !== 0
												? 0.35
												: 0,
										position: "absolute",
										left: 0,
										right: 0,
										top: 0,
										bottom: 0,
										zIndex: 0
									}}
								/>
								<div
									className="bg"
									id="bg3"
									style={{
										background:
											theme.palette.background.grad3,
										backgroundBlendMode: "multiply",
										transition: "opacity 0.4s",
										opacity:
											props.location.pathname.lastIndexOf(
												"/r/",
												0
											) === 0
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
											background: "transparent",
											display: "flex",
											color: "white",
											flexShrink: 0,
											zIndex: 1,
											justifyContent: "center"
										}}
									>
										<div
											style={{
												display: "flex",
												padding: "8px 0",
												flex: 1,
												maxWidth: 1920
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
													padding: "0 12px 0 28px",
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
