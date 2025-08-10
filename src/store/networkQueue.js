// store/networkQueue.js
const queue = [];

export const queueActionIfOffline = (action) => {
  if (navigator.onLine) {
    performAction(action);
  } else {
    console.log('Queued offline action:', action);
    queue.push(action);
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
  }
};

export const retryQueuedActions = async () => {
  const savedQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
  for (const action of savedQueue) {
    await performAction(action);
  }
  queue.length = 0;
  localStorage.removeItem('offlineQueue');
};

const performAction = async ({ type, url, data, onSuccess }) => {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      method: type,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    const res = await fetch(url, config);
    if (onSuccess) onSuccess(res);
  } catch (err) {
    console.error('Error performing queued action:', err);
  }
};

window.addEventListener('online', retryQueuedActions);
