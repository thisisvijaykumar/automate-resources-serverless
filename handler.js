export const invoiceGeneration = async (event, context) => {
  /*
    1.create invoice from payload
    2.upload it to s3
    3.publish s3 file location as response
  */
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Your function executed and created invoice!`,
      location:"https://prod-temp-invoice.s3.me-south-1.amazonaws.com/2022-07-05/temp_invoice_23141.pdf" // dummy file location
    }),
  };
};


