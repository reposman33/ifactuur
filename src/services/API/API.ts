export default class Api {
	// TODO: implement a real backend instead of local storage...
	public static savePage(data: { [page: string]: any }) {
		const _page: string = Object.keys(data)[0];
		const _data: any = JSON.stringify(data[_page]);
		localStorage.setItem(_page, _data);
	}

	public static getPage(page: string): string | null {
		const data = localStorage.getItem(page);
		if (data) {
			return JSON.parse(data);
		}
		return null;
	}
}
