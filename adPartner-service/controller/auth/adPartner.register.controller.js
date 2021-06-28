const AdvertismentPartnerModel = require("../../../Database/AdvertismentPartner.Service.DB/advertismentPartnerSchema");
const AdvertismentPartnerOTPModel = require("../../../Database/AdvertismentPartner.Service.DB/advertismentpartnerOTPSchema");

const { mongooseErrorHandler } = require("../../../Database/Error/DB.Error");

const transporter = require("../../../Helper/Nodemailer/nodemailer.Helper");

exports.advertismentPartnerRegister = async (req, res) => {
  const { Email, Password, OrganisationName, ServiceProvider, Address } =
    req.body;
  console.log(req.body);
  try {
    const Advertiser = await AdvertismentPartnerModel.create({
      Email,
      Password,
      OrganisationName,
      ServiceProvider,
      Address,
    });
    console.log(Advertiser);
    const OTP = await Math.floor(1000 + Math.random() * 9000);
    console.log(OTP);
    const AdvertismentPartnerOTP = await AdvertismentPartnerOTPModel.create({
      OTP: OTP,
      userID: Advertiser._id,
    });
    console.log(AdvertismentPartnerOTP);
    const mailOption = {
      from: process.env.user,
      to: Email,
      subject: `TaxiTop Advertisment Partner Verification`,
      html: `<h1>Account Verification</h1><br><hr>
            <br><a>Your OTP is: ${OTP}</a>`,
    };
    const mail = transporter.transporter.sendMail(mailOption);
    if (MediaPartner && MediaPartnerOTP && mail) {
      return res.json({
        message: "We have Sent You OTP in Your Mail Please Verify",
        status: true,
        Advertiser: Advertiser,
        userID: Advertiser._id,
      });
    } else {
      return res.json({ message: "Internal Server Error", status: false });
    }
  } catch (error) {
    console.log(error);
    const errors = await mongooseErrorHandler(error);
    console.log(errors);
    return res.json(errors);
  }
};
