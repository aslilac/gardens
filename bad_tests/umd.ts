import gardens from "..";
import tests from "./tests";

tests(gardens);

if (typeof document !== "undefined") {
	const container = document.getElementById("output");
	const stream = {
		write(output: string) {
			container.innerHTML += output;
		},
	};

	tests(gardens, {
		stream,
		outputType: "html",
	});
}
