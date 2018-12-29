import React, { Component } from "react";
import Radium from "radium";
import { Slider, Direction } from "react-player-controls";
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { withMediaProps, utils } from "react-media-player";

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

	constructor(props) {
		super(props);

		this.state = {
			hidden: true
		};
	}

	_handlePlayPause = () => {
		this.props.media.playPause();
	};

	_handleMuteUnmute = () => {
		this.props.media.muteUnmute();
	};

	_handleVolumeChange = val => {
		if (!isNaN(val))
			this.props.media.setVolume(
				Math.max(0, Math.min(1, val.toFixed(4)))
			);
	};

	_handleSeek = time => {
		this.props.media.seekTo(+(time * this.props.media.duration));
	};

	_hideTimeout = -1;

	_showControls = () => {
		clearTimeout(this._hideTimeout);
		this.setState({ hidden: false });
	};

	_hideControls = () => {
		this._hideTimeout = setTimeout(() => {
			this.setState({ hidden: true });
		}, 800);
	};

	render() {
		const { className, style, media } = this.props;

		return (
			<div
				className={className}
				style={[
					{
						background: "transparent",
						border: 0,
						outline: "none",
						width: "100%",
						height: "100%",
						padding: 0
					},
					style
				]}
				onMouseOver={this._showControls}
				onMouseLeave={this._hideControls}
			>
				<button
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						background: "transparent",
						height: "100%",
						width: "100%",
						zIndex: 2,
						border: 0,
						outline: "none"
					}}
					onClick={this._handlePlayPause}
				/>
				<div
					style={[
						{
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
							background:
								"linear-gradient(0, rgba(0, 0, 0, 0.35), transparent)",
							opacity: 1,
							transition: "all 0.2s",
							height: 64,
							width: "100%",
							zIndex: 1
						},
						this.state.hidden && {
							height: 16,
							opacity: 0,
							transition: "all 0.8s"
						}
					]}
				/>
				<div
					style={[
						{
							position: "absolute",
							bottom: 0,
							padding: 0,
							left: 0,
							right: 0,
							zIndex: 3,
							// overflow: 'hidden',
							transition: "height 0.1s",
							height: 46
						},
						this.state.hidden && {
							height: 4,
							transition: "height 0.4s"
						}
					]}
				>
					<Slider
						isEnabled={true}
						direction={Direction.HORIZONTAL}
						style={{
							flex: 1,
							height: 4,
							borderRadius: 0,
							background: "rgba(255,255,255,0.2)",
							transition: "width 0.1s",
							cursor: "pointer"
						}}
						onChangeEnd={this._handleSeek}
					>
						<SliderBar
							direction={Direction.HORIZONTAL}
							value={media.progress.toFixed(4)}
							style={{
								background: "rgba(255,255,255,0.2)",
								transition: "width 0.3s"
							}}
						/>
						<SliderBar
							direction={Direction.HORIZONTAL}
							value={
								media.currentTime.toFixed(4) / media.duration
							}
							style={{ background: "#fff" }}
						/>
						<SliderHandle
							direction={Direction.HORIZONTAL}
							value={
								media.currentTime.toFixed(4) / media.duration
							}
							style={{
								transform: "scale(0)",
								background: "#fff",
								height: 12,
								width: 12
							}}
						/>
					</Slider>
					<div
						style={[
							{
								display: "flex",
								padding: 4,
								opacity: 1,
								transition: "opacity 0.15s"
							},
							this.state.hidden && {
								opacity: 0
							}
						]}
					>
						<PlayerButton
							onClick={this._handlePlayPause}
							style={{ padding: "4px 10px" }}
						>
							{media.isPlaying ? <MdPause /> : <MdPlayArrow />}
						</PlayerButton>

						<span
							style={{
								display: "flex",
								width: 34,
								overflow: "hidden",
								transition: "width 0.1s",
								":hover": {
									width: 100
								}
							}}
						>
							<PlayerButton onClick={this._handleMuteUnmute}>
								{media.isMuted ? (
									<MdVolumeOff />
								) : (
									<MdVolumeUp />
								)}
							</PlayerButton>
							<Slider
								className="volume-slider"
								isEnabled={true}
								direction={Direction.HORIZONTAL}
								style={{
									flex: 1,
									margin: "15px 8px",
									borderRadius: "4px",
									background: "rgba(255,255,255,0.2)",
									transition: "width 0.1s",
									cursor: "pointer"
								}}
								onChange={this._handleVolumeChange}
							>
								<SliderBar
									direction={Direction.HORIZONTAL}
									value={media.volume}
									style={{ background: "#fff" }}
								/>
								<SliderHandle
									direction={Direction.HORIZONTAL}
									value={media.volume}
									style={{
										// transform: 'scale(0)',
										background: "#fff",
										height: 12,
										width: 12
									}}
								/>
							</Slider>
						</span>

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
