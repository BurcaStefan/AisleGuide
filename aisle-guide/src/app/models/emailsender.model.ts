export interface SendContactEmailCommand {
  userEmail: string;
  subject: string;
  message: string;
}

export interface SendForgotPasswordEmailCommand {
  email: string;
}

export interface SendEmailConfirmationCommand {
  email: string;
  userId: string;
}
