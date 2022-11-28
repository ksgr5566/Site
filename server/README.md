## Env Template 

*ACCESS_TOKEN_SECRET* and *REFRESH_TOKEN_SECRET* are generated using:

```require('crypto').randomBytes(64).toString('hex')```

*PASSWORD* is your local mysql root connection's password.
