const textSchema = {
  title: '',
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    options: {
      title: '',
      type: "object",
      required: ['text'],
      properties: {
        url: {
          type: 'string',
          title: 'URL',
          format: 'uri'
        },
        text: {
          "type": 'string',
          "title": 'Text',
          "minLength": 4
        }
      }
    },
  }
}

const textUISchema = {
  options: {
    text: {
      'ui:widget': 'textarea',
      "ui:options": {
        "chakra": {
        },
        "rows": 10
      },
    },
    url: {
      'ui:placeholder': 'https://news.a.com',
    }
  }
}


const webPageSchema = {
  title: '',
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    options: {
      title: '',
      type: "object",
      required: [
        "url"
      ],
      properties: {
        url: {
          type: 'string',
          title: 'URL',
          format: 'uri'
        }
      }
    },
  }
}

const webPageUISchema = {
  "options": {
    "url": {
      "ui:widget": "UrlPreviewWidget"
    }
  }
}

const fileSchema = {
  title: '',
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    options: {
      title: '',
      type: "object",
      required: ['url'],
      properties: {
        url: {
          type: 'string',
          title: 'File',
          format: 'file'
        }
      }
    }
  }
}

const fileUISchema = {
  "options": {
    "url": {
      "ui:options": {
        "tips": "Upload File\nSupports txt, csv, html, markdown, xslx, pdf, etc. Max 100MB each",
        "mode": "smart",
        "accept": {
          "application/json": [".json"],
          "text/xml": [".xml"],
          "text/csv": [".csv"],
          "text/plain": [".txt"],
          "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
          // "text/markdown": [".md", "mdx"],
          "applicatoin/msword": [".doc"],
          "application/pdf": [".pdf"],
          "application/vnd": [],
          // "openxmlformats-officedocument.presentationml.presentation": [],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
          "audio/mpeg3": [".mp3"],
          "audio/mp4": [".mp4"]
        },
        "maxSize": 104857600,
        "flexProps": {
          "h": "200px",
          "borderRadius": "8px"
        }
      }
    }
  }
}






const websiteSchema = {
  title: '',
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    options: {
      title: '',
      type: "object",
      required: ['url'],
      properties: {
        url: {
          type: 'string',
          title: 'URL',
          format: 'uri'
        },
        strategy: {
          type: 'string',
          title: 'Strategy',
          default: "same_domain",
          oneOf: [
            { 'const': 'same_hostname', title: 'Same hostname' },
            { 'const': 'same_domain', title: 'Same domain' },
            { 'const': 'same_origin', title: 'Same origin' },
          ],
        },
      }
    },
  }
}

export const schemas = {
  text: textSchema,
  web_page: webPageSchema,
  website: websiteSchema,
  file: fileSchema,
}

export const uiSchemas = {
  text: textUISchema,
  web_page: webPageUISchema,
  file: fileUISchema,
}