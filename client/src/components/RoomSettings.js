import React from "react";
import Radium from "radium";
import "whatwg-fetch";

@Radium
class RoomSettings extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event) {
		fetch("/api/room/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				submission: this.state.value
			})
		}).then(res => {
			event.preventDefault();
			res.json();
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<form action="/" method="get">
					<label>
						Name:
						<input
							type="text"
							value={this.state.value}
							onChange={this.handleChange}
						/>
					</label>
					<input type="submit" value="Submit" />
				</form>
			</form>
		);
	}
}

export default RoomSettings;
