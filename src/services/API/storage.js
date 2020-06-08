import React from "react";

class Storage extends React.Component {
	constructor(props) {
		super(props);
		this.storageMethod = "SESSIONSTORAGE";
	}

	get(key) {
		switch (this.storageMethod) {
			case "SESSIONSTORAGE":
				return this.getFromBrowserSession(key);
			default:
				throw new Error("ERROR: no storagetype defined");
		}
	}

	remove(key) {
		switch (this.storageMethod) {
			case "SESSIONSTORAGE":
				this.removeFromBrowserSession(key);
				break;
			default:
				throw new Error("ERROR: no storagetype defined");
		}
	}

	set(key, value) {
		switch (this.storageMethod) {
			case "SESSIONSTORAGE":
				this.setFromBrowserSession(key, value);
				break;
			default:
				throw new Error("ERROR: no storagetype defined");
		}
	}

	// Storage type specific Implementations

	// Browser session

	getFromBrowserSession(key) {
		const value = sessionStorage.getItem(key);

		return JSON.parse(value);
	}

	removeFromBrowserSession(key) {
		return sessionStorage.removeItem(key);
	}

	setFromBrowserSession(key, value) {
		return sessionStorage.setItem(key, JSON.stringify(value));
	}
}

export { Storage };
