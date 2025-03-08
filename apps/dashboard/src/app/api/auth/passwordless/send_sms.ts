import { authenticationClient } from "@/lib/authok";
import { NextRequest, NextResponse } from "next/server";

export type VCodeReq = {
  country_code: string;
  phone_number: string;
}

export async function POST(
  req: NextRequest,
) {
  const vcodeReq = req.body as VCodeReq;

  console.log('发送验证码: ', vcodeReq);

  const response = await authenticationClient.requestSMSCode({
    phone_number: vcodeReq.phone_number,
  });

  console.log('验证码发送结果: ', response);
  return new NextResponse("OK", { status: 200 });
}