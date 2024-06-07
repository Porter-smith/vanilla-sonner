Certainly! Here's the updated README with a simplified basic usage example, and a complete `index.html` file that users can copy and paste:

---

![hero](.github/assets/cover.jpeg)
**Note:** This is a highly experimental project. Do not use it in production yet as it is a work in progress.

## Quick Start

### Include via CDN

Include the following script tag in your HTML to load `vanilla-sonner` from the CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/Porter-smith/vanilla-sonner@v0.0.1/dist/vanilla-sonner.min.js"></script>
```

### Basic Usage

Copy and paste the following `index.html` file to your project to see a basic example in action:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vanilla JavaScript Toast Notification</title>
    <script src="https://cdn.jsdelivr.net/gh/Porter-smith/vanilla-sonner@v0.0.1/dist/vanilla-sonner.min.js"></script>
    <style>
      .styled-button {
        padding: 8px 12px;
        margin: 0 5px 5px 0;
        background: #fcfcfc;
        border: 1px solid #f3f3f3;
        white-space: nowrap;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
          Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
        cursor: pointer;
        color: #171717;
        transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
      }

      .styled-button:hover {
        background: #f8f8f8;
        border-color: #e2e2e2;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      #buttonContainer {
        padding: 20px;
      }
    </style>
  </head>

  <body>
    <div id="buttonContainer">
      <button class="styled-button" id="toastButton">Show Toast</button>
    </div>

    <script>
      document
        .getElementById("toastButton")
        .addEventListener("click", function () {
          toastManager.createToast("This is a toast notification!", {
            type: "success",
            position: "bottom-right",
          });
        });
    </script>
  </body>
</html>
```

### Features

#### Default Toast

Create a basic toast with a message:

```js
toastManager.createToast("Event has been created", {
  type: "default",
  position: "bottom-right",
});
```

#### Success Toast

Create a success toast with a checkmark icon:

```js
toastManager.createToast("Event has been created", {
  type: "success",
  position: "bottom-right",
});
```

#### Info Toast

Create an info toast with a question mark icon:

```js
toastManager.createToast("Event has new information", {
  type: "info",
  position: "bottom-right",
});
```

#### Warning Toast

Create a warning toast with a warning icon:

```js
toastManager.createToast("Event has a warning", {
  type: "warning",
  position: "bottom-right",
});
```

#### Error Toast

Create an error toast with an error icon:

```js
toastManager.createToast("Event has not been created", {
  type: "danger",
  position: "bottom-right",
});
```

### Custom Toast (WIP NOT FINISHED)

Create a custom toast with additional description:

```js
toastManager.createToast("Event has been created", {
  type: "default",
  description: "Monday, January 3rd at 6:00pm",
  position: "bottom-right",
  duration: 5000,
});
```

### Action Toast (WIP NOT FINISHED)

Create a toast with an action button:

```js
toastManager.createToast("Event has been created", {
  type: "default",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
  position: "bottom-right",
});
```

### Promise Toast (WIP NOT FINISHED)

Create a toast that starts in a loading state and updates based on a promise:

```js
const promise = new Promise((resolve, reject) => setTimeout(resolve, 2000));

toastManager.createToast("Loading...", {
  type: "default",
  promise,
  position: "bottom-right",
});

promise
  .then(() => {
    toastManager.createToast("Success", {
      type: "success",
      position: "bottom-right",
    });
  })
  .catch(() => {
    toastManager.createToast("Error", {
      type: "danger",
      position: "bottom-right",
    });
  });
```

### References

This project was inspired by and uses concepts from the following projects:

- [Pines Toast Documentation](https://devdojo.com/pines/docs/toast)
- [Sonner by Emil Kowalski](https://github.com/emilkowalski/sonner)
- [Svelte-Sonner by Wobsoriano](https://github.com/wobsoriano/svelte-sonner)

---

This should provide a straightforward introduction and quick-start guide for users to implement toast notifications using `vanilla-sonner`.
