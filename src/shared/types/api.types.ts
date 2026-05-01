import type { ErrorCode } from '@/shared/constants/errorCodes'

export interface ApiError {
  errorCode: ErrorCode | string
  errorMessage: string
  validation?: Record<string, string>
}

export class ApiException extends Error {
  readonly errorCode: string
  readonly errorMessage: string
  readonly validation?: Record<string, string>
  readonly status: number

  constructor(status: number, body: ApiError) {
    super(body.errorMessage)
    this.errorCode = body.errorCode
    this.errorMessage = body.errorMessage
    this.validation = body.validation
    this.status = status
  }
}
