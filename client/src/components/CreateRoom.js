import React from "react";
import Radium from "radium";

@Radium
class CreateRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = { inputValue: "" };
	}

	handleChange(val) {
		this.setState({
			inputValue: val
		});
	}

	increment() {
		this.setState({
			inputValue: this.state.inputValue + ""
		});
	}

	submission() {
		fetch("/api/room/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				submission: this.state.inputValue
			})
		}).then(res => console.log("Success"));
	}

	render() {
		return (
			<header>
				Hello
				<div>
					<p>
						<input
							type="text"
							name="input"
							value={this.state.inputValue}
							onChange={event =>
								this.handleChange(event.target.val)
							}
						/>
						<input
							type="submit"
							value="Ok"
							onClick={() => this.submission()}
						/>
					</p>
				</div>
			</header>
		);
	}
}

export default CreateRoom;
