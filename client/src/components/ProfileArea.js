import React from "react";
import Radium from "radium";
import { Button } from "react-player-controls";
import "whatwg-fetch";

@Radium
class ProfileArea extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			profile: {},
			loggedin: false
		};
	}

	render() {
		const { profile, active, loggedin } = this.state;

		if (loggedin) {
			return (
				<img
					src={profile.getImageUrl()}
					alt={profile.getName()}
					style={{
						backgroundColor: "#383342",
						display: "inline-flex",
						alignItems: "center",
						padding: 0,
						borderRadius: "50%",
						height: 40
					}}
				/>
			);
		} else
			return (
				<Button
					onClick={() => this.signIn()}
					style={{
						backgroundColor: "#383342",
						display: "inline-flex",
						alignItems: "center",
						color: "#fff",
						boxShadow:
							"0 2px 2px 0 rgba(0, 0, 0, .24), 0 0 1px 0 rgba(0, 0, 0, .24)",
						padding: 0,
						borderRadius: 2,
						border: "1px solid transparent",
						fontSize: 14,
						fontWeight: "500",
						fontFamily: "Roboto, sans-serif"
					}}
				>
					<div
						style={{
							marginRight: 10,
							background: active ? "#eee" : "#fff",
							padding: 10,
							paddingBottom: 6,
							borderRadius: 2
						}}
					>
						<svg
							width="18"
							height="18"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g fill="#000" fillRule="evenodd">
								<path
									d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"
									fill="#EA4335"
								/>
								<path
									d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
									fill="#4285F4"
								/>
								<path
									d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z"
									fill="#FBBC05"
								/>
								<path
									d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"
									fill="#34A853"
								/>
								<path fill="none" d="M0 0h18v18H0z" />
							</g>
						</svg>
					</div>
					<span
						style={{
							paddingRight: 10,
							fontWeight: 500,
							paddingLeft: 0,
							paddingTop: 10,
							paddingBottom: 10
						}}
					>
						Sign in with Google
					</span>
				</Button>
			);
	}

	signIn() {
		let auth2 = window.gapi.auth2.getAuthInstance();

		auth2.signIn().then(
			res => this.responseGoogle(res),
			err => {
				console.error(err);
			}
		);
	}

	responseGoogle(response) {
		let profile = response.getBasicProfile();
		let authres = response.getAuthResponse();

		fetch("http://localhost:3000/auth/google/tokensignin", {
			method: "POST",
			headers: {
				//"Content-Type": "application/x-www-form-urlencoded"
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				idtoken: authres.id_token
			})
		})
			.then(res => res.json())
			.then(json => {
				// console.log('/auth/google/tokensignin response', json);
				this.setState({ profile: profile, loggedin: true });
			})
			.catch(ex => {
				console.error("parsing failed", ex);
			});

		console.log(authres);
		console.log(profile);
	}
}

export default ProfileArea;
