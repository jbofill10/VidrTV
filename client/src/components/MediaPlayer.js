import React, { Component } from "react";
import { default as MediaControls, StatsOverlay } from "./MediaControls";
import YouTubePlayer from "react-player/lib/players/YouTube";

const paddingHack = 200;
const PlaybackDeltaThreshold = 1000;

export default class MediaPlayer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: props.room.media[props.room.cur],
			pip: false,
			playing: false,
			volume: 1,
			muted: true,
			played: 0,
			playedSeconds: 0,
			loaded: 0,
			duration: 0,
			playbackRate: 1.0,
			loop: false,
			seeking: false,
			showStats: true
		};
	}

	componentDidMount() {
		const { socket } = this.props;
		const { showStats } = this.state;

		socket.on("fullsync", data => {
			this.setState({ url: data.media[data.cur], playing: true });

			if (showStats) this._statsOverlay.event("fullsync");
		});

		if (showStats)
			this._statsOverlay.set(
				"ping",
				"ms",
				"Waiting for first Socket.io ping"
			);

		socket.on("pong", data => {
			if (showStats)
				this._statsOverlay.set(
					"ping",
					data + "ms",
					"latest Socket.io ping"
				);
		});

		socket.on("timesync", time => {
			let delta = this.state.playedSeconds * 1000 - time;
			let norm = Math.abs(delta);

			// console.log(
			// 	`timesync ${norm > timeSyncThreshold ? '🔴' : '🔵'} ${norm.toFixed(0)}ms ${delta < 0
			// 		? 'behind'
			// 		: 'ahead'}`
			// );

			if (showStats) {
				this._statsOverlay.remove("Playback Delta");
				this._statsOverlay.set(
					"Playback Delta",
					delta.toFixed(0) + "ms",
					`The current difference between the server and client playback time.\nIf delta is larger than the ${PlaybackDeltaThreshold}ms threshold, the player will try seeking to match the server playback time`,
					norm > PlaybackDeltaThreshold ? "bad" : "good"
				);
			}

			if (norm > PlaybackDeltaThreshold) {
				// console.log(`\tover ${timeSyncThreshold}ms threshold, seeking to catch up...`);
				if (showStats) {
					this._statsOverlay.event(
						`delta > ${PlaybackDeltaThreshold}ms thres`,
						"warn",
						2800,
						"left"
					);
					this._statsOverlay.event(
						"seeking to catch up...",
						"warn",
						2720,
						"left"
					);
				}

				this.player.seekTo(
					(time + (socket.io.lastPing | 0)) /
						1000 /
						this.state.duration
				);
				this.setState({ playing: true });
			}
		});
	}

	ref = player => {
		this.player = player;
	};

	playPause = () => {
		this.setState({ playing: !this.state.playing });
	};

	setVolume = value => {
		this.setState({ volume: value });
	};

	toggleMute = () => {
		this.setState({ muted: !this.state.muted });
	};

	onSeekMouseDown = e => {
		this.setState({ seeking: true });
	};

	onSeekChange = value => {
		this.setState({ played: value });
	};

	onSeekMouseUp = value => {
		this.setState({ seeking: false });
		this.player.seekTo(value);
	};

	onReady = () => {
		if (this.state.showStats)
			this._statsOverlay.set("Player State", "Ready");

		this.player.seekTo(this.props.time / 1000);
		this.setState({ playing: true });
	};

	onStart = () => {
		if (this.state.showStats)
			this._statsOverlay.set("Player State", "Started");
	};

	onPlay = () => {
		if (this.state.showStats)
			this._statsOverlay.set("Player State", "Playing");
	};

	onProgress = state => {
		if (!this.state.seeking) this.setState(state);
	};

	onDuration = duration => {
		this.setState({ duration });
	};

	onBuffer = () => {
		if (this.state.showStats)
			this._statsOverlay.set("Player State", "Buffering");
	};

	onSeek = () => {
		if (this.state.showStats)
			this._statsOverlay.set("Player State", "Seeking");
	};

	onEnded = () => {
		if (this.state.showStats)
			this._statsOverlay.set("Player State", "Ended");
	};

	onError = e => {
		if (this.state.showStats)
			this._statsOverlay.event(`Player Error ${e}`, "error", 5000);
	};

	render() {
		const {
			url,
			playing,
			volume,
			muted,
			loop,
			playbackRate,
			pip,
			showStats
		} = this.state;

		return (
			<div
				className={this.props.className}
				style={{
					border: "solid 1px",
					borderRadius: "1px",
					borderColor: "#c78bff",
					boxShadow: "0 0 32px #c78bff75",
					background: "rgba(255, 255, 255, 0.082)"
				}}
			>
				<div
					className="media"
					style={{
						position: "relative",
						display: "grid",
						height: this.props.height,
						width: this.props.width,
						overflow: "hidden"
					}}
				>
					<div
						style={{
							position: "absolute",
							top: -paddingHack,
							pointerEvents: "none",
							height: this.props.height + paddingHack * 2,
							width: this.props.width
						}}
					>
						<YouTubePlayer
							ref={this.ref}
							url={"https://www.youtube.com/watch?v=" + url}
							pip={pip}
							playing={playing}
							loop={loop}
							playbackRate={playbackRate}
							volume={volume}
							muted={muted}
							width="100%"
							height="100%"
							progressInterval={200}
							onReady={this.onReady}
							onStart={this.onStart}
							onPlay={this.onPlay}
							onProgress={this.onProgress}
							onDuration={this.onDuration}
							onBuffer={this.onBuffer}
							onSeek={this.onSeek}
							onEnded={this.onEnded}
							onError={this.onError}
						/>
					</div>
					<MediaControls
						className="media-controls"
						player={this}
						lockedPlayback
					/>
					{showStats && <StatsOverlay player={this} />}
				</div>
			</div>
		);
	}
}
