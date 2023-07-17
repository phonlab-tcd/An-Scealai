import { SESClient, SESClientConfig, SendEmailCommand } from "@aws-sdk/client-ses";
import { z } from "zod";

const sendOpts = z.object({
  Source: z.string().email(),
  Destination: z.object({
    ToAddresses: z.array(z.string().email()),
  }),
  Message: z.object({
    Subject: z.object({
      Data: z.string(),
    }),
    Body: z.object({
      Text: z.object({
        Data: z.string(),
      }),
    }),
  }),
}).strict();

const accessKeyId = z.string().parse(process.env.AWS_SES_ACCESS_KEY);
const secretAccessKey = z.string().parse(process.env.AWS_SES_SECRET_ACCESS_KEY);
const region = z.string().parse(process.env.AWS_SES_REGION);

const clientConfig: SESClientConfig = {
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region
};


const client = new SESClient(clientConfig);

export async function send_mail_aws(opts:z.infer<typeof sendOpts>) {
  const v = sendOpts.safeParse(opts);
  if(!v.success) return v; // propogate error
  const command = new SendEmailCommand(v.data);
  return await client.send(command);
};

export function send_mail_opts(i: {to: string; subject: string; text: string}) {
  return {
    Source: "scealai@abair.ie",
    Destination: {
      ToAddresses: [i.to],
    },
    Message: {
      Subject: { Data: i.subject },
      Body: { Text: { Data: i.text } },
    }
  }
}


function startupEmail() {
  return send_mail_aws({
    Source: "scealai-monitor@abair.ie",
    Destination: { ToAddresses: ["scealai.info@gmail.com", "nrobinso@tcd.ie"]},
    Message: {
      Subject: { Data: "scealai email service startup" },
      Body: { Text: { Data: `scealai email microservice has started` } },
    }
  })
}

(async function main() {
  try { await startupEmail() }
  catch(e) {console.log("AWS SES EMAIL SERVICE: expected startup error ocurred (for some reason the first email always fails)")};
  await startupEmail(); // shutdown if this fails
})();

