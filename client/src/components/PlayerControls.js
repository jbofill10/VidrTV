import React, { Component } from 'react';
import { Slider, Direction } from 'react-player-controls';
import Radium from 'radium';

const SliderBar = ({ direction, value, style }) => (
	<div
		style={Object.assign({}, {
			position: 'absolute',
			background: '#878c88',
			borderRadius: 4,
		}, direction === Direction.HORIZONTAL ? {
			top: 0,
			bottom: 0,
			left: 0,
			width: `${value * 100}%`,
		} : {
			right: 0,
			bottom: 0,
			left: 0,
			height: `${value * 100}%`,
		}, style)}
	/>
);

const SliderHandle = ({ direction, value, style }) => (
	<div
		style={Object.assign({}, {
			position: 'absolute',
			width: 16,
			height: 16,
			background: '#72d687',
			borderRadius: '100%',
			transform: 'scale(1)',
			transition: 'transform 0.2s',
			'&:hover': {
				transform: 'scale(1.3)',
			}
		}, {
			top: 0,
			left: `${value * 100}%`,
			marginTop: -4,
			marginLeft: -8,
		}, style)}
	/>
)

export default @Radium class PlayerControls extends Component {

	render() {
		return (
			<div className="player-controls">
				<Slider
					isEnabled={true}
					direction={Direction.HORIZONTAL}
					style={{
						width: '100%',
						height: 8,
						borderRadius: 4,
						background: '#eee',
						transition: 'width 0.1s',
						cursor: 'pointer',
					}}
				>
					<SliderBar direction={Direction.HORIZONTAL} value={0.25} style={{ background: true ? '#72d687' : '#878c88' }} />
					<SliderHandle direction={Direction.HORIZONTAL} value={0.25} style={{ background: true ? '#72d687' : '#878c88' }} />
				</Slider>
			</div>
		);
	}
}