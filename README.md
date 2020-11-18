# SSM Wrapper
### Installation
Once this repository is cloned down, be sure to run the following commands:
1. `npm install` - this will install the dependencies of the project (only two direct dependencies).
1. `npm link` - this will symlink the CLI code to `ssm` command.

---

### Command Options

| Flag | Alias | Description | Required |
| ----- | ----- | ----------- | -------- |
| --action | -a | Action to take. One of list,add,update,delete. | yes |
| --file | -f | JSON file with params to add | If action == add or update |
| --key | -k | The KMS key to encrypt the param(s) with | no |
| --overwrite | -o | Whether to overwrite or not. Defaults to false | no |
| --help | -h | Show help | no |

---

### Command Examples
* `ssm -a add -f /path/to/parameters.json`
    * Will add parameters defined in the JSON file provided. 
    * Any existent values will be skipped to due overwrite being false (default)
    * Parameters will be encrypted with a default KMS key.
* `ssm -a add -f /path/to/parameters.json -k alias/kms-key-alias`
    * Will add parameters defined in the JSON file provided. 
    * Any existent values will be skipped to due overwrite being false (default)
    * Parameters will be encrypted with provided key. (requires KMS key and alias to exist)
* `ssm -a update -f /path/to/parameters.json -o true -k alias/kms-key-alias`
    * Will add parameters defined in the JSON file provided. 
    * Existing values will be replaced by values provided in the JSON file.
    * Parameters will be encrypted with provided key. (requires KMS key and alias to exist)
* `ssm -a list`
    * Will list the parameters available at the provided path.
    * Command will prompt for desired path to list.
* `ssm -a delete`
    * Will prompt for Parameter path, and sub prompt for Parameter Name.
    * Still in development/untested.
    * Recommended to not use until fully tested and complete.

---

### Parameter Source File
> The JSON file being provided will need to follow the structure below.<br>This is to ensure calls to AWS are successful.

Can contain one or more parameters.

`key` in each object will be the parameter path + parameter key. EX: `/my-service/MY_SECRET_PARAMETER`.

`value` in each object will be the parameter value (saved to AWS SSM as a SecureString) - support for other types coming in the future.
```json
[
  {
    "key": "/my-service/THIRD_PARTY_API_KEY",
    "value": "$up3RsEcr3T"
  },
  {
    "key": "/my-service/DATABASE_HOST",
    "value": "localhost"
  },
  {
    "key": "/my-service/DATABASE_USER",
    "value": "myservice_readonly_user"
  },
  {
    "key": "/my-service/DATABASE_PASSWORD",
    "value": "secretdbpassword"
  },
  {
    "key": "/my-service/DATABASE_PORT",
    "value": "5432"
  }
]
```
