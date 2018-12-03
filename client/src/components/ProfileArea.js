import React from "react";

export default class ProfileArea extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <button onClick={this.signIn}>Sign In</button>;
	}

	signIn() {}

	signOut() {
		console.log("signOut");
	}
}
