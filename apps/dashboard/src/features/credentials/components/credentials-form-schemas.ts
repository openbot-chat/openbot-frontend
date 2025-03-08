


const qdrantSchema = {
  "type": "object",
  "properties": {
    "data": {
      "type": "object",
      "title": "",
      "required": ["api_key"],      
      "properties": {
        "api_key": {
          "type": 'string',
          "title": "API Key",
        },
        "url": {
          "type": "string",
          "title": "URL",
        },
      }
    }
  }
}

const twitterSchema = {
  "type": "object",
  "properties": {
    "data": {
      "title": "",
      "required": ["api_key"],
      "type": "object",
      "properties": {
        "api_key": {
          "type": 'string',
          "title": "API Key",
        }
      }
    }
  }
}



export const schemas = {
  qdrant: qdrantSchema,
  twitter: twitterSchema,
}

export const uiSchemas = {
}
