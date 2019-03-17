import { Component } from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import { Slider } from "react-player-controls";

const PlayerButton = ({ style, children, ...props }) => (
	<button
		css={[
			{
				appearance: "none",
				outline: "none",
				border: "none",
				borderRadius: "0%",
				background: "transparent",
				color: "white",
				opacity: 0.9,
				transition: "all 0.15s",
				"&:hover": {
					opacity: 1,
					cursor: "pointer",
					transform: "scale(1.08)"
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
);

const SliderBar = ({ value, style, ...props }) => (
	<div
		css={[
			{
				position: "absolute",
				background: "#878c88",
				borderRadius: 4,
				top: 0,
				bottom: 0,
				left: 0,
				width: `${value * 100}%`
			},
			style
		]}
		{...props}
	/>
);

const SliderHandle = ({ value, style, ...props }) => (
	<div
		css={[
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
				},
				top: 0,
				left: `${value * 100}%`,
				marginTop: -4,
				marginLeft: -8
			},
			style
		]}
		{...props}
	/>
);

export default class MediaControls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hidden: true
		};
	}

	componentWillUnmount() {
		clearTimeout(this._hideTimeout);
	}

	_handleVolumeChange = val => {
		this.props.player.setState({ muted: false });
		if (!isNaN(val))
			this.props.player.setVolume(
				Math.max(0, Math.min(1, val.toFixed(4)))
			);
	};

	_showControls = () => {
		clearTimeout(this._hideTimeout);
		this.setState({ hidden: false });
	};

	_hideControls = () => {
		// hide controls after 400ms
		this._hideTimeout = setTimeout(() => {
			this.setState({ hidden: true });
		}, 400);
	};

	render() {
		const { className, style, player } = this.props;
		const {
			duration,
			loaded,
			muted,
			played,
			playing,
			volume,
			playedSeconds,
			seeking
		} = player.state;

		return (
			<div
				className={className}
				css={[
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
					onClick={player.playPause}
				/>
				<div
					css={[
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
					css={[
						{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							background:
								"linear-gradient(0, transparent, rgba(0, 0, 0, 0.35))",
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
					css={[
						{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							// height: "100%",
							margin: "12px 18px",
							width: "100%",
							opacity: 1,
							zIndex: 3
						},
						this.state.hidden && {
							opacity: 0,
							transition: "opacity 0.4s"
						}
					]}
				>
					<div
						style={{
							color: "#FFF"
						}}
					>
						{player.props.mediacache.hasOwnProperty(
							player.state.url
						) ? (
							<a
								style={{
									color: "#FFF"
								}}
								target="_blank"
								rel="noopener noreferrer"
								href={`https://www.youtube.com/watch?v=${
									player.state.url
								}`}
							>
								{
									player.props.mediacache[player.state.url]
										.title
								}
							</a>
						) : (
							"Loading..."
						)}
					</div>
					<div>
						{player.props.mediacache.hasOwnProperty(
							player.state.url
						) ? (
							<a
								style={{
									color: "#FFF",
									opacity: 0.8
								}}
								target="_blank"
								rel="noopener noreferrer"
								href={
									player.props.mediacache[player.state.url]
										.channel.url
								}
							>
								{
									player.props.mediacache[player.state.url]
										.channel.title
								}
							</a>
						) : (
							"Loading..."
						)}
					</div>
				</div>
				<div
					css={[
						{
							position: "absolute",
							bottom: 0,
							padding: 0,
							left: 0,
							right: 0,
							zIndex: 3,
							transition: "height 0.1s",
							height: 46
						},
						this.state.hidden && {
							height: 2,
							transition: "height 0.4s"
						}
					]}
				>
					<Slider
						isEnabled={false}
						style={{
							flex: 1,
							overflow: "hidden",
							cursor: "inherit",
							height: this.state.hidden ? 2 : 4,
							margin: this.state.hidden ? 0 : "0 6px",
							borderRadius: this.state.hidden ? 0 : 4,
							background: this.state.hidden
								? "rgba(255,255,255,0)"
								: "rgba(255,255,255,0.2)",
							transition: this.state.hidden
								? "margin 0.2s ease 0.2s, height 0.2s ease 0.2s, borderRadius 0.15s, background 0.3s"
								: "margin 0.1s, height 0.1s, borderRadius 0.1s, background 0.3s"
						}}
						onChangeStart={player.onSeekMouseDown}
						onChange={player.onSeekChange}
						onChangeEnd={player.onSeekMouseUp}
					>
						<SliderBar
							value={loaded.toFixed(3)}
							style={{
								background: "rgba(255,255,255,0.2)",
								transition: "width 0.5s"
							}}
						/>
						<SliderBar
							value={played.toFixed(3)}
							css={[
								{
									background: "#fff"
								},
								!seeking && { transition: "width 0.2s linear" }
							]}
						/>
						<SliderHandle
							value={played.toFixed(3)}
							style={{
								transform: "scale(0)",
								background: "#fff",
								height: 12,
								width: 12
							}}
						/>
					</Slider>
					<div
						css={[
							{
								display: "flex",
								padding: "2px 8px",
								opacity: 1,
								transition: "opacity 0.15s"
							},
							this.state.hidden && {
								opacity: 0
							}
						]}
					>
						<PlayerButton
							onClick={player.playPause}
							style={{
								padding: "4px 10px"
							}}
						>
							{playing ? <Pause /> : <PlayArrow />}
						</PlayerButton>
						<span
							css={{
								display: "flex",
								width: 34,
								overflow: "hidden",
								transition: "width 0.1s",
								"&:hover": {
									width: 100
								}
							}}
						>
							<PlayerButton onClick={player.toggleMute}>
								{muted || volume === 0 ? (
									<VolumeOff />
								) : (
									<VolumeUp />
								)}
							</PlayerButton>
							<Slider
								className="volume-slider"
								isEnabled={true}
								style={{
									verticalAlign: "middle",
									flex: 1,
									margin: "16px 8px",
									borderRadius: "4px",
									background: "rgba(255,255,255,0.2)",
									transition: "width 0.1s",
									cursor: "pointer"
								}}
								onChange={this._handleVolumeChange}
							>
								<SliderBar
									value={muted ? 0 : volume.toFixed(2)}
									style={{ background: "#fff" }}
								/>
								<SliderHandle
									value={muted ? 0 : volume.toFixed(2)}
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
								opacity: 0.7,
								userSelect: "none"
							}}
						>
							<time>{formatTime(playedSeconds)}</time>
							<span style={{ opacity: 0.7 }}>
								{" / "}
								<time>{formatTime(duration)}</time>
							</span>
						</span>
					</div>
				</div>
			</div>
		);
	}
}

function formatTime(current = 0) {
	let h = Math.floor(current / 3600);
	let m = Math.floor((current - h * 3600) / 60);
	let s = Math.floor(current % 60);
	return h > 0
		? h + ":" + (m < 10 ? `0${m}` : m) + ":" + (s < 10 ? `0${s}` : s)
		: m + ":" + s;
}
