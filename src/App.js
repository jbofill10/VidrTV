import React from 'react';
import { default as YoutubePlayer } from 'react-youtube';
import { RoomList, ProfileArea, PlaylistView } from './components';
import './App.css';

class App extends React.Component {

	constructor() {
		super();

		this.state = {
			user: {},
			rooms: [],
		};

		window.room = {
			queue: [
				"TjAa0wOe5k4", // Twitch A/V sync
				"Sz_YPczxzZc", // official youtube music
				"mM5_T-F1Yn4", // 4:3 video test
				"En6TUJJWwww", // vertical video test
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
				autoplay: 1,
				controls: 1
			}
		};

		return (
			<div className="App">
				<header className="app-header">
					<ProfileArea />
				</header>
				<RoomList hidden rooms={this.state.rooms} joinRoom={this.joinRoom} />

				<div className="content">
					<YoutubePlayer
						className="player-container"
						videoId={window.room.queue[window.room.cur]}
						opts={opts}
						onReady={this._onReady}
						onEnd={this._onEnd}
						onStateChange={this._playerStateChange}
					/>
					<PlaylistView items={window.room.queue}/>
				</div>
			</div>
		);
	}

	_playerStateChange(event) {
		console.log("state change", event);
	}

	_onReady(event) {
		console.log("Video ready", event);
		event.target.mute();
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
