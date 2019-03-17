import React from "react";
import { withTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from "@material-ui/icons/ErrorOutlineOutlined";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";

function LoadingCircle(props) {
	const { theme, message, error } = props;

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
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					height: "100%",
					width: "100%",
					textAlign: "center"
				}}
			>
				{error ? (
					<ErrorIcon
						color="disabled"
						fontSize="large"
						style={{ padding: 18 }}
					/>
				) : (
					<CircularProgress
						style={{
							margin: theme.spacing.unit * 2
						}}
					/>
				)}
				<Typography color="textSecondary">{message}</Typography>
			</div>
		</Fade>
	);
}

export default withTheme()(LoadingCircle);
