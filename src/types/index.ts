export * from './interview';

export * from './vapi';

export * from './feedback';

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

export interface TechIconProps {
  techStack: string[];
}

interface BaseResponse {
  timestamp: string;
  statusCode: number;
}

export interface APIResponse<T> extends BaseResponse {
  success: true;
  data: T;
  message?: string;
}

export interface APIErrorResponse extends BaseResponse {
  success: false;
  error: string;
}
