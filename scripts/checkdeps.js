const paths = [ '.', './client', './server' ];

process.stdout.write('\n\x1b[36m ●  checking dependencies...\n\x1b[0m');

const child_process = require('child_process');
var npm;

try {
	npm = require('global-npm');
	start();
} catch (error) {
	var install = child_process.spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', [ 'install', 'global-npm' ]);
	install.on('exit', () => {
		npm = require('global-npm');
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

		paths.forEach((prefix) => {
			npm.prefix = prefix;

			npm.commands.outdated([], true, (err, data) => {
				if (err) {
					console.error(err);
					return;
				}

				info[prefix] = data;

				if (Object.keys(info).length === paths.length) finished();
			});
		});

		const finished = () => {
			let total = 0;

			paths.forEach((prefix) => {
				info[prefix].forEach((module) => {
					// if missing
					if (module[0].isMissing) total++;
					else if (module[2] !== module[3])
						// if version does not match specified version
						total++;
					// process.stdout.write(`${module[0].isMissing ? '' : ''}${module[0].name}`);
				});
			});

			if (total > 0) {
				console.log(
					`${'\r\033[1A'}\x1b[36m ●  Installing ${total} missing package${total > 1 ? 's' : ''}...\x1b[0m`
				);

				npm.prefix = '.';

				npm.commands.install([], (err, data) => {
					console.log(`\n\x1b[32m ✔  All dependencies have been installed\x1b[0m\n`);
				});
			} else {
				console.log(`${'\r\033[1A'}\x1b[32m ✔  All dependencies are installed\x1b[0m\n`);
			}

			// if (data.length === 0) {
			// process.stdout.write('\r\033[1A \x1b[32m ✔  All dependencies are up to date\n');
			// } else {
			// }
		};
	});
}
