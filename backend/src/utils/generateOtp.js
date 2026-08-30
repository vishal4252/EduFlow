exports.generateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

exports.generateOtpHtml = function (otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Your OTP</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f5;
          font-family: Arial, sans-serif;
        "
      >
        <div
          style="
            max-width: 500px;
            margin: 40px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          "
        >
          <h1 style="margin-bottom: 10px; color: #18181b;">
            EduFlow
          </h1>

          <p style="color: #52525b; font-size: 16px;">
            Use the OTP below to verify your account.
          </p>

          <div
            style="
              margin: 25px 0;
              padding: 15px;
              background-color: #f4f4f5;
              border-radius: 8px;
            "
          >
            <h2
              style="
                margin: 0;
                font-size: 32px;
                letter-spacing: 8px;
                color: #18181b;
              "
            >
              ${otp}
            </h2>
          </div>

          <p style="color: #71717a; font-size: 14px;">
            This OTP is valid for a limited time. Please do not share it
            with anyone.
          </p>

          <p style="margin-top: 25px; color: #a1a1aa; font-size: 12px;">
            If you didn't request this OTP, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
};
