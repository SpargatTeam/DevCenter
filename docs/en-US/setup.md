# Setup DevCenter

## For setup DevCenter you need to do these steps:

### Create an user on storage/db/users.json the user should be like this

```
  {
    "id": 1,
    "accessToken": "(accesToken)",
    "email": "(ur email)",
    "username": "(username)",
    "name": "(name)",
    "hasPassword": true,
    "password": "(a powerfull password)",
    "role": 6
  }
```

### An example is this one

```
  {
    "id": 1,
    "accessToken": "admtoken&26shwsnsw73ujuw*9292UIiu989UISUEIIUIEU98809088988456789453572#$%^&*&^%$%4",
    "email": "administrator@this.dev",
    "username": "Administrator",
    "name": "Administrator",
    "hasPassword": true,
    "password": "Administrator",
    "role": 6
  }
```

## Edit the .env for ur needed configurations, like WEB_PORT = 8080