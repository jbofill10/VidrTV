import { Component } from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { MediaPlayer, Loader } from "../components";
import { SidebarView } from "./";
import { withTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import openSocket from "socket.io-client";
import { youtube } from "../youtube";
import { ClocksyClient } from "clocksy";
import "whatwg-fetch";

@withTheme()
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

				let mediacache = this.state.mediacache;

				for (let i = 0; i < this.state.room.media.length; i++) {
					if (!mediacache.hasOwnProperty(this.state.room.media[i]))
						youtube
							.getVideoByID(this.state.room.media[i], {
								part: "snippet,contentDetails,statistics"
							})
							.then(result => {
								youtube
									.getChannelByID(result.channel.id, {
										part: "snippet"
									})
									.then(channel => {
										result.channel = channel;
										mediacache[
											this.state.room.media[i]
										] = result;

										this.setState({
											mediacache: mediacache
										});
									});
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

		console.log(this.state.mediacache);

		return (
			<div
				css={{
					display: "flex",
					overflow: "hidden",
					// height: "100%",
					width: "100%",
					maxWidth: "1920px",
					margin: `0 auto ${theme.spacing.unit}px auto`,
					[theme.breakpoints.down("xs")]: {
						overflowY: "auto",
						flexDirection: "column",
						margin: 0
					}
				}}
			>
				<main
					css={{
						overflow: "hidden",
						display: "flex",
						flexDirection: "column",
						[theme.breakpoints.up("sm")]: {
							flex: 1,
							margin: `0 ${theme.spacing.unit}px`
						},
						[theme.breakpoints.down("xs")]: {
							flexShrink: 0
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
							heightdiff={110 + theme.spacing.unit}
							socket={this.socket}
							clock={this.clock}
							room={this.state.room}
							mediacache={this.state.mediacache}
						/>
					</div>
					<div
						css={{
							backgroundColor: theme.palette.background.paper,
							borderRadius: theme.shape.borderRadius,
							padding: "12px 16px",
							[theme.breakpoints.up("sm")]: {
								marginTop: `${theme.spacing.unit}px`
							}
						}}
					>
						{this.state.mediacache.hasOwnProperty(
							this.state.room.media[this.state.room.cur]
						) ? (
							<div>
								<Typography
									variant="subtitle1"
									style={{ color: "#FFF", fontSize: 18 }}
								>
									{
										this.state.mediacache[
											this.state.room.media[
												this.state.room.cur
											]
										].title
									}
								</Typography>
								<div
									style={{
										borderBottom:
											"solid 1px rgba(255,255,255,0.1)",
										paddingBottom: "8px"
									}}
								>
									<Typography
										variant="subtitle1"
										style={{ color: "#aaa", fontSize: 16 }}
									>
										{parseInt(
											this.state.mediacache[
												this.state.room.media[
													this.state.room.cur
												]
											].raw.statistics.viewCount
										).toLocaleString()}
										{" views"}
									</Typography>
								</div>
								<div
									style={{
										margin: "12px 0",
										display: "flex"
									}}
								>
									<img
										alt={
											this.state.mediacache[
												this.state.room.media[
													this.state.room.cur
												]
											].channel.title
										}
										style={{
											borderRadius: "50%",
											height: 48,
											width: 48
										}}
										src={
											this.state.mediacache[
												this.state.room.media[
													this.state.room.cur
												]
											].channel.thumbnails.default.url
										}
									/>
									<div
										style={{
											flex: 1,
											margin: "4px 12px"
										}}
									>
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={
												this.state.mediacache[
													this.state.room.media[
														this.state.room.cur
													]
												].channel.url
											}
											style={{
												color: "#fff",
												opacity: 0.88,
												fontSize: 14,
												fontWeight: 500
											}}
										>
											{
												this.state.mediacache[
													this.state.room.media[
														this.state.room.cur
													]
												].channel.title
											}
										</a>
										<div
											style={{
												color: "#fff",
												opacity: 0.6,
												fontSize: 13,
												fontWeight: 400
											}}
										>
											{"Published on "}
											{this.state.mediacache[
												this.state.room.media[
													this.state.room.cur
												]
											].publishedAt.toDateString()}
										</div>
									</div>
								</div>
							</div>
						) : (
							<div>Loading...</div>
						)}
					</div>
				</main>
				<div
					css={{
						display: "flex",
						flexDirection: "column",
						position: "relative",
						overflow: "hidden",
						[theme.breakpoints.up("sm")]: {
							width: 380,
							marginRight: `${theme.spacing.unit}px`,
							borderRadius: theme.shape.borderRadius
						},
						[theme.breakpoints.down("xs")]: {
							minHeight: 200,
							flex: 1
						}
					}}
				>
					<div
						style={{
							background: theme.palette.background.paper,
							height: 22,
							padding: "12px 18px",
							fontSize: 18
							// flex: 2
						}}
					>
						<div
							style={{
								color: "#FFF"
							}}
						>
							{this.state.room.name}
						</div>
					</div>
					<SidebarView
						style={{
							display: "flex",
							flexDirection: "column",
							position: "relative",
							backgroundColor: theme.palette.background.paper,
							overflow: "hidden",
							flex: 1
						}}
						roomview={this}
					/>
				</div>
			</div>
		);
	}
}

export default RoomView;
