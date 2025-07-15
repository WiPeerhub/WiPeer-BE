import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const deleteFileFromS3 = async (fileKeys) => {
  if (!Array.isArray(fileKeys)) {
    fileKeys = [fileKeys];
  }

  if (fileKeys.length === 0) return;

  if (fileKeys.length === 1) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKeys[0],
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (err) {
      throw err;
    }

    return;
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delete: {
      Objects: fileKeys.map((key) => ({ Key: key })),
      Quiet: false,
    },
  };

  try {
    const result = await s3.deleteObjects(params).promise();
    if (result.Errors && result.Errors.length > 0) {
      console.error("삭제 실패한 파일:", result.Errors);
      throw new Error("일부 파일 삭제 실패");
    }
  } catch (err) {
    console.error("S3 다중 파일 삭제 실패", err);
    throw err;
  }
};
