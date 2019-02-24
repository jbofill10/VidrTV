import React from "react";
import Radium from "radium";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Zoom from "@material-ui/core/Zoom";
import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import { ChatView, PlaylistView } from "./";

const styles = theme => ({
	root: {
		position: "relative",
		backgroundColor: theme.palette.background.paper,
		width: 380
	},
	container: {
		height: "100%"
	},
	fab: {
		position: "absolute",
		bottom: theme.spacing.unit * 2,
		right: theme.spacing.unit * 2
	},
	form: {
		flex: 0,
		padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit *
			12}px ${theme.spacing.unit * 1}px ${theme.spacing.unit * 1}px`
	},
	textField: {
		margin: "8px 12px 6px 8px"
	}
});

@Radium
class SidebarView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: 0,
			input: ""
		};
	}

	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleInputChange = event => {
		this.setState({ input: event.target.value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};

	onSubmit = event => {
		event.preventDefault();
		this.sendChatMessage();
	};

	sendChatMessage() {
		if (this.state.input.length === 0) return;

		// TODO: send message to server through socket io
		// do not update the chat view from here

		this.setState({ input: "" });
	}

	render() {
		const { classes, theme, style, roomview } = this.props;

		const transitionDuration = {
			enter: theme.transitions.duration.enteringScreen,
			exit: theme.transitions.duration.leavingScreen
		};

		const pages = [
			{
				name: "Chat",
				content: <ChatView roomview={roomview} />,
				fab: {
					color: "primary",
					className: classes.fab,
					icon: <SendIcon />,
					click: () => this.sendChatMessage()
				}
			},
			{
				name: "Playlist",
				content: <PlaylistView roomview={roomview} />,
				fab: {
					color: "secondary",
					className: classes.fab,
					icon: <AddIcon />,
					click: null
				}
			}
		];

		return (
			<div className={classes.root} style={style}>
				<AppBar position="static" color="default">
					<Tabs
						value={this.state.value}
						onChange={this.handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
					>
						{pages.map((page, index) => (
							<Tab label={page.name} key={index} />
						))}
					</Tabs>
				</AppBar>
				<SwipeableViews
					axis={theme.direction === "rtl" ? "x-reverse" : "x"}
					index={this.state.value}
					onChangeIndex={this.handleChangeIndex}
					style={{ height: "100%" }}
					containerStyle={{ height: "100%" }}
					slideStyle={{ height: "100%" }}
				>
					{pages.map((page, index) => (
						<span key={index}>{page.content}</span>
					))}
				</SwipeableViews>
				<div className={classes.bottom}>
					<Slide
						direction="up"
						in={this.state.value === 0}
						timeout={transitionDuration}
						style={{
							transitionDelay: `${
								this.state.value === 0
									? transitionDuration.exit
									: 0
							}ms`
						}}
					>
						<form
							className={classes.form}
							noValidate
							autoComplete="off"
							onSubmit={this.onSubmit}
						>
							<TextField
								id="outlined-full-width"
								variant="outlined"
								label="Message"
								className={classes.textField}
								value={this.state.input}
								onChange={this.handleInputChange}
								margin="normal"
								fullWidth
							/>
						</form>
					</Slide>
					{pages.map((page, index) => (
						<Zoom
							key={page.fab.color}
							in={this.state.value === index}
							timeout={transitionDuration}
							style={{
								transitionDelay: `${
									this.state.value === index
										? transitionDuration.exit
										: 0
								}ms`
							}}
							unmountOnExit
						>
							<Fab
								disabled={
									page.name === "Chat" &&
									this.state.input.length === 0
								}
								className={page.fab.className}
								color={page.fab.color}
								onClick={page.fab.click}
							>
								{page.fab.icon}
							</Fab>
						</Zoom>
					))}
				</div>
			</div>
		);
	}
}

SidebarView.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SidebarView);
