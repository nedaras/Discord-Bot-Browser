import type { JsonObject } from '../@types'

export async function fetchData<T extends JsonObject = JsonObject>(
	url: string,
	auth?: string
): Promise<T> {
	const request = await fetch(url, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(auth ? { Authorization: auth } : {}),
		},
	})
	return request.json()
}

export async function postData<T extends JsonObject = JsonObject>(
	url: string,
	data: JsonObject,
	contentType: 'json' | 'x-www-form-urlencoded' = 'json'
): Promise<T> {
	const request = await fetch(`${url}`, {
		method: 'post',
		body: contentType === 'json' ? JSON.stringify(data) : urlEncoded(data),
		headers: {
			'Content-Type': `application/${contentType}`,
			Accept: 'application/json',
		},
	})

	return request.json()
}

function urlEncoded(data: JsonObject) {
	let response = ''

	Object.keys(data).forEach((key) => (response += `${key}=${data[key]}&`))

	return response.substring(0, response.length - 1)
}
