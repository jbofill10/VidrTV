import React from "react";
import { MediaPlayer } from "../components";
import openSocket from "socket.io-client";
import "whatwg-fetch";

export default class RoomView extends React.Component {
	constructor(props) {
		super();
		this.roomid = props.match.params.id;
		this.state = {
			room: {},
			joining: true,
			value: ""
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		// open realtime socket connection
		this.socket = openSocket(
			process.env.NODE_ENV === "development"
				? window.location.hostname + ":8080"
				: null
		);
	}

	componentDidMount() {
		// join room by id
		this.socket.emit("join", { roomid: this.roomid });

		// first fullsync = joined room
		this.socket.on("fullsync", data => {
			console.log("fullsync", data);

			this.setState({ room: data, joining: false });
		});
	}

	componentWillUnmount() {
		// disconnect from socket when roomview unmounts
		this.socket.disconnect();
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();
		fetch("/api/room/" + this.roomid, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				submission: this.state.value
			})
		}).then(res => {
			res.json();
		});
	}

	render() {
		if (this.state.joining) return <div>Joining Room...</div>;
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>
						Enter Song:
						<input
							type="text"
							value={this.state.value}
							onChange={this.handleChange}
						/>
					</label>
					<input type="submit" value="Submit" />
				</form>
				<MediaPlayer
					className="player-container"
					width={640}
					height={360}
					socket={this.socket}
					room={this.state.room}
				/>
			</div>
		);
	}
}
