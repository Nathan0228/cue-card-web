//使用 Resend来提示有人联系我了

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 发送邮件
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: process.env.CONTACT_RECEIVER!,
      subject: `📩 新的Cue Card联系请求来自 ${name}`,
     // reply_to: email,
      text: `
        姓名: ${name}
        邮箱: ${email}
        消息: 
            ${message}
            `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ 发送失败:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
