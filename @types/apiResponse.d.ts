export interface ResponseError {
	status: number
	message: string
}

export type ApiResponse<T> = T | ResponseError
