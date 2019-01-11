import React from "react";
import { NavLink } from "react-router-dom";
import "whatwg-fetch";

export default class DefaultView extends React.Component {
	constructor() {
		super();

		this.state = {
			rooms: {},
			loading: true
		};
	}

	componentDidMount() {
		// TODO: request sorted list and limit number of results for pagination
		fetch("http://localhost:3000/api/rooms")
			.then(res => res.json())
			.then(json => {
				console.log("/api/rooms response", json);
				this.setState({ rooms: json, loading: false });
			})
			.catch(ex => {
				console.error("parsing failed", ex);
			});
	}

	render() {
		if (this.state.loading) return <div>Loading Rooms...</div>;
		return (
			<div className="room-list">
				{this.state.rooms.map(room => (
					<div className="card room-item" key={room._id}>
						<h3>{room.name}</h3>
						<NavLink to={`/r/${room._id}`}>Join Room</NavLink>
					</div>
				))}
			</div>
		);
	}
}
