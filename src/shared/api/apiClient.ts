import axios from 'axios'
import { ApiException } from '@/shared/types/api.types'
import { ERROR_CODES } from '@/shared/constants/errorCodes'

const TOKEN_KEY = 'accessToken'

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  timeout: 10_000,
})

/* JWT 요청 인터셉터 */
apiClient.interceptors.request.use(config => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* 에러 응답 인터셉터 */
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (!axios.isAxiosError(error) || !error.response) {
      return Promise.reject(new Error('네트워크 오류가 발생했어요.'))
    }

    const { status, data } = error.response

    /* JWT 만료·무효 → 토큰 삭제 후 홈으로 이동 */
    if (
      status === 401 &&
      (data?.errorCode === ERROR_CODES.TOKEN_EXPIRED ||
        data?.errorCode === ERROR_CODES.INVALID_TOKEN)
    ) {
      tokenStorage.remove()
      window.location.href = '/'
      return Promise.reject(new ApiException(status, data))
    }

    return Promise.reject(
      new ApiException(status, data ?? { errorCode: 'UNKNOWN', errorMessage: '알 수 없는 오류가 발생했어요.' }),
    )
  },
)

export default apiClient
