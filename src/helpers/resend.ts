import { Resend } from "resend";

export default async function mailHelper({
  recipient,
  subject,
  body,
}: {
  recipient: string | string[];
  subject: string;
  body: string;
}) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
          return resend.emails.send({
            from: "Stats Tracker <onboarding@resend.dev>",
            to: recipient,
            subject: subject,
            html: body,
          });
    
        
    } catch (error) {
        console.log(error)
        
    }

  

}



