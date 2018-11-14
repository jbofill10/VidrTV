import React from 'react';

export default class RoomList extends React.Component {

	render() {
		return (
			<ul className="room-list">
				{ this.props.rooms.map(room => (
					<div className="card room-item" id={room.id}>
						<h3>{room.data.name}</h3>
						<button onClick={() => { this.props.joinRoom(room.id); }}>
							Join Room
						</button>
					</div>
				))}
			</ul>
		);
	}
}