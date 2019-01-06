import React, { Component } from "react";
import { default as MediaControls } from "./MediaControls";
import YouTubePlayer from "react-player/lib/players/YouTube";

const paddingHack = 200;
const timeSyncThreshold = 3000;

export default class MediaPlayer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: props.url,
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
			seeking: false
		};
	}

	componentDidMount() {
		this.props.socket.on("statesync", data => {
			let delta = this.state.playedSeconds * 1000 - data.time;
			let norm = Math.abs(delta);

			console.log(
				`\tMediaPlayer: ${
					norm > timeSyncThreshold ? "❌" : "✅"
				} ${norm.toFixed(0)}ms ${delta < 0 ? "behind" : "ahead"}`
			);

			if (norm > timeSyncThreshold) {
				console.log(
					`\t\tover ${timeSyncThreshold}ms threshold, seeking to catch up...`
				);
				this.player.seekTo(data.time / 1000 / this.state.duration);
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

	onProgress = state => {
		if (!this.state.seeking) this.setState(state);
	};

	onDuration = duration => {
		this.setState({ duration });
	};

	onReady = () => {
		this.player.seekTo(this.props.time / 1000);
		this.setState({ playing: true });
	};

	render() {
		const {
			url,
			playing,
			volume,
			muted,
			loop,
			playbackRate,
			pip
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
							url={url}
							pip={pip}
							playing={playing}
							loop={loop}
							playbackRate={playbackRate}
							volume={volume}
							muted={muted}
							width="100%"
							height="100%"
							progressInterval={200}
							onDuration={this.onDuration}
							onProgress={this.onProgress}
							onReady={this.onReady}
						/>
					</div>
					<MediaControls
						className="media-controls"
						player={this}
						lockedPlayback
					/>
				</div>
			</div>
		);
	}
}
