# SSM Wrapper
### Installation
Once this repository is cloned down, be sure to run the following commands from within the project directory:
1. `npm install` - this will install the dependencies of the project (only two direct dependencies).
1. `npm link` - this will symlink the CLI code to `ssm` command.

---

### Commands

| Command | Alias | Description |
| ------- | ----- | ----------- |
| add | update | Add or update parameters |
| list | ls, get | List parameters at a given path |
| delete | del, rm | Delete specified parameter |

---

### Options

| Flag | Alias | Description | Required |
| ----- | ----- | ----------- | -------- |
| --file | -f | JSON file with params to add. | Only with `add` cmd |
| --key | -k | The KMS key to encrypt the param(s) with. | Only with `add` cmd |
| --path | -p | The path to add or update parameters at. | yes |
| --name | -n | The name of the parameter to delete. | Only with `delete` cmd |
| --overwrite | -o | Whether to overwrite or not. Defaults to false. | no |
| --help | -h | Show help. | no |

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
