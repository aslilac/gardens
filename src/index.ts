interface LoggerOptions {
	scopeStyle?: LoggerScopeStyle;
}

interface LoggerScopeStyle {
	color?: string;
}

class Logger {
	#scopes = new Map<string, Logger>();

	constructor(
		private readonly scopeName?: string,
		private options: LoggerOptions = {},
		private readonly _super?: Logger,
	) {}

	createLogger(scopeName: string, options?: LoggerOptions) {
		return new Logger(scopeName, options, this);
	}

	updateOptions(options: LoggerOptions) {
		this.options = {
			...this.options,
			...options,
		};
	}

	scope(name: string, ...moreNames: string[]): Logger {
		if (!this.#scopes.has(name)) {
			this.#scopes.set(name, this.createLogger(name));
		}

		const logger = this.#scopes.get(name)!;

		return moreNames.length > 0
			? logger.scope(...(moreNames as [string, ...string[]]))
			: logger;
	}

	private _getScopes(): [string, string[]] {
		if (!this._super) {
			if (!this.scopeName) return ["", []];

			return [`%c[${this.scopeName}]`, ["color: green"]];
		}

		const [scopeText, scopeStyles] = this._super._getScopes();
		return [`${scopeText}%c[${this.scopeName!}]`, [...scopeStyles, "color: #ea80fc"]];
	}

	private getScopes(): [string, string[]] {
		if (!this._super && !this.scopeName) {
			return ["", []];
		}

		const [scopeText, scopeStyles] = this._getScopes();
		return [`${scopeText}%c  `, [...scopeStyles, ""]];
	}

	info(msg: string, ...args: unknown[]) {
		const [scopeText, scopeStyles] = this.getScopes();
		console.log(`${scopeText}${msg}`, ...scopeStyles, ...args); // eslint-disable-line no-console
	}
}

export function createLogger() {
	return new Logger("");
}
