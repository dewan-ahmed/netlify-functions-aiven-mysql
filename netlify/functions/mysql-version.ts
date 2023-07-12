import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import mysql from "mysql";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  
  var connection = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl  : {
      ca : process.env.CA_CONTENTS
    }
  });

  try {
    connection.connect();
    const versionQuery = "SELECT VERSION() AS version";
    const result = await new Promise((resolve, reject) => {
      connection.query(versionQuery, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const mysqlVersion = result[0].version;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Your MySQL version is: ${mysqlVersion}.` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  } finally {
    connection.end();
  }
};

export { handler };
