import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from "@material-ui/icons/ErrorOutlineOutlined";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		height: "100%",
		width: "100%",
		textAlign: "center"
	},
	progress: {
		margin: theme.spacing.unit * 2
	}
});

function LoadingCircle(props) {
	const { classes, message, error } = props;

	const transitionDuration = {
		enter: 500,
		exit: 0
	};

	return (
		<Fade
			in={true}
			timeout={transitionDuration}
			style={{ transitionDelay: "0ms" }}
			unmountOnExit
		>
			<div className={classes.root}>
				{error ? (
					<ErrorIcon
						color="disabled"
						fontSize="large"
						style={{ padding: 18 }}
					/>
				) : (
					<CircularProgress className={classes.progress} />
				)}
				<Typography color="textSecondary">{message}</Typography>
			</div>
		</Fade>
	);
}

LoadingCircle.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoadingCircle);
