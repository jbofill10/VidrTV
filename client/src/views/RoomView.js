import { Component } from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { MediaPlayer, Loader } from "../components";
import { SidebarView } from "./";
import { withTheme } from "@material-ui/core/styles";
import openSocket from "socket.io-client";
import { youtube } from "../youtube";
import { ClocksyClient } from "clocksy";
import "whatwg-fetch";

class RoomView extends Component {
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

		this.clock = new ClocksyClient({
			sendRequest: req => this.socket.emit("clocksync", req),
			alpha: 0.15,
			updatePeriod: 3000
		});

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		document.title = "Vidr.tv - Joining...";

		// open realtime socket connection
		this.socket = openSocket(
			process.env.NODE_ENV === "development"
				? window.location.hostname + ":8080"
				: null
		);

		this.socket.on("connect_error", error => {
			console.error(error);
			document.title = "Vidr.tv - Connection Error";
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
			document.title = "Vidr.tv - Connection Timeout";
			this.setState({
				joining: true,
				error: true,
				loadingmessage: "Connection Timeout"
			});
		});

		this.socket.on("connect", () => {
			// join room by id
			this.socket.emit("join", { roomid: this.roomid });

			// start clock
			this.clock.start();
			this.socket.on("clocksync", data => {
				this.clock.processResponse(data);
			});

			// first fullsync = joined room
			this.socket.on("fullsync", data => {
				console.log("fullsync", data);

				this.setState({ room: data, joining: false });

				document.title = `Vidr.tv - ${data.name}`;

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
		});

		this.socket.on("disconnect", () => this.clock.stop());

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

		const { theme } = this.props;

		return (
			<div
				css={{
					display: "flex",
					overflow: "hidden",
					height: "100%",
					width: "100%",
					maxWidth: "1920px",
					margin: "0 auto",
					[theme.breakpoints.down("xs")]: {
						overflowY: "scroll",
						// display: "block",
						flexDirection: "column"
					}
				}}
			>
				<main
					css={{
						overflow: "hidden",
						display: "flex",
						flexDirection: "column",
						[theme.breakpoints.up("sm")]: {
							flex: 1
						}
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
							clock={this.clock}
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
					css={{
						background: "rgb(44, 40, 52)",
						display: "flex",
						flexDirection: "column",
						position: "relative",
						backgroundColor: theme.palette.background.paper,
						overflow: "hidden",
						[theme.breakpoints.up("sm")]: {
							width: 380
						},
						[theme.breakpoints.down("xs")]: {
							minHeight: 320,
							flex: 1
						}
					}}
					roomview={this}
				/>
			</div>
		);
	}
}

export default withTheme()(RoomView);
