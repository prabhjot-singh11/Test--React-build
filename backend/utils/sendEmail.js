const nodemailer   =  require('nodemailer');
const { options } = require('../app');

let EMail = "noreply@Eshoping.com";
let Name = "Eshoping"
const sendEmail =  async options =>{
//     var transport = nodemailer.createTransport({
//         host: process.env.host,
//         port: process.env.port,
//         auth: {
//           user: process.env.Email,
//           pass: process.env.pass
//         }
//       });



// const message=  {
//     from:`${process.env.FROM_NAME} <${process.env.FROM_Email}`,
//     to:options.email,
//     subject:options.subject,
//     test:options.message
// }
var transport = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: "flightbooking@mail.com",
      pass: "q7FJykrVn0CQMwxX"
    }
  });
  const message=  {
    from:`${Name},${EMail}`,
    to:options.email,
    subject:options.subject,
    text:options.message
}

await transport.sendMail(message)


}

module.exports = sendEmail