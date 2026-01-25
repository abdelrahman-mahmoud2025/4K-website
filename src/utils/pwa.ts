// Service Worker Registration with Smart Update

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (import.meta) {
    console.log('[PWA] Service Worker disabled in development');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for(let registration of registrations) {
          registration.unregister();
          console.log('[PWA] Unregistered SW in DEV');
        }
      });
    }
    return null;
  }

  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[PWA] Service Worker registered:', registration.scope);

    // Check for updates immediately
    registration.update();

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('[PWA] New version available!');
            notifyUpdate(registration);
          }
        });
      }
    });

    // Check for updates every 5 minutes
    setInterval(() => {
      registration.update();
      console.log('[PWA] Checking for updates...');
    }, 5 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

// Notify user about update and reload
function notifyUpdate(registration: ServiceWorkerRegistration) {
  // Skip waiting and reload
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // Reload page to get new version
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

// Check online status
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function setupNetworkListeners(
  onOnline: () => void,
  onOffline: () => void
) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// Force refresh data when online
export async function forceDataRefresh(): Promise<void> {
  if (!isOnline()) {
    console.log('[PWA] Offline - using cached data');
    return;
  }

  console.log('[PWA] Online - refreshing data...');
  
  // Tell service worker to check for updates
  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({ type: 'CHECK_UPDATES' });
}
