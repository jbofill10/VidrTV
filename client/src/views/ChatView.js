import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const styles = theme => ({
	root: {
		width: "100%",
		height: "100%",
		position: "relative",
		maxWidth: 500,
		backgroundColor: theme.palette.background.paper
	},
	log: {
		position: "absolute",
		top: 0,
		bottom: 87,
		left: 0,
		right: 0,
		padding: "20px 0px 2px 0px",
		overflowY: "auto",
		backgroundColor: theme.palette.grey[900]
	},
	message: {
		// background: "rgba(255,255,255,0.06)",
		marginTop: 2,
		padding: "2px 8px",
		display: "flex"
	},
	avatar: {
		margin: "0 8px 0 2px",
		height: 32,
		width: 32
	},
	body: {
		background: "rgba(255,255,255,0.03)",
		color: theme.palette.text.primary,
		borderRadius: 10,
		fontSize: 14,
		margin: "2px 20px 0 0",
		padding: "6px 12px 6px 12px"
	}
});

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
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<div className={classes.log}>
					{this.state.messages.map((message, i) => (
						<div key={i} className={classes.message}>
							<Avatar
								className={classes.avatar}
								alt={message.from}
								src="https://lh3.googleusercontent.com/-Z-FFGieEx7c/AAAAAAAAAAI/AAAAAAAAB58/fTEiXR3bqj0/s96-c/photo.jpg"
							/>
							<div className={classes.body}>{message.body}</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(ChatView);
