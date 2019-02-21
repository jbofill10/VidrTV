import React from "react";
import { MediaPlayer, PlaylistView } from "../components";
import openSocket from "socket.io-client";
import { youtube } from "../youtube";

export default class RoomView extends React.Component {
	constructor(props) {
		super();
		this.roomid = props.match.params.id;
		this.state = {
			room: {},
			mediacache: {},
			joining: true
		};

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

			let mediacache = {};

			for (let i = 0; i < this.state.room.media.length; i++) {
				if (!this._isMounted) break;
				youtube
					.getVideoByID(this.state.room.media[i])
					.then(result => {
						if (this._isMounted) {
							mediacache[this.state.room.media[i]] = result;

							this.setState({ mediacache: mediacache });
						}
					})
					.catch(console.error);
			}
		});

		this._isMounted = true;
	}

	componentWillUnmount() {
		// disconnect from socket when roomview unmounts
		this.socket.disconnect();

		this._isMounted = false;
	}

	render() {
		if (this.state.joining) return <div>Joining Room...</div>;

		return (
			<div
				style={{
					display: "flex",
					overflow: "hidden",
					height: "100%",
					width: "100%",
					maxWidth: "1920px",
					margin: "0 auto"
				}}
			>
				<main
					style={{
						overflow: "hidden",
						flex: 1,
						display: "flex",
						flexDirection: "column"
					}}
				>
					<div
						style={{
							position: "relative",
							height: "100%",
							width: "100%",
							flex: "0 1"
						}}
					>
						<MediaPlayer
							className="player-container"
							// player height + heightdiff = player height breakpoint
							heightdiff={110}
							socket={this.socket}
							room={this.state.room}
							mediacache={this.state.mediacache}
						/>
					</div>
					<div
						style={{
							background: "rgb(44, 40, 52)",
							height: 26,
							padding: "14px 12px 12px 24px",
							fontSize: 18
							// flex: 2
						}}
					>
						<div>
							<span
								style={{
									color: "#FFF"
								}}
							>
								{this.state.room.name}
							</span>
							<span
								style={{
									paddingLeft: 16,
									color: "#aaa"
								}}
							>
								{this.state.mediacache.hasOwnProperty(
									this.state.room.media[this.state.room.cur]
								)
									? this.state.mediacache[
											this.state.room.media[
												this.state.room.cur
											]
									  ].title
									: "Loading..."}
							</span>
						</div>
					</div>
				</main>
				<div
					style={{
						background: "rgb(44, 40, 52)",
						minWidth: 320,
						maxWidth: 360,
						display: "flex",
						flexDirection: "column"
					}}
				>
					<div
						style={{
							background: "rgb(44, 40, 52)",
							height: 40,
							flexShrink: 0,
							display: "flex"
						}}
					>
						<button
							style={{
								flex: 1
							}}
						>
							Chat
						</button>
						<button
							style={{
								flex: 1
							}}
						>
							Playlist
						</button>
					</div>
					<div
						style={{
							background: "rgb(0, 0, 0, 0.3)",
							flex: 1
						}}
					>
						sidebar
					</div>
				</div>
			</div>
		);
	}
}
