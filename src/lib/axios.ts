import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const response = await axios.post(
                    '/auth/token/refresh/',
                    {},
                    { withCredentials: true }
                )

                const csrfToken = response.headers['x-csrftoken']
                if (csrfToken && originalRequest.headers) {
                    originalRequest.headers['X-CSRFToken'] = csrfToken
                }

                return apiClient(originalRequest)
            } catch (refreshError) {
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient
