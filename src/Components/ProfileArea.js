import React from 'react';
import { firebase, provider } from '../firebase';

export default class ProfileArea extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<button onClick={this.signIn}>
				sign in
			</button>
		);
	}

	signIn() {
		firebase.auth().signInWithPopup(provider)
			.then(() => {
				// TODO update state
			})
			.catch((error) => {
				console.error(error);
			});
	}

	signOut() {
		console.log('signOut');
	}
}