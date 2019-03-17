import { Component } from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { withTheme } from "@material-ui/core/styles";
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

@withTheme()
class SidebarView extends Component {
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
		const { theme, style, roomview } = this.props;

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
			<div
				css={[
					{
						position: "relative",
						backgroundColor: theme.palette.background.paper,
						width: 380,
						overflow: "hidden"
					},
					style
				]}
			>
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
						style={{
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
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
								style={{
									flex: 0,
									padding: `${theme.spacing.unit}px ${theme
										.spacing.unit * 12}px ${
										theme.spacing.unit
									}px ${theme.spacing.unit}px`
								}}
								noValidate
								autoComplete="off"
								onSubmit={this.onSubmit}
							>
								<TextField
									id="outlined-full-width"
									variant="outlined"
									label="Message"
									style={{
										margin: "8px 12px 6px 8px"
									}}
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
									style={{
										position: "absolute",
										bottom: theme.spacing.unit * 2,
										right: theme.spacing.unit * 2
									}}
									disabled={
										page.name === "Chat" &&
										this.state.input.length === 0
									}
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

export default SidebarView;
