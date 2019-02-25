import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Loader } from "../components";

const styles = theme => ({
	root: {
		width: "100%",
		maxWidth: 500,
		backgroundColor: theme.palette.background.paper
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
		const { classes } = this.props;
		const { room, mediacache } = this.props.roomview.state;

		console.log();

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

		return (
			<div
				className={classes.root}
				style={{
					paddingTop: 8,
					display: "flex",
					flexDirection: "column"
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
		);
	}
}

export default withStyles(styles)(PlaylistView);
