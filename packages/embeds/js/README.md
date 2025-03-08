# Openbot JS library

Frontend library to embed openbots from [Openbot](https://openbot.chat/).

## Installation

### Using npm

To install, simply run:

```bash
npm install @openbot/js2
```

### Directly in your HTML

```html
<script type="module">
    import Openbot from 'https://cdn.jsdelivr.net/npm/@openbot/js2@0.0.30/dist/embeds.js';
    Openbot.initStandard({
        agent: {
            id: 'agent id'
        }
    });
</script>
<openbot-standard style="width: 100%; height: 600px; "></openbot-standard>
```

## Standard

You can get the standard HTML and Javascript code by clicking on the "HTML & Javascript" button in the "Share" tab of your openbot.

There, you can change the container dimensions. Here is a code example:

```html
<script type="module">
    import Openbot from 'https://cdn.jsdelivr.net/npm/@openbot/js2@0.0.30/dist/embeds.js';
    Openbot.initStandard({
        agent: {
            id: 'agent id',
            options: {
                avatar: {
                    type: '3d',
                    options: {
                        modelSrc: 'https://your_model_url'
                    }
                }
            }
        },
        showAvatar: true
    });
</script>
<openbot-standard style="width: 100%; height: 600px; "></openbot-standard>
```

This code is creating a container with a 100% width (will match parent width) and 600px height.

## Popup

You can get the popup HTML and Javascript code by clicking on the "HTML & Javascript" button in the "Share" tab of your openbot.

Here is an example:

```html
<script type="module">
    import Openbot from 'https://cdn.jsdelivr.net/npm/@openbot/js2@0.0.30/dist/embeds.js';

    Openbot.initPopup({
        agent: {
            id: 'agent id',
            options: {
                avatar: {
                    type: '3d',
                    options: {
                        modelSrc: 'https://your_model_url'
                    }
                }
            }
        },
        showAvatar: true,
        autoShowDelay: 3000,
    })
</script>
```

This code will automatically trigger the popup window after 3 seconds.

### Open or Close a popup

You can use these commands:

```js
Openbot.open()
```

```js
Openbot.close()
```

```js
Openbot.toggle()
```

You can bind these commands on a button element, for example:

```html
<button onclick="Openbot.open()">Contact us</button>
```

## Bubble

You can get the bubble HTML and Javascript code by clicking on the "HTML & Javascript" button in the "Share" tab of your openbot.

Here is an example:

```html
<script type="module">
    import Openbot from 'https://cdn.jsdelivr.net/npm/@openbot/js2@0.0.30/dist/embeds.js';

    Openbot.initBubble({
        agent: {
            id: 'agent id',
            options: {
                avatar: {
                    type: '3d',
                    options: {
                        modelSrc: 'https://your_model_url'
                    }
                }
            }
        },
        showAvatar: true,
        previewMessage: {
            message: 'I have a question for you!',
            autoShowDelay: 5000,
            avatarUrl: 'https://avatars.githubusercontent.com/u/16015833?v=4',
        },
        theme: {
            button: {
                backgroundColor: '#0042DA',
                iconColor: '#FFFFFF'
            },
            previewMessage: {
                backgroundColor: '#ffffff',
                textColor: 'black'
            },
            chatWindow: {
                backgroundColor: '#ffffff'
            },
        },
    })
</script>
```

This code will show the bubble and let a preview message appear after 5 seconds.

### Open or close the preview message

You can use these commands:

```js
Openbot.showPreviewMessage()
```

```js
Openbot.hidePreviewMessage()
```

### Open or close the openbot

You can use these commands:

```js
Openbot.open()
```

```js
Openbot.close()
```

```js
Openbot.toggle()
```

You can bind these commands on a button element, for example:

```html
<button onclick="Openbot.open()">Contact us</button>
```