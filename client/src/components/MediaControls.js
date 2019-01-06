import React, { Component } from "react";
import Radium from "radium";
import { Slider } from "react-player-controls";
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { utils } from "react-media-player";

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
));

const SliderBar = Radium(({ value, style, ...props }) => (
	<div
		style={[
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
));

const SliderHandle = Radium(({ value, style, ...props }) => (
	<div
		style={[
			{
				position: "absolute",
				width: 16,
				height: 16,
				background: "#72d687",
				borderRadius: "100%",
				transform: "scale(1)",
				transition: "transform 0.2s",
				":hover": {
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
));

@Radium
class MediaControls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hidden: true
		};
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
		const { className, style, player, lockedPlayback } = this.props;
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
				{!lockedPlayback && (
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
				)}
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
						isEnabled={!lockedPlayback}
						style={{
							flex: 1,
							overflow: "hidden",
							cursor: lockedPlayback ? "inherit" : "pointer",
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
							style={[
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
						style={[
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
								padding: "4px 10px",
								display: lockedPlayback ? "none" : "inherit"
							}}
						>
							{playing ? <MdPause /> : <MdPlayArrow />}
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
							<PlayerButton onClick={player.toggleMute}>
								{muted || volume === 0 ? (
									<MdVolumeOff />
								) : (
									<MdVolumeUp />
								)}
							</PlayerButton>
							<Slider
								className="volume-slider"
								isEnabled={true}
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
							<time>{utils.formatTime(playedSeconds | 0)}</time>
							<span style={{ opacity: 0.7 }}>
								{" / "}
								<time>{utils.formatTime(duration | 0)}</time>
							</span>
						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default MediaControls;

@Radium
class StatsOverlay extends Component {
	constructor(props) {
		super(props);

		this.state = {
			info: {}
		};

		this._updated = [];

		props.player._statsOverlay = this;
	}

	color(input) {
		if (input === "yellow" || input === "warn") return "#FFEE58";
		if (input === "red" || input === "error" || input === "bad")
			return "#F50057";
		if (input === "green" || input === "good") return "#76FF03";
		if (input === "blue" || input === "event") return "#00E5FF";

		return input;
	}

	set(name, value, description = "", color = "white", flash = true) {
		let next = this.state.info;
		next[name] = {
			type: "value",
			description: description,
			color: this.color(color),
			text: value.toString(),
			flash: flash
		};

		this._updated.push(name);

		this.setState({
			info: next
		});
	}

	event(text, color = "event", timeout = 1000, align = "left") {
		let now = Date.now().toString();

		let next = this.state.info;
		next[now] = {
			type: "event",
			color: this.color(color),
			text: text,
			timeout: timeout,
			align: align
		};

		setTimeout(() => {
			let next = this.state.info;
			delete next[now];

			this.setState({
				info: next
			});
		}, timeout);

		this.setState({
			info: next
		});
	}

	remove(name) {
		let next = this.state.info;
		delete next[name];

		this.setState({
			info: next
		});
	}

	render() {
		let info = this.state.info;
		let lines = Object.keys(this.state.info);

		let maxNameLength = 5;
		let maxValueLength = 5;
		let maxEventLength = 10;

		lines.forEach(line => {
			if (info[line].type === "value") {
				maxNameLength = Math.max(line.length, maxNameLength);
				maxValueLength = Math.max(
					info[line].text.length,
					maxValueLength
				);
			} else
				maxEventLength = Math.max(
					info[line].text.length,
					maxEventLength
				);
		});

		setTimeout(() => {
			this._updated = [];
		}, 0);

		return (
			<div
				style={[
					{
						position: "absolute",
						top: "25%",
						width:
							Math.max(
								maxNameLength + maxValueLength + 1,
								maxEventLength
							) * 7,
						height: lines.length * 22,
						margin: 4,
						padding: "4px 6px 0 6px",
						fontSize: 12,
						borderRadius: 4,
						fontFamily: "monospace",
						color: "#ECEFF1",
						background: "rgba(0,0,0,0.3)",
						textShadow: "1px 0 5px rgba(0,0,0,0.8)",
						overflow: "hidden",
						transition: "all 0.3s",
						userSelect: "none"
					}
				]}
			>
				<table style={{ width: "100%" }}>
					<tbody>
						{lines.map(id => {
							if (info[id].type === "event") {
								return (
									<tr key={id}>
										<td
											colSpan="2"
											style={{
												textAlign: info[id].align,
												color: info[id].color,
												animation:
													"fadeout 0.3s ease " +
													(
														info[id].timeout /
															1000 -
														0.3
													).toFixed(1) +
													"s forwards"
											}}
										>
											{info[id].text}
										</td>
									</tr>
								);
							}
							return (
								<tr
									key={id}
									title={info[id].description}
									style={{
										cursor:
											info[id].description.length > 0
												? "help"
												: "auto"
									}}
								>
									<td>{id}</td>
									<td
										style={{
											textAlign: "right",
											color: info[id].color,
											animation:
												info[id].flash &&
												this._updated.indexOf(id) !== -1
													? "flash 1s"
													: ""
										}}
									>
										{info[id].text}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

export { StatsOverlay };
