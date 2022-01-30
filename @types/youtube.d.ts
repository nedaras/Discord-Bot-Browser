export interface Snippet {
	title: string
	channelTitle: string
	thumbnails: {
		default: {
			url: string
			width: number
			height: number
		}
	}
}

export interface VideoApiResponse {
	items:
		| [
				{
					id: string
					snippet: Snippet
				}
		  ]
		| [undefined]
}

export interface SearchApiResponse {
	items:
		| [
				{
					id: {
						videoId: string
					}
					snippet: Snippet
				}
		  ]
		| [undefined]
}

export interface ErrorApiResponse {
	error: {
		code: number
		message: string
		error: {
			message: string
			domain: string
			reason: string
		}
	}
}
