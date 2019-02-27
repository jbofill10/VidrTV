import React from "react";
import Radium from "radium";
import "whatwg-fetch";
import RoomSettings from "../components/RoomSettings";

@Radium
class CreateRoom extends React.Component {
	componentDidMount() {
		document.title = "Vidr.tv - Create a Room";
	}

	render() {
		return <RoomSettings />;
	}
}

export default CreateRoom;
