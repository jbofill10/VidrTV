import React from "react";
import { NavLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

export default class DefaultView extends React.Component {
	componentDidMount() {
		document.title = "Vidr.tv";
	}

	render() {
		return (
			<div
				className="center"
				style={{
					position: "absolute",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0
				}}
			>
				<div className="logo" style={{ color: "#FFF", fontSize: 64 }}>
					<span style={{ fontSize: 96 }}>Vidr</span>.tv
				</div>
				<Typography
					variant="h5"
					style={{ margin: "0px 12px 28px 12px", maxWidth: 600 }}
				>
					{"Experience Together"}
				</Typography>
				<div>
					<NavLink
						to="/join"
						style={{
							display: "inline-block",
							background: "rgba(56, 51, 66, 0.5)",
							color: "rgb(242,242,242)",
							verticalAlign: "middle",
							textAlign: "center",
							height: 36,
							padding: "0 16px 0 16px",
							margin: 6,
							lineHeight: "36px",
							fontSize: 14,
							textTransform: "uppercase",
							userSelect: "none",
							borderRadius: 4
						}}
					>
						JOIN ROOM
					</NavLink>
					<NavLink
						to="/create"
						style={{
							display: "inline-block",
							background: "rgba(56, 51, 66, 0.5)",
							color: "rgb(242,242,242)",
							verticalAlign: "middle",
							textAlign: "center",
							height: 36,
							padding: "0 16px 0 16px",
							margin: 6,
							lineHeight: "36px",
							fontSize: 14,
							textTransform: "uppercase",
							userSelect: "none",
							borderRadius: 4
						}}
					>
						CREATE ROOM
					</NavLink>
				</div>
			</div>
		);
	}
}
