import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getPresignedURL = async (req, res) => {
  const fileName = uuidv4();
  const fileType = req.query.fileType;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    Expires: 60,
  };

  try {
    const url = await s3.getSignedUrlPromise("putObject", params);
    res.json({
      uploadUrl: url,
      fileUrl: `https://${params.Bucket}.s3.amazonaws.com/${fileName}`,
    });
  } catch (err) {
    res.status(500).json({ error: "S3 presigned URL 생성 실패", details: err });
  }
};
