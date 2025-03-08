

const datasourceSchema = {
  "type": "object",
  "required": [
    "name",
    "identifier"
  ],
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
    },
    "identifier": {
      "type": "string",
      "title": "Identifier",
    },
    "icon": {
      "type": "string",
      "title": "Icon",
      "format": "file"
    },
    "description": {
      "type": "string",
      "title": "Description",
    },
    "options": {
      "type": "string",
      "title": "Options",
    }
  }
}

const datasourceUISchema = {
  "description": {
    "ui:widget": "textarea",
  },
  "icon": {
    "ui:options": {
      "tips": "Upload",
      "accept": {
        "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      },
      "mode": "image",
      "maxSize": 104857600,
      "flexProps": {
        "h": "200px",
        "borderRadius": "8px"
      }
    }
  },
  "options": {
    "ui:widget": "CodeEditorWidget",
    "ui:options": {
      "lang": "json",
      "editorHeight": "400px",
      "docUri": {
        "title": 'SDK Document',
        "uri": 'https://docs.openbot.chat/chain/function/README.md'
      }
    }
  }
}



const toolSchema = {
  "type": "object",
  "required": [
    "name",
    "identifier"
  ],
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
    },
    "identifier": {
      "type": "string",
      "title": "Identifier",
    },
    "icon": {
      "type": "string",
      "title": "Icon",
      "format": "file"
    },
    "description": {
      "type": "string",
      "title": "Description",
    },
    "options": {
      "type": "string",
      "title": "Options",
    }
  }
}

const toolUISchema = {
  "description": {
    "ui:widget": "textarea",
  },
  "icon": {
    "ui:options": {
      "tips": "Upload",
      "accept": {
        "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      },
      "mode": "image",
      "maxSize": 104857600,
      "flexProps": {
        "h": "200px",
        "borderRadius": "8px"
      }
    }
  },
  "options": {
    "ui:widget": "CodeEditorWidget",
    "ui:options": {
      "lang": "json",
      "editorHeight": "400px",
      "docUri": {
        "title": 'SDK Document',
        "uri": 'https://docs.openbot.chat/chain/function/README.md'
      }
    }
  }
}

export const schemas = {
  datasource: datasourceSchema,
  tool: toolSchema,
}

export const uiSchemas = {
  datasource: datasourceUISchema,
  tool: toolUISchema
}