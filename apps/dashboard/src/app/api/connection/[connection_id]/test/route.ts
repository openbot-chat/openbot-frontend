import { NextRequest, NextResponse } from "next/server"
import { client } from '@/server/api/openbot-js'
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "@/server/auth/options"
import { cookies } from "next/headers"
import { Cookie, Profile, makeRequest } from '@openbot/app-runtime'
import * as checks from '@openbot/app-runtime/src/lib/actions/callback/oauth/checks'
import { Account, TokenSet } from '@openbot/app-runtime'
import { parse as parseCookie } from "cookie"
import * as o from "oauth4webapi"
import { OAuthCallbackError } from "@openbot/app-runtime/src/errors"
import { 
  client as openbotClient,
} from '@/server/api/openbot-js';
import { Credentials } from "models"


const render = () => `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <style type="text/css" media="screen">
      html {
        line-height: 1;
      }
      
      ol, ul {
        list-style: none;
      }
      
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      
      caption, th, td {
        text-align: left;
        font-weight: normal;
        vertical-align: middle;
      }
      
      q, blockquote {
        quotes: none;
      }
      
      q:before, q:after, blockquote:before, blockquote:after {
        content: "";
        content: none;
      }
      
      a img {
        border: none;
      }
      
      article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section, summary {
        display: block;
      }
    
      html, body {
        background-color: #F0F0F0;
        text-align: center;
        font-family: 'Open Sans', Helvetica, arial, sans-serif;
        color: #333;
      }
  
      h1 {
          font-size: 30px;
          font-weight: 300;
          color: #666;
          margin: 0 0 20px;
          -webkit-font-smoothing: antialiased;
      }
  
      p {
        font-size: 18px;
        font-weight: 300;
        margin: 20px 0;
      }
  
      .logo {
        margin: 40px;
      }
  
      .logo img {
        width: 50px;
        height: 50px;
      }
  
      a.orange {
        background-color: rgb(255, 92, 26);
        border-bottom-color: rgb(255, 92, 26);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-image-outset: 0px;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-left-color: rgb(255, 92, 26);
        border-left-style: solid;
        border-left-width: 1px;
        border-right-color: rgb(255, 92, 26);
        border-right-style: solid;
        border-right-width: 1px;
        border-top-color: rgb(255, 92, 26);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-top-style: solid;
        border-top-width: 1px;
        box-sizing: border-box;
        color: rgb(255, 255, 255);
        cursor: pointer;
        display: inline-block;
        font-family: 'Open Sans', Helvetica, arial, sans-serif;
        font-size: 14px;
        height: 40px;
        line-height: 14px;
        margin-bottom: 0px;
        margin-left: 0px;
        margin-right: 0px;
        margin-top: 0px;
        padding-bottom: 12px;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 12px;
        text-decoration: none solid rgb(255, 255, 255);
        text-shadow: rgb(230, 67, 0) 0px -1px 0px;
        vertical-align: baseline;
        white-space: nowrap;
      }
  
      a.white {
        background-color: rgb(245, 245, 245);
        background-image: -webkit-linear-gradient(top, rgb(255, 255, 255), rgb(245, 245, 245));
        border-bottom-color: rgb(214, 214, 214);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-image-outset: 0px;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-left-color: rgb(214, 214, 214);
        border-left-style: solid;
        border-left-width: 1px;
        border-right-color: rgb(214, 214, 214);
        border-right-style: solid;
        border-right-width: 1px;
        border-top-color: rgb(214, 214, 214);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-top-style: solid;
        border-top-width: 1px;
        box-sizing: border-box;
        color: rgb(85, 85, 85);
        cursor: pointer;
        display: inline-block;
        font-family: 'Open Sans', Helvetica, arial, sans-serif;
        font-size: 14px;
        height: 40px;
        line-height: 14px;
        margin-bottom: 0px;
        margin-left: 0px;
        margin-right: 0px;
        margin-top: 0px;
        padding-bottom: 12px;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 12px;
        text-align: left;
        text-decoration: none solid rgb(85, 85, 85);
        text-shadow: rgb(255, 255, 255) 0px 1px 0px;
        vertical-align: baseline;
        white-space: nowrap;
      }
  
      .message{
        padding: 0 0 20px;
      }
    </style>
  </head>
  <body>
    <div class="logo">
      <img src="" title="Openbot logo"></img>
    </div>
  
    <div class="message">
      <h1>Success!</h1>
      <p>Your account has been successfully connected to Openbot. Please go to <a href="https://dashboard.openbot.chat/credentials">Credentials</a> to get started.</p>
    </div>
  
    <script type="text/javascript">
      // Make sure this code works even if no authentication context is provided,
      // because for google 1-click auth, it's not applicable.
      try {
        window.opener.postMessage(
          {
            type: 'success',
          },
          '*'
        );
      } catch (err) {
        console.log(err);
      }
      window.close();
    </script>  
  </body>
</html>
`



export async function GET(
  request: NextRequest,
) {
  const html = render()

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    }
  })
}