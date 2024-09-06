import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendVerificationRequest = async (email, token) => {
  try {
    await resend.emails.send({
      from: "Webby Finanzas <onboarding@resend.dev>",
      to: email,
      subject: "¡Confirma tu correo electrónico!",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #4CAF50;">¡Bienvenido a Webby Finanzas Personales!</h2>
        <p>Estamos emocionados de tenerte a bordo. Por favor, confirma tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>
        <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}"
           style="display: inline-block; padding: 10px 20px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Verificar mi correo
        </a>
        <p style="margin-top: 20px;">Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
        <p><a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}"
              style="color: #4CAF50;">
          ${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}
        </a></p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>Gracias,</p>
        <p>El equipo de Webby</p>
      </div>
    `,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
    };
  }
};