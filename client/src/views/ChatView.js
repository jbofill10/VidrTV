import React from "react";
import Radium from "radium";

@Radium
class ChatView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {}
		};
	}

	render() {
		return <div>chat view</div>;
	}
}

export default ChatView;
