import React, { Component } from "react";
import Radium from "radium";
import { Slider, Direction, FormattedTime } from "react-player-controls";
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { withMediaProps, controls, utils } from "react-media-player";
const {
	PlayPause,
	CurrentTime,
	Progress,
	SeekBar,
	Duration,
	MuteUnmute,
	Volume,
	Fullscreen
} = controls;

const PlayerButton = Radium(({ style, children, ...props }) => (
	<button
		style={[
			{
				appearance: "none",
				outline: "none",
				border: "none",
				borderRadius: "0%",
				background: "transparent",
				color: "white",
				opacity: 0.9,
				transition: "all 0.15s",
				":hover": {
					opacity: 1,
					cursor: "pointer",
					transform: "scale(1.1)"
				},
				fontSize: 22,
				padding: "4px 6px",
				margin: "0"
			},
			style
		]}
		{...props}
	>
		{children}
	</button>
));

const SliderBar = ({ direction, value, style }) => (
	<div
		style={Object.assign(
			{},
			{
				position: "absolute",
				background: "#878c88",
				borderRadius: 4
			},
			direction === Direction.HORIZONTAL
				? {
						top: 0,
						bottom: 0,
						left: 0,
						width: `${value * 100}%`
				  }
				: {
						right: 0,
						bottom: 0,
						left: 0,
						height: `${value * 100}%`
				  },
			style
		)}
	/>
);

const SliderHandle = ({ direction, value, style }) => (
	<div
		style={Object.assign(
			{},
			{
				position: "absolute",
				width: 16,
				height: 16,
				background: "#72d687",
				borderRadius: "100%",
				transform: "scale(1)",
				transition: "transform 0.2s",
				"&:hover": {
					transform: "scale(1.3)"
				}
			},
			{
				top: 0,
				left: `${value * 100}%`,
				marginTop: -4,
				marginLeft: -8
			},
			style
		)}
	/>
);
@withMediaProps
@Radium
class MediaControls extends Component {
	// shouldComponentUpdate({ media }) {
	// 	return this.props.media !== media;
	// }

	_handlePlayPause = () => {
		this.props.media.playPause();
	};

	_handleMuteUnmute = () => {
		this.props.media.muteUnmute();
	};

	render() {
		const { className, style, media } = this.props;

		return (
			<div className={className} style={style}>
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						background:
							"linear-gradient(0, rgba(0, 0, 0, 0.5), transparent)",
						height: 64,
						width: "100%",
						zIndex: 1
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: 0,
						padding: 0,
						left: 0,
						right: 0,
						zIndex: 2
					}}
				>
					<Slider
						isEnabled={true}
						direction={Direction.HORIZONTAL}
						style={{
							flex: 1,
							height: 4,
							borderRadius: 0,
							background: "#eee",
							transition: "width 0.1s",
							cursor: "pointer"
						}}
					>
						<SliderBar
							direction={Direction.HORIZONTAL}
							value={0.25}
							style={{ background: "#72d687" }}
						/>
						<SliderHandle
							direction={Direction.HORIZONTAL}
							value={0.25}
							style={{
								transform: "scale(0)",
								background: "#72d687",
								height: 12,
								width: 12
							}}
						/>
					</Slider>
					<div
						style={{
							display: "flex",
							padding: 4
						}}
					>
						<PlayerButton
							onClick={this._handlePlayPause}
							style={{ padding: "4px 10px" }}
						>
							{media.isPlaying ? <MdPause /> : <MdPlayArrow />}
						</PlayerButton>

						<PlayerButton onClick={this._handleMuteUnmute}>
							{media.isMuted ? <MdVolumeOff /> : <MdVolumeUp />}
						</PlayerButton>

						<span
							style={{
								padding: "7px 12px",
								fontSize: 14,
								color: "white",
								opacity: 0.7
							}}
						>
							<time>{utils.formatTime(media.currentTime)}</time>
							<span style={{ opacity: 0.7 }}>
								{" / "}
								<time>{utils.formatTime(media.duration)}</time>
							</span>
						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default MediaControls;
