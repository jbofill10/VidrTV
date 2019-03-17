/** @jsx jsx */
import { jsx } from "@emotion/core";
import { withTheme } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import "whatwg-fetch";

export default withTheme()(({ ...props }) => (
	<div
		css={{
			background: "rgba(170,0,255 ,1)",
			color: "rgba(255, 255, 255, 0.8)",
			position: "relative",
			transition: "all 0.15s",
			overflow: "hidden",
			"&:hover": {
				color: "rgba(255, 255, 255, 0.9)",
				"img.thumb": {
					opacity: 1
				}
			},
			width: 480,
			height: 180,
			margin: 8,
			borderRadius: 6,
			[props.theme.breakpoints.down("xs")]: {
				width: "100%",
				height: 196,
				margin: 0,
				borderRadius: 0
			}
		}}
		{...props}
	>
		<img
			className="thumb"
			src={`https://i.ytimg.com/vi/${
				props.room.media[props.room.cur]
			}/mqdefault.jpg`}
			alt="now playing thumb"
			css={{
				opacity: 0.8,
				transition: "all 0.2s",
				position: "absolute",
				right: 0,
				width: "auto",
				height: "100%"
			}}
		/>
		<div
			style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				background:
					"linear-gradient(100deg, rgba(124,77,255 ,1) 40%, rgba(170,0,255 ,.1) 100%)"
			}}
		/>
		<div
			className="room-item-info"
			style={{
				display: "flex",
				flexDirection: "column",
				position: "absolute",
				width: "100%",
				height: "100%"
			}}
		>
			<div
				style={{
					flex: 1,
					display: "inline-flex",
					flexDirection: "column",
					padding: "12px 12px"
				}}
			>
				<h3 style={{ fontSize: 24, margin: 12 }}>{props.room.name}</h3>
				<p
					style={{
						fontSize: 14,
						margin: 12,
						flex: 1,
						opacity: 0.8
					}}
				>
					Now Playing <span>{props.room.media[props.room.cur]}</span>
				</p>
			</div>
			<div
				style={{
					// background: 'rgba(16,16,16,0.1)',
					padding: 12,
					display: "flex"
				}}
			>
				<div
					style={{
						display: "flex",
						flex: 1,
						margin: 6
					}}
				>
					{
						//TODO: get user icons
					}
					{["", "", ""].map(ProfileCircle)}
				</div>
				<NavLink
					to={`/r/${props.room._id}`}
					style={{
						display: "inline-block",
						background: "rgba(56, 51, 66, 0.5)",
						color: "rgb(242,242,242)",
						verticalAlign: "middle",
						textAlign: "center",
						height: 36,
						padding: "0 16px 0 16px",
						lineHeight: "36px",
						fontSize: 14,
						textTransform: "uppercase",
						userSelect: "none",
						borderRadius: 4
					}}
				>
					JOIN ROOM
				</NavLink>
			</div>
		</div>
	</div>
));

const ProfileCircle = (icon, key, all) => (
	<div
		className="profile-icon"
		style={{
			background: "#512DA8",
			width: 24,
			height: 24,
			borderRadius: 12,
			marginRight: -9,
			zIndex: all.length - key
		}}
		key={key}
	/>
);
