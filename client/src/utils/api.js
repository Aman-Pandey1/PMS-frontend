import axios from 'axios'

const instance = axios.create({
	baseURL: '/api'
})

let currentToken = null

instance.interceptors.request.use((config) => {
	if (currentToken) {
		config.headers.Authorization = `Bearer ${currentToken}`
	}
	return config
})

export default {
	get: (url, config) => instance.get(url, config),
	post: (url, data, config) => instance.post(url, data, config),
	put: (url, data, config) => instance.put(url, data, config),
	delete: (url, config) => instance.delete(url, config),
	setToken: (token) => { currentToken = token }
}