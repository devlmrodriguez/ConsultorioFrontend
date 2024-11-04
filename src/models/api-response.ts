export interface ApiResponse<TContent> {
  statusCode: number;
  success: boolean;
  message: string;
  content?: TContent;
}
