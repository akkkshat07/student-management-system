const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('studentManagement');
    const collection = db.collection('students');

    switch (event.httpMethod) {
      case 'GET':
        const students = await collection.find({}).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(students)
        };

      case 'POST':
        const newStudent = JSON.parse(event.body);
        const result = await collection.insertOne({
          ...newStudent,
          createdAt: new Date()
        });
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ ...newStudent, _id: result.insertedId })
        };

      case 'PUT':
        const studentId = event.queryStringParameters.id;
        const updateData = JSON.parse(event.body);
        await collection.updateOne(
          { _id: new ObjectId(studentId) },
          { $set: updateData }
        );
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Student updated' })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters.id;
        await collection.deleteOne({ _id: new ObjectId(deleteId) });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Student deleted' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
