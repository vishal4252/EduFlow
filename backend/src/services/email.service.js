const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async (to, subject, text, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "EduFlow <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
