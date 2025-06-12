export interface SendContactEmailCommand {
  userEmail: string;
  subject: string;
  message: string;
}

export interface SendForgotPasswordEmailCommand {
  UserEmail: string;
  Code: string;
}

export interface SendEmailConfirmationCommand {
  UserEmail: string;
  Code: string;
}
