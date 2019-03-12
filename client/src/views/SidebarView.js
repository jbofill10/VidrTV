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
		width: 380,
		overflow: "hidden"
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
	},
	bottom: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0
	}
});

@Radium
class SidebarView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: 1,
			searchopen: false,
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
		const { classes, theme, style, roomview, className } = this.props;

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
				content: (
					<PlaylistView
						roomview={roomview}
						searchopen={this.state.searchopen}
					/>
				),
				fab: {
					color: "secondary",
					className: classes.fab,
					icon: (
						<AddIcon
							style={{
								transition: `transform ${
									this.state.searchopen
										? transitionDuration.enter
										: transitionDuration.exit
								}ms ${theme.transitions.easing.easeInOut} 0ms`,
								transform: this.state.searchopen
									? "rotate(135deg)"
									: "rotate(0deg)"
							}}
						/>
					),
					click: () =>
						this.setState({ searchopen: !this.state.searchopen })
				}
			}
		];

		return (
			<div className={className} style={style}>
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
				<div
					style={{
						position: "relative",
						flex: 1,
						display: "flex",
						flexDirection: "column"
					}}
				>
					<SwipeableViews
						axis={theme.direction === "rtl" ? "x-reverse" : "x"}
						index={this.state.value}
						onChangeIndex={this.handleChangeIndex}
						containerStyle={{ height: "100%" }}
						style={{ flex: 1, overflow: "hidden" }}
						slideStyle={{ height: "100%", overflow: "hidden" }}
					>
						{pages.map((page, index) => (
							<span key={index}>{page.content}</span>
						))}
					</SwipeableViews>
					<div
						className={classes.bottom}
						style={{
							pointerEvents:
								this.state.value === 0 ? "auto" : "none"
						}}
					>
						<Slide
							direction="up"
							in={this.state.value === 0}
							timeout={transitionDuration}
							style={{
								transitionDelay: `${
									this.state.value === 0
										? transitionDuration.exit
										: 0
								}ms`,
								opacity: this.state.value === 0 ? 1 : 0
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
									}ms`,
									pointerEvents: "auto"
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
			</div>
		);
	}
}

SidebarView.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SidebarView);
