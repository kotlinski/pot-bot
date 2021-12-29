import nodemailer from 'nodemailer';

export async function sendMail(draw) {
  // Create a SMTP transporter object
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pot.bot.robot@gmail.com',
      pass: 'q@ns*kTEUXfTC4MGbeCw',
    },
  });

  // Message object
  let message = {
    from: 'Pot-Bot <pot.bot.robot@gmail.com>',

    // Comma separated list of recipients
    to: 'Simon Kotlinski <simon.kotlinski@gmail.com>',

    // Subject of the message
    subject: `${draw.productName} - ${draw.drawNumber} ✔`,

    // plaintext body
    text: 'Hello to myself!',

    // HTML body
    html: `<p><b>Hello!</b></p>` + `<p>Here\\'s the latest draw just before deadline: ${draw.closeTime}<br/></p>`,

    // An array of attachments
    attachments: [
      // String attachment
      {
        filename: `${draw.drawNumber}.json`,
        content: 'Some notes about this e-mail',
        contentType: 'text/plain', // optional, would be detected from the filename
      },
    ],
  };

  let info = await transporter.sendMail(message);
  console.log('Message sent successfully as %s', info.messageId);
}

/*

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
*/
