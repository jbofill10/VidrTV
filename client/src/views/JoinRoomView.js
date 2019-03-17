import React from "react";
import { Loader, RoomCard } from "../components";
import "whatwg-fetch";

export default class JoinRoomView extends React.Component {
	constructor() {
		super();

		this.state = {
			rooms: {},
			loading: true,
			error: false,
			message: "Loading Rooms List"
		};
	}

	componentDidMount() {
		// TODO: request sorted list and limit number of results for pagination
		fetch("/api/rooms")
			.then(res => {
				if (!res.ok) throw res.statusText;
				return res.json();
			})
			// .then((res) => res.json())
			.then(json => {
				console.log("/api/rooms response", json);
				this.setState({ rooms: json, loading: false });
			})
			.catch(ex => {
				console.error("/api/rooms error", ex);
				this.setState({
					loading: true,
					error: true,
					message: ex.toString()
				});
			});

		document.title = "Vidr.tv - Join a Room";
	}

	render() {
		if (this.state.loading)
			return (
				<Loader error={this.state.error} message={this.state.message} />
			);
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					overflowY: "auto"
				}}
			>
				<div
					style={{
						display: "flex",
						marginTop: 8,
						flexDirection: "column",
						alignItems: "center",
						width: "100%"
					}}
				>
					{this.state.rooms.map(room => (
						<RoomCard room={room} key={room._id} />
					))}
				</div>
			</div>
		);
	}
}
