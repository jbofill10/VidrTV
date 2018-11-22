import React, { Component } from 'react';
import ReactPlayer from 'react-player';
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
				<ReactPlayer
					className="react-player"
				/>
				<PlayerControls />
			</div>
		);
	}
}