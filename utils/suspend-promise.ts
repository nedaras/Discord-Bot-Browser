export type PromiseSuspender<T> = { call: () => T }

export default function <T>(promise: () => Promise<T>): PromiseSuspender<T> {
    
    let data: T | undefined
    const suspender = promise().then((result) => (data = result))

    return {

        call: () => {

            if (data !== undefined) return data
            throw suspender

        }

    }

}