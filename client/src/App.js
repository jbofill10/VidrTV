import React from "react";
import { Route, NavLink, BrowserRouter } from "react-router-dom";
import { ProfileArea } from "./components";
import { DefaultView, RoomView } from "./views";
import "./App.css";

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			user: {}
		};
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
