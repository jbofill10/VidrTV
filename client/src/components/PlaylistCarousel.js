import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { youtube } from "../youtube";

export default class PlaylistCarousel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {}
		};
	}

	componentDidMount() {
		let data = {};
		this._isMounted = true;

		for (let i = 0; i < this.props.room.media.length; i++) {
			if (!this._isMounted) break;
			youtube
				.getVideoByID(this.props.room.media[i])
				.then(result => {
					if (this._isMounted) {
						data[this.props.room.media[i]] = result;

						this.setState({ data: data });
					}
				})
				.catch(console.error);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		const { cur, media } = this.props.room;

		const items = [];

		const num = 4;
		const step = 90 / (num * 2);
		const offset = 0;
		const circrad = 220;
		const size = 6;
		const cursize = 8;

		for (let i = -num; i <= num; i++) {
			const id = media[(media.length * num + cur + i) % media.length];
			const rot = step * i + offset;

			items.push(
				<div
					className="card playlist-item"
					key={i}
					style={{
						position: "absolute",
						height: 9 * (i === 0 ? cursize : size),
						width: 16 * (i === 0 ? cursize : size),
						backgroundColor: "transparent",
						color: "rgba(255, 255, 255, 0.747)",
						boxShadow:
							i === 0
								? "0 2px 6px rgba(0, 0, 0, 0.16), 0 1px 6px rgba(0, 0, 0, 0.32)"
								: "0 0px 0px rgba(0, 0, 0, 0), 0 0px 0px rgba(0, 0, 0, 0)",
						transform: `rotate(${rot}deg) translate(${circrad}px) rotate(${-rot}deg) translate(${-8 *
							(i === 0 ? cursize : size)}px,${-4.5 *
							(i === 0 ? cursize : size)}px) rotate(${rot}deg)`,
						zIndex: num * 2 - Math.abs(i),
						opacity: Math.pow(1 - Math.abs(i / num), 0.1),
						transition: "all 0.8s"
					}}
				>
					{this.state.data.hasOwnProperty(id) ? (
						<img
							className="thumb"
							alt={this.state.data[id].title}
							src={this.state.data[id].thumbnails.medium.url}
							height="100%"
							width="100%"
							style={{}}
						/>
					) : (
						<h4>Loading</h4>
					)}
				</div>
			);
		}

		return (
			<div
				className="playlist-view"
				css={[
					{
						// background: "red",
						position: "relative",
						height: 200,
						overflow: "hidden"
					},
					this.props.style
				]}
			>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: 200,
						right: 0,
						transform: "translateY(-50%)",
						zIndex: 0
					}}
				>
					{this.state.data.hasOwnProperty(media[cur]) ? (
						<div
							style={{
								background: "rgba(16,16,16,0.3)",
								boxShadow:
									"0 2px 6px rgba(0, 0, 0, 0.16), 0 1px 6px rgba(0, 0, 0, 0.32)",
								padding: "12px 32px 12px 24px",
								// marginRight: 24,
								borderRadius: "0 2px 2px 0"
							}}
						>
							<p
								style={{
									color: "white",
									opacity: 0.9,
									fontSize: 16,
									margin: 0
								}}
							>
								{this.state.data[media[cur]].title}
							</p>
							<p
								style={{
									color: "white",
									opacity: 0.7,
									margin: "4px 0 0 0",
									fontSize: 12
								}}
							>
								{this.state.data[media[cur]].channel.title}
							</p>
						</div>
					) : (
						<h4>Loading</h4>
					)}
				</div>
				<div
					style={{
						// background: "green",
						position: "absolute",
						left: 0,
						top: 0,
						bottom: 0,
						width: 220,
						MaskImage: `linear-gradient(transparent,rgba(0, 0, 0, 1.0) 25%, rgba(0, 0, 0, 1.0) 75%, transparent)`,
						WebkitMaskImage: `linear-gradient(transparent,rgba(0, 0, 0, 1.0) 25%, rgba(0, 0, 0, 1.0) 75%, transparent)`
					}}
				>
					<div
						style={{
							position: "absolute",
							left: 128,
							top: "50%"
						}}
					>
						<div
							className="circle-parent"
							style={{
								position: "absolute",
								left: -circrad,
								top: "50%",
								height: 5,
								width: 5,
								background: "red",
								transform: "translateX(-50%)"
							}}
						>
							{items}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
