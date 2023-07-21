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

const email_config = z.object({
  AWS_SES_ACCESS_KEY: z.string().nonempty(),
  AWS_SES_SECRET_ACCESS_KEY: z.string().nonempty(),
  AWS_SES_REGION: z.string().nonempty(),
  AWS_SES_DISABLE: z.boolean().optional(),
});



export function init(config: z.infer<typeof email_config>) {
  if(config.AWS_SES_DISABLE) {
    return {
      send_mail_opts: function() { return {success: true} as any },
      send_mail_aws: function() { return {success: true} as any}
    }
  }
  const v = email_config.parse(config);
  const accessKeyId = v.AWS_SES_ACCESS_KEY;
  const secretAccessKey = v.AWS_SES_SECRET_ACCESS_KEY;
  const region = v.AWS_SES_REGION;

  const clientConfig: SESClientConfig = {
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region
  };

  const client = new SESClient(clientConfig);

  return {
    async send_mail_aws(opts:z.infer<typeof sendOpts>) {
      const command = new SendEmailCommand(opts);
      return await client.send(command);
    },
    send_mail_opts(i: {to: string; subject: string; text: string}) {
      return sendOpts.safeParse({
        Source: "no-reply-scealai@abair.ie",
        Destination: {
          ToAddresses: [i.to],
        },
        Message: {
          Subject: { Data: i.subject },
          Body: { Text: { Data: i.text } },
        }
      });
    }
  }

}


function startupEmail() {
  return init(process.env as any).send_mail_aws({
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
  // await startupEmail(); // will throw error if startup email fails to send
})();
