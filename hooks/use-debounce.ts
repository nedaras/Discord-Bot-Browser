import { DependencyList, useEffect } from 'react'
import useTimeout from './use-timeout'

export default function useDebaunce(callback: () => void, delay: number, dependecies: DependencyList) {
	const [reset, clear] = useTimeout(callback, delay)
	useEffect(reset, [...dependecies, reset])
	useEffect(clear, [])
}
