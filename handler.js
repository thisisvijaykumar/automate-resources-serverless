const { SQS } = require("aws-sdk");
const sqs = new SQS();

export const execute = async (event, _context, _cb) => {
  const payload = event?.Records[0] ? event.Records[0].body : null;
  /*
    1.create invoice from payload
    2.upload it to s3
    3.publish s3 file location as response
  */
  const response = await downStreamQueueHandler({
    eTag: "3463450c8d8e412790c3ada7d5b92b0",
    location:
      "https://test.s3.ap-southeast-1.amazonaws.com/2022-08-02/2022-07-12/test_invoice.pdf",
    key: "2022-07-12/invoice_507197600351062022.pdf",
    bucket: "test-invoice-orders",
  });
  return response;
};

const downStreamQueueHandler = async (s3Response) => {
  let statusCode = 200;
  let message;

  if (!s3Response) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    await sqs
      .sendMessage({
        QueueUrl: process.env.INVOICE_DOWNSTREAM_QUEUE_URL,
        MessageBody: JSON.stringify(s3Response),
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      })
      .promise();

    message = "Message accepted!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};
