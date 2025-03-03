import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

export const emailVerify = async (req, res) => {
  const { email, emailCode } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid user" });
  }
  if (user.emailCode !== emailCode) {
    return res.status(400).json({ message: "Invalid code" });
  }
  user.verified = true;
  user.emailCode = "";
  await user.save();
  res.status(200).json({ message: "Email verified successfully" });
};

export const twoFaSetup = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the user
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const secret = speakeasy.generateSecret();

    // Save the secret and enable 2FA for the user
    user.twoFASecret = secret.base32;
    user.isTwoFAEnabled = true;
    await user.save();

    // Generate the OTP URL for the QR code
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: encodeURIComponent(user.email), // Encode special characters in the email
      issuer: "To do ", // Use your app's name
    });

    const imageUrl = await qrcode.toDataURL(url);
    const qrCodeBuffer = await qrcode.toBuffer(url);

    // Return the QR code image URL (avoid sending the secret to the client)
    res.status(200).json({ secret: secret.base32, imageUrl });
  } catch (error) {
    console.error("Error in twoFaSetup:", error);
    res.status(500).json({ message: "Server error during 2FA setup" });
  }
};

export const twoFaSetupVerify = async (req, res) => {
  console.log(new Date());
  try {
    const { id, token } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (!user.twoFASecret) {
      return res
        .status(400)
        .json({ message: "2FA is not set up for this user" });
    }

    console.log("Stored Secret:", user.twoFASecret);
    console.log("Received OTP:", token);
    const check = speakeasy.totp.verify({
      secret: "PVSTAQCNEEXTA6KHNRJEG4RZOMUFWPTVERGDYWDLJRDT47K3KNWQ",
      encoding: "base32",
      token: "140112",
    });
    console.log(check);
    // Verify OTP
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 6, // Allow ±30s time window for slight clock differences
    });

    if (verified) {
      user.isTwoFAAuthenticated = true;
      await user.save();
      return res.status(200).json({ message: "Two Factor Auth enabled" });
    }

    return res.status(400).json({
      message: "Invalid token: OTP verification failed",
      time: new Date(),
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//   try {
//     const { id, token } = req.body;
//     const user = await User.findById({ _id: id });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid user" });
//     }
//     const { twoFASecret } = user;
//     console.log(twoFASecret);

//     const verified = speakeasy.totp.verify({
//       secret: twoFASecret,
//       encoding: "base32",
//       token,
//       window: 2,
//     });

//     if (verified) {
//       user.twoFAAuthenticate = true;
//       await user.save();
//       return res.status(200).json({ message: "Two Factor Auth enabled" });
//     }
//     return res.status(400).json({ message: "Invalid token" });
//   } catch (error) {
//     res.status(400).json({ message: "Invalid user" });
//     // console.log(error);
//     return;
//   }
// };

export const verifyTwoFA = async (req, res) => {
  try {
    const { userId, token } = req.body; // userId from Step 1

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isTwoFAEnabled) {
      return res.status(400).json({ message: "2FA is not enabled" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!isValid) {
      return res.status(400).json({ message: "Invalid 2FA code" });
    }

    const jwtToken = jwt.sign({ id: user._id }, "talal", { expiresIn: "10d" });

    res.status(200).json({ message: "Login successful", token: jwtToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
