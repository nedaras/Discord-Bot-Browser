type JsonData = { [key: string]: any }

export default async function fetchData<T extends JsonData = JsonData>(url: string): Promise<T> {

    const request = await fetch(url)
    return request.json()

}