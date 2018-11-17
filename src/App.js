import React from 'react';
import Youtube from 'react-youtube';
// import { database } from './firebase';
import { RoomList, ProfileArea, PlaylistView } from './Components';
import './App.css';

class App extends React.Component {

	constructor() {
		super();

		this.state = {
			user: {},
			rooms: [],
		};

		// get rooms
		// database.collection("rooms").get().then((snapshot) => {

		// 	// update room list
		// 	this.setState({
		// 		rooms: snapshot.docs.map(e => ({id: e.id, data: e.data()}))
		// 	});
		// });

		window.room = {
			queue: [
				"KFJgGQdKzXo",
				"dcQEWGjDS2o",
				"VSAALRWehGA",
				"wHfrvbz_HuI",
				"aRf36vRAWF8"
			],
			cur: 0,
			time: 0
		};

	}

	render() {
		const opts = {
			height: '360px',
			width: '640px',
			playerVars: { // https://developers.google.com/youtube/player_parameters
				autoplay: 1
			}
		};

		return (
			<div className="App">
				<header className="app-header">
					<ProfileArea />
				</header>
				<RoomList hidden rooms={this.state.rooms} joinRoom={this.joinRoom} />

				<div className="content">
					<Youtube
						className="player-container"
						videoId={window.room.queue[window.room.cur]}
						opts={opts}
						onReady={this._onReady}
						onEnd={this._onEnd}
					/>
					<PlaylistView items={window.room.queue}/>
				</div>
			</div>
		);
	}

	_onReady(event) {
		console.log("Video ready", event);
	}

	_onEnd(event) {
		console.log("Video end ", event);

		window.room.cur = (window.room.cur + 1) % window.room.queue.length;

		event.target.cueVideoById(window.room.queue[window.room.cur]);
		event.target.playVideo();
	}

	joinRoom(id) {
		console.log("join room id " + id);
	}

}

export default App;
