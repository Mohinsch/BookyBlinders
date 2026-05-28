export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: ValidationErrorDetail[];
}
