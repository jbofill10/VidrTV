import React from 'react';
import ReactPlayer from 'react-player';
import { ProfileArea, PlaylistView } from './components';
import './App.css';

import openSocket from 'socket.io-client';

class App extends React.Component {

	constructor() {
		super();

		this.state = {
			user: {},
			room: {},
			loading: true
		};

	}

	componentDidMount() {

		const socket = openSocket(process.env.NODE_ENV === "development" ? window.location.hostname + ":8000" : null);

		socket.on('statesync', (data) => {
			console.log("statesync", data);

			this.setState({ room: data, loading: false });
		});

	}

	render() {

		if (this.state.loading)
			return (
				<div className="App">
					<header className="app-header">
						<ProfileArea />
					</header>

					<div className="content">
						Loading...
					</div>
				</div>
			);

		return (
			<div className="App">
				<header className="app-header">
					<ProfileArea />
				</header>

				<div className="content">
					<div className="player-wrapper">
						<ReactPlayer
							className="react-player"
							url={'https://www.youtube.com/watch?v=' + this.state.room.queue[this.state.room.cur]}
						/>
						<div className="player-controls">
							hello
						</div>
					</div>
					<PlaylistView items={this.state.room.queue}/>
				</div>
			</div>
		);
	}

	onSeek() {
		console.log("onSeek");
	}

}

export default App;
