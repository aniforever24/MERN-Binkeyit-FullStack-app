import { Resend } from "resend";
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(to, sub, html) {
    const { data, error } = await resend.emails.send({
        from: 'Binkeyit <onboarding@resend.dev>',
        to: to,
        subject: sub,
        html: html
    });
    
    return { data, error };
}

export default sendVerificationEmail;