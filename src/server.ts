import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Resend } from "resend";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post("/api/send-email", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    await resend.emails.send({
      from: "Contact Form <contact@dmanikanta.site>", // Make sure this domain is verified in Resend
      to: "darapureddymanikanta8@gmail.com",
      subject: `New Contact Form Message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px;">New Contact Form Submission</h2>
              <div style="margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong style="color: #2c3e50;">Name:</strong> <span style="color: #34495e;">${name}</span></p>
                <p style="margin: 5px 0;"><strong style="color: #2c3e50;">Email:</strong> <span style="color: #34495e;">${email}</span></p>
              </div>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p style="margin: 0 0 10px 0;"><strong style="color: #2c3e50;">Message:</strong></p>
                <p style="color: #34495e; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error: any) {
    console.error("❌ Error sending email:");

    if (error?.response) {
      console.error("🔍 Resend API response error:");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error?.request) {
      console.error("📡 Request made but no response received:");
      console.error(error.request);
    } else {
      console.error("💥 General error message:", error.message);
    }

    res.status(500).json({ error: "Failed to send email" });
  }
});

console.log("✅ Resend API Key Loaded:", process.env.RESEND_API_KEY);

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
