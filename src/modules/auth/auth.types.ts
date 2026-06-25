// RegisterDto
// VerifyOtpDto
// SendOtpDto
// LoginResponse
export interface RegisterDto {
  name: string;
  email?: string;
  phoneNumber: string;
  otp: string;
}
