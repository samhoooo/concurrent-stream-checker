# Concurrent Stream Checker

A service in Node.js that exposes an API which can be consumed from any client. This service checks how many video streams a given user is watching and prevent a user from watching more than 3 video streams concurrently.

## installation instructions
Edit .env
```
MONGO_URI=<MONGODB_URL>
```

Start nodeJS Server
```
npm install
npm run dev
```

Start mongoDB
```
mongod --dbpath <LOCAL_DB_PATH>
```

## Scalability strategy

![alt text](https://raw.githubusercontent.com/samhoooo/concurrent-stream-checker/main/architecture.png)

Message Queue:
1. Use RabbitMQ to limit API request rate. Set up multiple exchanges with multiple queues based on geolocation.
2. Horizontally scale multiple nodeJS instances. Each MQ should have several nodeJS instances as consumer.

MongoDB:
1. Shard the collection based on user location. Set up shard key to user region.
2. Change the schema design:
```
const streamSchema = new mongoose.Schema({
  	userId: String,
  	sessionId: String,
  	isValidSession: Boolean, 
  	dateCreated: Date,
  	dateTerminated: Date
});
```
Count the number of valid sessions (isValidSession = true) to validate if the user can watch a new video stream.
3. Indexing on userId and sessionId

## DEMO
You can try out on: http://18.163.181.175:3000/

## Endpoints
* `GET /stream`: Gets current stream(s) of a user
* `POST /stream`: Add a stream, invoke when user wants to watch a new content
* `DELETE /stream`: Delete a stream, invoke when user terminate an existing stream
* `null`: Default route, returns 404 as the endpoint requested does not exist

## GET /stream
Gets current stream(s) of a user

Request

|  Name |  Type | Description  |
| ------------ | ------------ | ------------ |
|  userId | String  | Mandatory. Default we have 3 users with ID (1,2 and 3)  |

Example
`/stream?userId=1`

Response

|  Name |  Type | Description  |
| ------------ | ------------ | ------------ |
|  userId | String  |  User ID  |
|  streamIds | String Array  | An array of stream IDs user is currently watching |

Example
`{
    "message": "Streams successfully retrieved",
    "userId": "1",
    "streamIds": [
        "afe4f71e-a6b7-40ef-9c0c-88bec3b022b6"
    ]
}`

## POST /stream

Add a stream, invoke when user wants to watch a new content

Request

|  Name |  Type | Description  |
| ------------ | ------------ | ------------ |
|  userId | String  | Mandatory. Default we have 3 users with ID (1,2 and 3)  |

Example
`{
    "userId": "1"
}`

Response

|  Name |  Type | Description  |
| ------------ | ------------ | ------------ |
|  message | String  |  Success message  |
|  userId | String  |  User ID  |
|  streamId | String  | ID of the new stream |
|  existingStreams  | String Array | An array of stream IDs user is currently watching |

Example
`{
    "message": "Stream sucessfully added",
    "streamId": "afe4f71e-a6b7-40ef-9c0c-88bec3b022b6",
    "userId": "1",
    "existingStreams": [
        "afe4f71e-a6b7-40ef-9c0c-88bec3b022b6"
    ]
}`

## DELETE /stream
Delete a stream, invoke when user terminate an existing stream

Request

|  Name |  Type | Description  |
| ------------ | ------------ | ------------ |
|  userId | String  | Mandatory. Default we have 3 users with ID (1,2 and 3)  |
|  streamId | String  | Optional. The target stream ID to delete |

`{
    "userId": "1",
	"streamId": "bf050d59-737b-43c8-923c-d87e4836334c"
}`

Response

|  Name |  Type | Description  |
| ------------ | ------------ | ------------ |
|  message | String  |  Success message  |
|  userId | String  |  User ID  |
|  existingStreams  | String Array | An array of stream IDs user is currently watching |

`{
    "message": "stream terminated",
    "userId": "1",
    "existingStreams": [
        "206c8993-4fe4-4ae1-a960-0f824be76dab",
        "bd6a8acd-f31f-40ec-b147-3e4c2465e55d"
    ]
}`
