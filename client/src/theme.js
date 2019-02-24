import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
	palette: {
		type: "dark",
		primary: {
			main: "#c78bff"
		},
		secondary: {
			main: "#0097a7"
		},
		background: {
			default: "#110c16",
			paper: "#2c2834"
		},
		grey: {
			900: "#2c2834"
		}
	},
	overrides: {
		MuiTabs: {
			indicator: {
				borderRadius: "2px 2px 0 0",
				transform: "scaleX(0.9)"
			}
		}
	},
	typography: {
		useNextVariants: true
	}
});

export default theme;
