function wait(ms: number) {
	return new Promise((fulfill) => setTimeout(fulfill, ms));
}

const obj = {
	a: true,
	b: {
		c: false,
	},
	d: 18,
	e: "hello",
};

async function runTest(garden, next) {
	const {
		log,
		info,
		success,
		debug,
		warning,
		warn,
		fail, // pending,
		count,
		countReset,
		time,
		timeEnd,
	} = garden.bound();

	info(
		"Attempting to get a bound instance of a bound garden should warn and return null.",
	);
	garden.bound().bound();

	garden.assert(true);
	garden.throws(() => garden.assert(false));
	garden.throws(() => garden.assert_eq(1, 2));
	garden.deny(false);
	garden.throws(() => garden.deny(true));
	// There's no problem with just returning a boolean so the inner check
	// will throw. Because that throws, the outer check will catch it and continue.
	garden.throws(() => garden.throws(() => true));

	garden.styled("This text should be styled!\n", {
		color: "#49de5a",
	});

	log(true);
	log(4);
	log(obj);
	log("Function:", (x) => x + 5);
	log("RegExp:", /hello/gi);
	log("Object:", obj, "Boolean:", true);
	success("Hello champion!");
	warning("Hello warning!");
	warn("Hello warn!");
	fail("Oh no!", "\n");

	// await pending( 'Fetching resource', fulfill => {
	//   setTimeout( fulfill, 1000 );
	// });

	// try {
	//   await pending( 'Fetching resource', ( fulfill, reject ) => {
	//     setTimeout( reject, 300 );
	//   });
	// }
	// catch {
	//   fail( 'Resource failed to load.' );
	// }

	debug("Hello debug sailor?");
	garden.trace("This should trace, but only when verbose");

	garden.error("This is an error!");
	garden.typeerror("This is a typeerror!");
	garden.referenceerror("This is a referenceerror!");

	garden.catch("This should create an error");

	count();
	count();
	count(null, "Should be the same counter as the two above");

	count("count", "Should start at 1");
	count("count", "because it uses a string");

	count(2);
	count(2);
	info("Resetting count...");
	countReset(2);
	count(2);
	count(2);

	const secret = Symbol("sailor");
	count(secret);
	count(secret, "\n");

	time(3);
	timeEnd(3);

	time("333ms");
	await wait(333);
	timeEnd("333ms");

	const immediate = Symbol("immediate");
	time(immediate);
	time(immediate);
	timeEnd(immediate);
	timeEnd(immediate);
	timeEnd(immediate, "\n"); // Should only throw warning on third time

	next();
}

function testGardens(output, ...list) {
	if (list.length < 1) throw new Error("No garden given!");

	output.info("Warming up for tests");

	return new Promise((fulfill) => {
		function iterate(index) {
			output.raw("\n\n");
			output.log(`Beginning test #${index + 1}\n`);

			runTest(list[index], () => {
				if (++index < list.length) return iterate(index);

				output.raw("\n\n");
				output.success("Done! Tests probably passed!");
				output.info("Note that seeing errors above does not indicate a fail");
				output.info("Some tests are designed to check error handling behavior");
				fulfill();
			});
		}

		iterate(0);
	});
}

export default function tests(gardens, options?) {
	const fresh = gardens.createScope(null, options);

	const manager = fresh.createManager("manager", {
		scopeStyle: {
			backgroundColor: "#474747",
			borderRadius: "3px",
			fontWeight: 700,
			padding: "0.15em",
			marginRight: "0.15em",
		},
	});

	const customGarden = manager.scope("customized").configure({
		displayTime: true,
		displayDate: true,
		scopeStyle: {
			backgroundColor: "#474747",
			borderRadius: "3px",
			color: "#a0bef2",
			fontWeight: 700,
			fontStyle: "italic",
			padding: "0.15em",
			textDecoration: "underline",
		},
		verbose: true,
	});

	const nestedGarden = customGarden.createScope("nested", {
		scopeStyle: {
			color: "#393ac1",
			textDecoration: "line-through underline",
		},
	});

	return testGardens(fresh, fresh, nestedGarden);
}
