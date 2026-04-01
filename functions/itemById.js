const connectDB = require("./db");
const { ObjectId } = require("mongodb");

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;
    const id = event.queryStringParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "ID is required" })
      };
    }

    const collection = await connectDB();
    const objectId = new ObjectId(id);

    if (method === "GET") {
      const item = await collection.findOne({ _id: objectId });

      if (!item) {
        return {
          statusCode: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({ error: "Item not found" })
        };
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(item)
      };
    }

    if (method === "PUT") {
      const data = JSON.parse(event.body);

      await collection.updateOne(
        { _id: objectId },
        {
          $set: {
            name: data.name,
            description: data.description
          }
        }
      );

      const updatedItem = await collection.findOne({ _id: objectId });

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(updatedItem)
      };
    }

    if (method === "DELETE") {
      const deletedItem = await collection.findOne({ _id: objectId });

      if (!deletedItem) {
        return {
          statusCode: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({ error: "Item not found" })
        };
      }

      await collection.deleteOne({ _id: objectId });

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(deletedItem)
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