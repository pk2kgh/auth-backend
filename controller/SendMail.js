const nodemailer = require("nodemailer");
const dotenv=require("dotenv")
dotenv.config()
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.nm_us,
    pass: process.env.nm_ps,
  },
});

function initmail(toEmail,subject,content){
    const mailOption={
        from:process.env.nm_ps,
        to:toEmail,
        subject:subject,
        html:content
    };

    transporter.sendMail(mailOption,(error,info)=>{
        if(error){
            console.log("error:",error);
        }
        else{
            console.log("Email sent:",info.response);
        }
    });
}

module.exports={initmail};

