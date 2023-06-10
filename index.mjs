import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Response } from 'node-fetch';

export const handler = async (event) => {
  let s3Client = new S3Client({ region: 'us-east-2' });

  let name = event.Records[0].s3.object.key;
  let size = event.Records[0].s3.object.size;
  let type = '.jpg';
  let newImageDetails = { name, size, type };
  console.log('new image details', newImageDetails);

  let input = {
    Bucket: 'emmanuel-lab17js401d53',
    Key: 'images.json',
  }

  let imageDetails;
  try {
    let results = await s3Client.send(new GetObjectCommand(input));
    let response = new Response(results.Body);
    let retrievedImageDetails = await response.json();
    imageDetails = retrievedImageDetails;
  } catch (e) {
    console.log('get obj error', e);
    imageDetails = [];
  }
  imageDetails.push(newImageDetails);
  console.log('our image details array', imageDetails);

  let stringifiedDetails = JSON.stringify(imageDetails, undefined, '  ');
  let putInput = {
    ...input,
    Body: stringifiedDetails,
    ContentType: 'application/json',
  }

  try {
    await s3Client.send(new PutObjectCommand(putInput));
  } catch (e) {
    console.warn('failed to put', e);
  }

  // TODO implement
  const response = {
    statusCode: 200,
    body: stringifiedDetails,
  };
  return response;
};
