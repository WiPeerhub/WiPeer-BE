import AWS from "aws-sdk";
import { deleteFileFromS3 } from "../utils/deleteFileFromS3.js";

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
    Expires: 3600,
    ResponseContentDisposition: `attachment; filename="${encodedFileName}"`,
  };
  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", putParams);
    const downloadUrl = await s3.getSignedUrlPromise("getObject", getParams);

    res.json({
      uploadUrl,
      downloadUrl,
      fileUrl: `https://${putParams.Bucket}.s3.ap-northeast-2.amazonaws.com/${fileName}`,
    });
  } catch (err) {
    console.error("Presigned URL 생성 에러:", err);
    res.status(500).json({ error: "S3 presigned URL 생성 실패", details: err });
  }
};

export const deleteFilesFromS3Handler = async (req, res) => {
  const { fileKeys } = req.body;
  console.log(fileKeys);

  if (!fileKeys || fileKeys.length === 0) {
    return res.status(400).json({ error: "삭제할 파일 키가 없습니다." });
  }

  try {
    await deleteFileFromS3(fileKeys);
    res.status(200).json({ message: "삭제 완료", deleted: fileKeys });
  } catch (err) {
    res.status(500).json({ error: "삭제 실패", details: err.message });
  }
};
