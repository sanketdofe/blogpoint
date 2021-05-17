BlogPoint - A blogging site

I have used ReactJS as the frontend, NodeJS(with ExpressJS) as the backend, and PostgreSQL as the database.

The complete source code can be found at: https://github.com/sanketdofe/blogpoint

The ReactApp has been hosted on heroku and can be accessed at: https://shrouded-river-07102.herokuapp.com/

The backend is also hosted on heroku and is being used for handling api requests from the frontend. It can be accessed at: https://damp-brook-68868.herokuapp.com/

If you want to replicate this work, follow these steps:
1. Clone this repository.
2. Run `npm install` in both 'client' folder and 'server' folder seperately to install all the dependencies.
3. Restore the sql database dump stored in 'db.sql' file at your local machine's postgreSQL(OR other distibutions if it works) to create the required database and tables.
4. Create a new file `.env` under server folder and set the content as follows:
secretkey=YourSecretKey
DATABASE_URL=YourDatabaseUrl

Replace the YourSecretKey and YourDatabaseUrl according to your configurations.

5. Now, just open 2 consoles and go to `\client` and `\server` directories and run `npm start` and `node app.js` there respectively.




