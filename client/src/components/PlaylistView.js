import React from "react";
import { youtube } from "../youtube";

export default class PlaylistView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {}
		};
	}

	componentDidMount() {
		let data = {};
		this._isMounted = true;

		for (let i = 0; i < this.props.items.length; i++) {
			if (!this._isMounted) break;
			youtube
				.getVideoByID(this.props.items[i])
				.then(result => {
					if (this._isMounted) {
						data[this.props.items[i]] = result;

						this.setState({ data: data });
					}
				})
				.catch(console.error);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return (
			<div className="playlist-view" style={this.props.style}>
				{this.props.items.map(id => {
					if (this.state.data.hasOwnProperty(id))
						return (
							<div
								className="card playlist-item"
								key={id}
								style={{
									backgroundColor: "rgb(31, 18, 31)",
									color: "rgba(255, 255, 255, 0.747)",
									boxShadow:
										"0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
									padding: "0.15rem 1rem",
									margin: "6px 2px",
									display: "flex"
								}}
							>
								<img
									className="thumb"
									alt={this.state.data[id].title}
									src={
										this.state.data[id].thumbnails.medium
											.url
									}
									height="64"
								/>
								<div className="info">
									<h3 className="title">
										{this.state.data[id].title}
									</h3>
									<p className="channel">
										{this.state.data[id].channel.title}
									</p>
								</div>
							</div>
						);
					return (
						<div className="card playlist-item" key={id}>
							<h4>Loading...</h4>
						</div>
					);
				})}
			</div>
		);
	}
}
