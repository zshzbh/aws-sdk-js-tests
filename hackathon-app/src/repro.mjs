import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";


// Create an S3 client
var config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: "XXX",
    secretAccessKey: "XXX",
  },
};

const client = new S3Client(config);
var bucketParams = { Bucket: "new-bucket-maggie-ma" };
const getObjectCommand = new GetObjectCommand({
  Bucket: "new-bucket-maggie-ma",
  Key: "new-bucket-maggie",
});
client.send(new GetObjectCommand({
  Bucket: "new-bucket-maggie-ma",
  Key: "new-bucket-maggie",
}))
var listObjectsCommand = new ListObjectsCommand(bucketParams);
client
  .send(listObjectsCommand)
  .then(function (data) {
    console.log("Success", data);
  })
  .catch(function (err) {
    console.error(err);
  });
