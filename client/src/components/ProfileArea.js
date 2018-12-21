import React from "react";
import GoogleLogin from "react-google-login";

export default class ProfileArea extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<GoogleLogin
				clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
				buttonText="Sign In"
				onSuccess={this.responseGoogle}
				onFailure={this.responseGoogle}
			/>
		);
	}

	responseGoogle(response) {
		// TODO handle sign-in response
	}
}
