self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Nueva notificación";
  const options = {
    body: data.body || "Haz clic para ver los detalles.",
    icon: "/icon.png", // Cambia esto al ícono que prefieras
    data: data.url || "/",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data;
  if (url) {
    clients.openWindow(url);
  }
});
