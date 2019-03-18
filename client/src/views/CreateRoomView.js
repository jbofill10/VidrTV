import React from "react";
import "whatwg-fetch";
import RoomSettingsView from "../views/RoomSettingsView";

export default class CreateRoom extends React.Component {
	componentDidMount() {
		document.title = "Vidr.tv - Create a Room";
	}

	render() {
		return (
			<div
				className="create-room"
				style={{
					position: "absolute",
					left: "50%",
					transform: "translate(-50%)",
					width: "100%",
					maxWidth: 400
				}}
			>
				<RoomSettingsView
					style={{
						paddingTop: 16
					}}
				/>
			</div>
		);
	}
}
