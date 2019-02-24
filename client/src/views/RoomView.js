import React from "react";
import { MediaPlayer, Loader } from "../components";
import { SidebarView } from "./";
import openSocket from "socket.io-client";
import { youtube } from "../youtube";
import "whatwg-fetch";

export default class RoomView extends React.Component {
	constructor(props) {
		super();
		this.roomid = props.match.params.id;
		this.state = {
			room: {},
			mediacache: {},
			joining: true,
			error: false,
			loadingmessage: "Joining Room"
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		// open realtime socket connection
		this.socket = openSocket(
			process.env.NODE_ENV === "development"
				? window.location.hostname + ":8080"
				: null
		);

		this.socket.on("connect_error", error => {
			console.error(error);
			this.setState({
				joining: true,
				error: true,
				loadingmessage: (
					<span>
						<div>Connection Error</div>
						<div>{error.toString()}</div>
					</span>
				)
			});
		});

		this.socket.on("connect_timeout", () => {
			console.error("connect_timeout");
			this.setState({
				joining: true,
				error: true,
				loadingmessage: "Connection Timeout"
			});
		});

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
		if (this.state.joining)
			return (
				<Loader
					error={this.state.error}
					message={this.state.loadingmessage}
				/>
			);

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
				<SidebarView
					style={{
						background: "rgb(44, 40, 52)",
						display: "flex",
						flexDirection: "column"
					}}
					roomview={this}
				/>
			</div>
		);
	}
}
