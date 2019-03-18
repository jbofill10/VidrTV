import { createMuiTheme } from "@material-ui/core/styles";

const patterns = [
	"repeating-radial-gradient(circle at 10000px 12020px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 128px, rgba(245,245,245,1) 128px, rgba(245,245,245,1) 256px), repeating-radial-gradient(circle at -12020px -11000px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 128px, rgba(245,245,245,1) 128px, rgba(245,245,245,1) 256px),repeating-radial-gradient(circle at 11200px 10000px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 100px, rgba(240,240,240,1) 100px, rgba(245,245,245,1) 200px)",

	"repeating-radial-gradient(circle at 9000px 180040px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 128px, rgba(245,245,245,1) 128px, rgba(245,245,245,1) 256px), repeating-radial-gradient(circle at -12025px -110000px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 128px, rgba(245,245,245,1) 128px, rgba(245,245,245,1) 256px),repeating-radial-gradient(circle at 11200px 100000px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 100px, rgba(240,240,240,1) 100px, rgba(245,245,245,1) 200px)",

	"repeating-radial-gradient(circle at 0px -12020px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 128px, rgba(245,245,245,1) 128px, rgba(245,245,245,1) 256px), repeating-radial-gradient(circle at 0px -11000px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 128px, rgba(245,245,245,1) 128px, rgba(245,245,245,1) 256px),repeating-radial-gradient(circle at 0px -19000px, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 100px, rgba(240,240,240,1) 100px, rgba(245,245,245,1) 200px)"
];

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
			default: "#221f28",
			paper: "#2c2834",
			grad1: `radial-gradient(circle at 50% 120%, #6200ea, #311b92), ${
				patterns[0]
			}`,
			grad2: `radial-gradient(circle at 90% 125%, #0097A7, #311b92), ${
				patterns[1]
			}`,
			grad3: `radial-gradient(circle at 50% 50000px, #6200EA, #221f28), ${
				patterns[2]
			}`
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
