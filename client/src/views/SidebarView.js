import React from "react";
import Radium from "radium";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { ChatView, PlaylistView } from "./";

const styles = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		width: 380
	}
});

@Radium
class SidebarView extends React.Component {
	state = {
		value: 1
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};

	render() {
		const { classes, theme, style, roomview } = this.props;

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
						<Tab label="Chat" />
						<Tab label="Playlist" />
					</Tabs>
				</AppBar>
				<SwipeableViews
					axis={theme.direction === "rtl" ? "x-reverse" : "x"}
					index={this.state.value}
					onChangeIndex={this.handleChangeIndex}
				>
					<ChatView roomview={roomview} />
					<PlaylistView roomview={roomview} />
				</SwipeableViews>
			</div>
		);
	}
}

SidebarView.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SidebarView);
