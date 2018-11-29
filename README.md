# 1. Offline events

```js
window.addEventListener("online", () => this.online(true));
window.addEventListener("offline", () => this.online(false));
```

```js
online(online) {
    const showToast = online !== this.state.online;
    if (showToast) {
      setTimeout(() => this.setState({ showToast: null }), 2000);
    }

    const message = online
      ? "Yay, the application is online!"
      : "Oh no, the app seems to be offline... ";

    this.setState({ toastMessage: message, showToast: "show" });
  }
```
