import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import { Loader } from "../components";

const styles = theme => ({
	root: {
		width: "100%",
		height: "100%",
		position: "relative",
		maxWidth: 500,
		backgroundColor: theme.palette.background.paper
	},
	list: {
		position: "absolute",
		width: "100%",
		top: 0,
		left: 0,
		bottom: 0,
		overflowY: "auto",
		paddingTop: 8,
		display: "flex",
		flexDirection: "column"
	},
	search: {
		position: "absolute",
		width: "100%",
		height: "100%",
		left: 0,
		background: theme.palette.background.paper
	},
	searchinputbar: {
		margin: "12px 12px",
		background: "rgba(255,255,255,0.08)"
	},
	form: {
		display: "flex"
	},
	input: {
		marginLeft: 14,
		flex: 1
	}
});

const cardstyles = theme => ({
	card: {
		background: "rgba(255,255,255,0.02)",
		display: "flex",
		flexDirection: "row",
		padding: "6px 8px",
		margin: "2px 0",
		borderRadius: 0,
		height: 60,
		boxShadow: "none"
	},
	thumb: {
		width: "106px",
		height: "60px"
	},
	details: {
		flex: 1,
		padding: "4px 18px"
	},
	title: {
		padding: 0,
		overflow: "hidden",
		textOverflow: "ellipsis",
		maxHeight: "2.5rem"
	},
	header: {
		padding: "8px 18px 0px 18px"
		// textAlign: "center"
	}
});

const MediaCard = withStyles(cardstyles)(({ style, children, ...props }) => {
	const { id, cache, index, classes } = props;

	if (!cache.hasOwnProperty(id))
		return (
			<Card>
				<Typography className={classes.title} color="textSecondary">
					Loading...
				</Typography>
			</Card>
		);

	return (
		<div>
			{index < 2 ? (
				<Typography className={classes.header} variant="overline">
					{index === 0 ? "Now Playing" : "Up Next"}
				</Typography>
			) : (
				""
			)}
			<Card
				className={classes.card}
				// raised={index === 0}
			>
				<CardMedia
					className={classes.thumb}
					image={cache[id].thumbnails.medium.url}
					title={cache[id].title}
				/>
				<CardContent className={classes.details}>
					<Typography className={classes.title} color="textPrimary">
						{cache[id].title}
					</Typography>
					<Typography
						className={classes.channel}
						color="textSecondary"
					>
						{cache[id].channel.title}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
});

class PlaylistView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {}
		};
	}

	render() {
		const { classes, theme, searchopen } = this.props;
		const { room, mediacache } = this.props.roomview.state;

		if (
			!room ||
			!room.media ||
			!room.media.every(e => mediacache.hasOwnProperty(e))
		)
			return (
				<div className={classes.root}>
					<Loader />
				</div>
			);

		const { easing, duration } = theme.transitions;

		return (
			<div className={classes.root}>
				<div
					className={classes.list}
					style={{
						transition: `opacity ${
							searchopen
								? duration.enteringScreen
								: duration.leavingScreen
						}ms`,
						opacity: searchopen ? 0 : 1
					}}
				>
					{room.media
						.slice(room.cur)
						.concat(room.media.slice(0, room.cur))
						.map((id, index) => {
							return (
								<MediaCard
									index={index}
									cache={mediacache}
									id={id}
									key={index}
								/>
							);
						})}
				</div>
				<Paper
					elevation={1}
					className={classes.search}
					style={{
						transition: `all ${
							searchopen
								? duration.enteringScreen
								: duration.leavingScreen
						}ms ${searchopen ? easing.easeOut : easing.easeIn} 0ms`,
						top: searchopen ? "0%" : "100%",
						opacity: searchopen ? 1 : 0.5
					}}
				>
					<Paper elevation={0} className={classes.searchinputbar}>
						<form
							className={classes.form}
							noValidate
							autoComplete="off"
							onSubmit={this.onSubmit}
						>
							<InputBase
								className={classes.input}
								placeholder="Search YouTube"
							/>
							<IconButton
								className={classes.iconButton}
								aria-label="Search"
							>
								<SearchIcon />
							</IconButton>
						</form>
					</Paper>
				</Paper>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PlaylistView);
