const connectDB = require("./db");

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;
    const collection = await connectDB();

    if (method === "GET") {
      const items = await collection.find().toArray();

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(items)
      };
    }

    if (method === "POST") {
      const data = JSON.parse(event.body);

      const newItem = {
        name: data.name || "No name",
        description: data.description || ""
      };

      const result = await collection.insertOne(newItem);

      return {
        statusCode: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          _id: result.insertedId,
          ...newItem
        })
      };
    }

    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};