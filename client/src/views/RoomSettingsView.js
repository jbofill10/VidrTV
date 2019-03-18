import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Switch from "@material-ui/core/Switch";
import "whatwg-fetch";

export default class RoomSettingsView extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			value: "",
			public: true
		};
	}

	handleChange = (name, key) => event => {
		this.setState({ [name]: event.target[key] });
	};

	handleSubmit(event) {
		event.preventDefault();

		fetch("/api/room/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				submission: this.state.value
			})
		}).then(res => {
			res.json();
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit} style={this.props.style}>
				<FormGroup row>
					<FormControl>
						<InputLabel htmlFor="my-input">Room Name</InputLabel>
						<Input
							id="my-input"
							aria-describedby="my-helper-text"
							onChange={this.handleChange("name", "value")}
						/>
						<FormHelperText id="my-helper-text">
							The display name for your room.
						</FormHelperText>
					</FormControl>
				</FormGroup>
				<FormGroup row>
					<FormControlLabel
						control={
							<Switch
								checked={this.state.public}
								onChange={this.handleChange(
									"public",
									"checked"
								)}
								value="public"
								color="primary"
							/>
						}
						label="Public"
					/>
				</FormGroup>
			</form>
		);
	}
}
