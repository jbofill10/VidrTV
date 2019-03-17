import React from "react";
import SimpleBar from "simplebar-react";
import { withTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

@withTheme()
class ChatView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messages: [
				{ type: "chat", from: "Jacob Coughenour", body: "hello world" },
				{
					type: "chat",
					from: "Jacob Coughenour",
					body:
						"ouiweoriuwoeiruwio eruwioeroiweriouweriouw eoriwueroweurioweruweoiru weoiruw"
				}
			]
		};
	}

	render() {
		const { theme } = this.props;

		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					position: "relative",
					backgroundColor: theme.palette.background.paper
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 0,
						bottom: 86,
						left: 0,
						right: 0
					}}
				>
					<SimpleBar
						style={{
							position: "relative",
							height: "100%",
							width: "100%"
						}}
					>
						<div
							style={{
								padding: "20px 0px 2px 0px"
							}}
						>
							{this.state.messages.map((message, i) => (
								<div
									key={i}
									style={{
										marginTop: 2,
										padding: "2px 8px",
										display: "flex"
									}}
								>
									<Avatar
										style={{
											margin: "0 8px 0 2px",
											height: 32,
											width: 32
										}}
										alt={message.from}
										src="https://lh3.googleusercontent.com/-Z-FFGieEx7c/AAAAAAAAAAI/AAAAAAAAB58/fTEiXR3bqj0/s96-c/photo.jpg"
									/>
									<div
										style={{
											background:
												"rgba(255,255,255,0.03)",
											color: theme.palette.text.primary,
											borderRadius: 10,
											fontSize: 14,
											margin: "2px 20px 0 0",
											padding: "6px 12px 6px 12px"
										}}
									>
										{message.body}
									</div>
								</div>
							))}
						</div>
					</SimpleBar>
				</div>
			</div>
		);
	}
}

export default ChatView;
