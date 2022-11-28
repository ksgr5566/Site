# Site

You can manage your investments and track your stocks in multiple portfolios with Site.

---

## Local Installation

1. Clone the repository.

2. If you are using nvm, run `nvm use` to use the version of Node from the .nvmrc file.

3. Install dependencies: `npm install`.

4. `cd server` and `npm install` to set up backend server. Copy `.env.template` to `.env` and edit the environment variables in */server*.

5. Either set up mysql database manually by constructing the databse locally by following commands in [MYSQL-SETUP](MYSQL-SETUP.md) or you can use the `sitedb.sql` file and do the following:
   - Create a database named `sitedb` in your local mysql cli.
   - `use sitedb;`
   - `source sitedb.sql`

6. Start up the server using the command `node index` in */server*.

7. Start up the client app using `npm start` from root.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
