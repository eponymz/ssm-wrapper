# SSM Wrapper for Parameter Store

## Description
This project was intended to simplify working with parameter store using JSON files. Also to enable the ability to add/update parameters in bulk using a JSON file.

Running long commands one-by-one to add/update environment variables tends to be tedious and inefficient.

**NOTE:** This project assumes you have valid AWS credentials either statically defined or obtained through [gimme-aws-creds](https://github.com/Nike-Inc/gimme-aws-creds).

---

### Installation
Once this repository is cloned down, be sure to run the following commands from within the project directory:
1. `npm install` - this will install the dependencies of the project (only two direct dependencies).
1. `npm link` - this will symlink the CLI code to `ssm` command.

---

### Commands

| Command | Alias | Description | Options |
| ------- | ----- | ----------- | ------- |
| add | update | Add or update parameters | [-f, -k, -p, -o](#add) |
| list | ls, get | List parameters at a given path | [-p, -r](#list) |
| delete | del, rm | Delete specified parameter | [-p, -n](#list) |

---

### Options
> Shown per command.

### Global
| Flag | Alias | Description | Required |
| ----- | ----- | ----------- | -------- |
| --help | -h | Show help. | no |

#### Add
| Flag | Alias | Description | Required |
| ----- | ----- | ----------- | -------- |
| --file | -f | JSON file with params to add. | yes |
| --key | -k | The KMS key to encrypt the param(s) with. | yes |
| --path | -p | The path to add or update parameters at. | yes |
| --overwrite | -o | Whether to overwrite or not. Defaults to false. | no |

#### List
| Flag | Alias | Description | Required |
| ----- | ----- | ----------- | -------- |
| --path | -p | The path to add or update parameters at. | yes |
| --result | -r | Output result format. Defaults to formatted table. Accepts `json, table`. | no |

#### Delete
| Flag | Alias | Description | Required |
| ----- | ----- | ----------- | -------- |
| --path | -p | The path to add or update parameters at. | yes |
| --name | -n | The name of the parameter to delete. | yes |

---

### Command Examples
* `ssm add -f /path/to/parameters.json -p my-service -k alias/my-service-kms-key`
    * Will add parameters defined in the JSON file provided. 
    * Any existent values will be skipped to due overwrite being false (default).
    * Parameter name will be in the format of `/my-service/PARAMETER_NAME_FROM_FILE`.
* `ssm add -f /path/to/parameters.json -p my-service -k alias/kms-key-alias -o true`
    * Will add parameters defined in the JSON file provided. 
    * Existing values will be replaced by values provided in the JSON file.
    * Parameter name will be in the format of `/my-service/PARAMETER_NAME_FROM_FILE`.
* `ssm list -p my-service`
    * Will list the parameters available at the provided path.
* `ssm list -p my-service -r json`
    * Will list the parameters available at the provided path.
    * Output will be formatted JSON.
        * **NOTE:** escaped characters will contain an extra backslash.
* `ssm delete -p my-service -n MY_PARAMETER`
    * Will delete the parameter located at `my-service/MY_PARAMETER`.

---

### Parameter Source File
> The JSON file being provided will need to follow the structure below.<br>This is to ensure calls to AWS are successful.

Can contain one or more parameters.

`key` in each object will be the parameter key. This will be formatted with the `path` value provided from command EX: `/my-service/MY_SECRET_PARAMETER`.

`value` in each object will be the parameter value.

`type` in each object will be the parameter type. **NOTE**: this does not currently default and will cause issues if not present in the JSON file. 
```json
[
  {
    "key": "THIRD_PARTY_API_KEY",
    "value": "$up3RsEcr3T",
    "type": "SecureString"
  },
  {
    "key": "DATABASE_HOST",
    "value": "localhost",
    "type": "SecureString"
  },
  {
    "key": "DATABASE_USER",
    "value": "myservice_readonly_user",
    "type": "String"
  },
  {
    "key": "DATABASE_PASSWORD",
    "value": "secretdbpassword",
    "type": "String"
  },
  {
    "key": "DATABASE_PORT",
    "value": "5432",
    "type": "String"
  }
]
```

---

### AWS API Errors
Possible exceptions in AWS documentation have been mapped for convenience and cleaner output from the AWS API calls.

The mapped exceptions can be found [here](/utils/errors.js). If you experience a non mapped error and you feel it should be mapped for convenience, this file will be the location for PR changes. Feel free to submit a pull request for the addition.

AWS documentation on errors related to commands in this project can be found at the links below.
* Add: https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PutParameter.html#API_PutParameter_Errors
* List: https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_GetParametersByPath.html#API_GetParametersByPath_Errors
* Delete: https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_DeleteParameter.html#API_DeleteParameter_Errors
* Common Errors: https://docs.aws.amazon.com/systems-manager/latest/APIReference/CommonErrors.html
