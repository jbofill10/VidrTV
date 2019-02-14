const paths = process.argv.length > 2 ? process.argv.slice(2) : [ "./", "./client", "./server" ];

process.stdout.write("\n\x1b[36m ●  checking dependencies...\n\n\x1b[0m");

const child_process = require("child_process");
var npm;

try {
	npm = require("global-npm");
	start();
} catch (error) {
	// install global-npm if it fails to load
	var install = child_process.spawn(process.platform === "win32" ? "npm.cmd" : "npm", [ "install", "global-npm" ]);
	install.on("exit", () => {
		npm = require("global-npm");
		start();
	});
}

function start() {
	npm.load({}, (err, npm) => {
		if (err) {
			console.error(err);
			return;
		}

		const info = {};

		// run npm outdated for each path
		paths.forEach((prefix) => {
			npm.prefix = prefix;

			npm.commands.outdated([], true, (err, data) => {
				if (err) {
					console.error(err);
					return;
				}

				info[prefix] = data;

				// the last command response
				if (Object.keys(info).length === paths.length) finished();
			});
		});

		const finished = () => {
			let total = 0;

			let filtered = paths.filter((prefix) => {
				let len = info[prefix].filter((module) => module[0].isMissing || module[2] !== module[3]).length;
				total += len;
				return len > 0;
			});

			if (filtered.length > 0) {
				console.log(
					`${"\r\033[2A"}\x1b[36m ●  Installing/Updating ${total} missing package${total > 1
						? "s"
						: ""}...\n\x1b[0m`
				);

				let complete = 0;

				filtered.forEach((path) => {
					npm.prefix = path;

					npm.commands.update([], (err, data) => {
						complete++;
						if (complete === filtered.length)
							console.log(`\n\x1b[32m ✔  All dependencies have been installed/updated\x1b[0m\n`);
					});
				});
			} else {
				console.log(`${"\r\033[1A"}\x1b[32m ✔  All dependencies are installed and up-to-date\x1b[0m\n`);
			}
		};
	});
}
