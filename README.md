# ShareX-API
My image API for ShareX. Designed for Discord use.

## About
This image API allows for embedding images from your own custom urls.
Send an image to the API, then post the link in Discord. If you have set it up correctly, the image/video will embed.



## How to setup

#### conf.json
Upon first launch you will get an error for not having a conf.json.
Create it in the root dir of the api and add the following.
```json
{
  "port": 3000,
  "token": "<auth token>",
  "url": "https://yourCoolURL",
  "embeds": {
    "enabled": true,
    "title": "<Embed title>",
    "description": "<Embed description>"
  }
}
```

### Setting up ShareX
Navigate to custom uploader settings in sharex.
Create a new uploader.

Name: Whatever you wish your name to be
Request:
  Method: POST
  URL: http://<your server ip>:<api port>/save/$filename$
  Body: Form data (multipart/form-data)
  Headers:
    Name: token
    Value: <your auth token in conf.json>
  File form name: files[]

Response:
  Parse response: JSON
  URL: <your url>/$json:name$
  Thumbnail URL: <your url>/$json:name$

Then set the destination types as Image uploader and File Uploader.

## Other
As of 14/01/2021 there is one known issue - videos/gifs not embedding when conf.embeds.enabled is set to false.