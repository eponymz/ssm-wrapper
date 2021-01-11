module.exports.errorResp = (errCode, errStack, awsParams) => {
  switch (errCode) {
    case 'AccessDeniedException':
      console.error(`You do not have sufficient access to perform this action.`)
      break
    case 'ExpiredTokenException':
      console.info(`Expired creds. Refresh AWS credentials and retry.`)
      process.exit(1)
    case 'HierarchyLevelLimitExceededException':
      console.error(`A hierarchy can have a maximum of 15 levels. Unable to create ${awsParams.Name} at the defined hierarchy.`)
      break
    case 'HierarchyTypeMismatchException':
      console.error(`Unable to change type for ${awsParams.Name}. You must create a new, unique parameter.`)
      break
    case 'IncompleteSignature':
      console.error(`The request signature does not conform to AWS standards.`)
      break
    case 'InternalFailure':
      console.error(`The request processing has failed because of an unknown error, exception or failure.`)
      break
    case 'InternalServerError':
      console.error(`An error occurred on the server side.`)
      break
    case 'InvalidAction':
      console.error(`The action or operation requested is invalid. Verify that the action is typed correctly.`)
      break
    case 'InvalidAllowedPatternException':
      console.error(`The request for ${awsParams.Name} does not meet the regular expression requirement.`)
      break
    case 'InvalidClientTokenId':
      console.error(`The X.509 certificate or AWS access key ID provided does not exist in AWS records.`)
      break
    case 'InvalidNextToken':
      console.error(`The specified token is not valid.`)
      break
    case 'InvalidParameterCombination':
      console.error(`Parameters that must not be used together were used together.`)
      break
    case 'InvalidParameterType':
      console.error(`Invalid parameter type for ${awsParams.Name}. See below for info.\n${errStack}`)
      break
    case 'InvalidParameterValue':
      console.error(`An invalid or out-of-range value was supplied for the input parameter.`)
      break
    case 'InvalidQueryParameter':
      console.error(`The AWS query string is malformed or does not adhere to AWS standards.`)
      break
    case 'MalformedQueryString':
      console.error(`The query string contains a syntax error.`)
      break
    case 'MissingAction':
      console.error(`The request is missing an action or a required parameter.`)
      break
    case 'MissingAuthenticationToken':
      console.error(`The request must contain either a valid (registered) AWS access key ID or X.509 certificate.`)
      break
    case 'MissingParameter':
      console.error(`A required parameter for the specified action is not supplied.`)
      break
    case 'NotAuthorized':
      console.error(`You do not have permission to perform this action.`)
      break
    case 'OptInRequired':
      console.error(`The AWS access key ID needs a subscription for the service.`)
      break
    case 'ParameterAlreadyExists':
      console.info(`Parameter ${awsParams.Name} already exists and overwrite is set to false. Skipping.`)
      break
    case 'ParameterLimitExceeded':
      console.error(`You have exceeded the number of parameters for this AWS account. Delete one or more parameters and try again.`)
      break
    case 'ParameterMaxVersionLimitExceeded':
      console.error(`You attempted to create a new version of ${awsParams.Name} by calling the PutParameter API with the overwrite flag. The oldest version can't be deleted because it has a label associated with it. Move the label to another version of the parameter, and try again.`)
      break
    case 'ParameterNotFound':
      console.error(`The parameter could not be found. Verify that ${awsParams.Name} exists and try again.`)
      break
    case 'ParameterPatternMismatchException':
      console.error(`The parameter name: ${awsParams.Name} is not valid.`)
      break
    case 'RequestExpired':
      console.error(`The request reached the service more than 15 minutes before or after the date stamp on the request.`)
      break
    case 'ServiceUnavailable':
      console.error(`The request has failed due to a temporary failure of the server.`)
      break
    case 'ThrottlingException':
      console.error(`Rate limit exceeded when calling AWS API.`)
      break
    case 'TooManyUpdates':
      console.error(`There are concurrent updates for a resource that supports one update at a time.`)
      break
    case 'UnsupportedParameterType':
      console.error(`The parameter type for ${awsParams.Name} is not supported.`)
      break
    case 'ValidationException':
      console.error(`Valdiation error occurred on ${awsParams.Name}. See below for info.\n${errStack}`)
      break
    default:
      console.error(`Non mapped error occurred on ${awsParams.Name}. See below.\n${errStack}`)
      break
  }
}
