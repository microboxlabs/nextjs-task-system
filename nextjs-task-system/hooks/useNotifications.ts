const useNotification = () => {
  const requestPermission = async () => {
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Permiso para notificaciones concedido.");
      } else {
        console.log("Permiso para notificaciones denegado.");
      }
    }
  };

  const sendNotification = (title: string, options: NotificationOptions) => {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    }
  };

  return { requestPermission, sendNotification };
};

export default useNotification;
