export interface SmsProvider {
  sendOTP(phone: string, otp: string): Promise<void>;
}

//Console provider for development and testing purposes
class ConsoleProvider implements SmsProvider {
  async sendOTP(phone: string, otp: string) {
    console.log(`OTP ${phone}:${otp}`);
  }
}

export const smsProvider = new ConsoleProvider();
