export function cleanObject(obj: { [key: string]: any }){
	let cleanedObj: { [key: string]: any } = {};
	for (let key in obj) {
		if (obj[key] ?? false) {
			cleanedObj[key] = obj[key];
		}
	}
	return cleanedObj;
}
