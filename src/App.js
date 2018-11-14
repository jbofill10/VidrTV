import React from 'react';
import { database } from './firebase';
import { RoomList, ProfileArea } from './Components';
import './App.css';

class App extends React.Component {

	constructor() {
		super();

		this.state = {
			user: {},
			rooms: []
		};

		// get rooms
		database.collection("rooms").get().then((snapshot) => {

			this.setState({
				rooms: snapshot.docs.map(e => ({id: e.id, data: e.data()}))
			});
		});

	}

	render() {
		return (
			<div className="App">
				<header className="app-header">
					<ProfileArea />
				</header>
				<RoomList rooms={this.state.rooms} joinRoom={this.joinRoom} />
			</div>
		);
	}

	joinRoom(id) {
		console.log("join room id " + id);
	}

}

export default App;
