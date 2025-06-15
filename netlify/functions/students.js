const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (!uri) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'MongoDB URI not configured' })
    };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
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
          { $set: { ...updateData, updatedAt: new Date() } }
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
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.close();
  }
};
