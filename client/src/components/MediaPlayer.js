import React, { Component } from "react";
import { default as MediaControls } from "./MediaControls";
import YouTubePlayer from "react-player/lib/players/YouTube";

const paddingHack = 200;

export default class MediaPlayer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: props.url,
			pip: false,
			playing: false,
			volume: 1,
			muted: false,
			played: 0,
			loaded: 0,
			duration: 0,
			playbackRate: 1.0,
			loop: false
		};
	}

	ref = player => {
		this.player = player;
	};

	playPause = () => {
		this.setState({ playing: !this.state.playing });
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
					<YouTubePlayer
						style={{
							position: "absolute",
							top: -paddingHack,
							pointerEvents: "none",
							height: this.props.height + paddingHack * 2,
							width: this.props.width
						}}
						ref={this.ref}
						url={url}
						pip={pip}
						playing={playing}
						loop={loop}
						playbackRate={playbackRate}
						volume={volume}
						muted={muted}
					/>
					<MediaControls className="media-controls" player={this} />
				</div>
			</div>
		);
	}
}
