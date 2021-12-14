import type { ApiResponse } from '../@types/apiResponse'

type JsonData = { [key: string]: any }

export default async function fetchData<T extends JsonData = JsonData>(url: string): Promise<ApiResponse<T>> {

    const request = await fetch(url)
    return request.json()

}

export async function toString(url: string) {
    
    const request = await fetch(url)
    return request.text()

}