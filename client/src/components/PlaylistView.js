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
							<div className="card playlist-item" key={id}>
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
