import React, { Component } from "react";
import { default as MediaControls } from "./MediaControls";
import { Media, Player } from "react-media-player";

export default class MediaPlayer extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
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
				<Media>
					<div
						className="media"
						style={{ position: "relative", display: "grid" }}
					>
						<Player
							src={this.props.url}
							style={{ pointerEvents: "none" }}
							onPause={() => {
								console.log("pause");
							}}
						/>
						<MediaControls className="media-controls" />
					</div>
				</Media>
			</div>
		);
	}
}
