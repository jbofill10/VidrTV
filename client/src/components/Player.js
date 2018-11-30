import React, { Component } from 'react';
import YoutubePlayer from 'react-player/lib/players/YouTube';
import { default as PlayerControls } from './PlayerControls';

export default class Player extends Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className={this.props.className} style={{

			}}>
				<div className="player-wrapper">
					<YoutubePlayer
						className="react-player"
						url={this.props.url}
						controls
					/>
					<PlayerControls />
				</div>
			</div>
		);
	}
}