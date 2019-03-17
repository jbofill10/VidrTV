import React from "react";
import { Global, css } from "@emotion/core";

export default class StatsOverlay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			info: {}
		};

		this._updated = [];
		this._eventTimeout = -1;

		props.player._statsOverlay = this;
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
		clearTimeout(this._eventTimeout);
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
		if (!this._isMounted) return;

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
		if (!this._isMounted) return;

		let now = Date.now().toString();

		let next = this.state.info;
		next[now] = {
			type: "event",
			color: this.color(color),
			text: text,
			timeout: timeout,
			align: align
		};

		this._eventTimeout = setTimeout(() => {
			this.remove(now);
		}, timeout);

		this.setState({
			info: next
		});
	}

	remove(name) {
		if (!this._isMounted) return;

		let next = this.state.info;
		delete next[name];

		this.setState({
			info: next
		});
	}

	componentDidUpdate() {
		this._updated = [];
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

		return (
			<div
				style={{
					position: "absolute",
					top: "25%",
					right: 0,
					width:
						Math.max(
							maxNameLength + maxValueLength + 1,
							maxEventLength
						) * 7,
					height: lines.length * 16 + 8,
					margin: 8,
					padding: "4px 6px",
					fontSize: 12,
					borderRadius: 4,
					fontFamily: "monospace",
					color: "#ECEFF1",
					background: "rgba(0,0,0,0.3)",
					textShadow: "1px 0 5px rgba(0,0,0,0.8)",
					overflow: "hidden",
					transition: "all 0.3s",
					userSelect: "none"
				}}
			>
				<Global
					styles={css`
						@keyframes flash {
							from {
								filter: brightness(2);
								transform: scale(1.05);
							}
							to {
								filter: brightness(1);
								transform: scale(1);
							}
						}
						@keyframes fadein {
							from {
								opacity: 0;
							}
							to {
								opacity: 1;
							}
						}
						@keyframes fadeout {
							from {
								opacity: 1;
							}
							to {
								opacity: 0;
							}
						}
					`}
				/>
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
												animation: `fadeout 0.3s ease ${(
													info[id].timeout / 1000 -
													0.3
												).toFixed(1)}s forwards`
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
