import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getPresignedURL = async (req, res) => {
  const fileName = req.query.fileName;
  const fileType = req.query.fileType;

  const putParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    Expires: 60,
  };

  const encodedFileName = encodeURIComponent(fileName);

  const getParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ResponseContentDisposition: `attachment; filename="${encodedFileName}"`,
  };
  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", putParams);
    const downloadUrl = await s3.getSignedUrlPromise("getObject", getParams);

    res.json({
      uploadUrl,
      downloadUrl,
      fileUrl: `https://${putParams.Bucket}.s3.amazonaws.com/${fileName}`,
    });
  } catch (err) {
    console.error("Presigned URL 생성 에러:", err);
    res.status(500).json({ error: "S3 presigned URL 생성 실패", details: err });
  }
};
