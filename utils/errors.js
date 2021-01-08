module.exports.errorResp = (errCode, errStack, awsParams) => {
  switch (errCode) {
    case 'ExpiredTokenException':
      console.info(`Expired creds. Run 'getCreds' and retry.`)
      process.exit(1)
    case 'ParameterAlreadyExists':
      console.info(`Parameter ${awsParams.Name} already exists and overwrite is set to false. Skipping.`)
      break
    case 'ValidationException':
      console.error(`Valdiation error occurred on ${awsParams.Name}. See below for info.\n${errStack}`)
      break
    case 'InvalidParameterType':
      console.error(`Invalid parameter type. See below for info.\n${errStack}`)
      break
    case 'ThrottlingException':
      console.error(`Rate limit exceeded when calling AWS API.`)
      break
    default:
      console.error(`Non mapped error occurred on ${awsParams.Name}. See below.\n${errStack}`)
      break
  }
}
