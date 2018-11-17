import React from 'react';

export default class PlaylistView extends React.Component {

	render() {
		return (
			<div className="playlist-view">
				{this.props.items.map(item => (
					<div className="card playlist-item" key={item.id}>
						<h4>Video name</h4>
					</div>
				))}
			</div>
		);
	}
}