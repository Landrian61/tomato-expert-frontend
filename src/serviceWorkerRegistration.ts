// This optional code is used to register a service worker.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
};

export function register(config?: Config) {
   if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service worker registered successfully:', registration);
        
        if (config && config.onSuccess) {
          config.onSuccess(registration);
        }
        
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;
          
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content available
                console.log('New content is available; please refresh.');
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // Content cached for offline use
                console.log('Content is cached for offline use.');
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          });
        });
      } catch (error) {
        console.error('Error during service worker registration:', error);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service worker registered successfully');
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available
              console.log('New service worker content is available');
              if (config?.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Content is cached for offline use
              console.log('Content is cached for offline use');
              if (config?.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
      if (config?.onOffline) {
        config.onOffline();
      }
    });
}

function setupOnlineOfflineHandlers(config?: Config) {
  // Handle online status changes
  window.addEventListener('online', () => {
    console.log('App is online');
    if (config?.onOnline) {
      config.onOnline();
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('App is offline');
    if (config?.onOffline) {
      config.onOffline();
    }
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Error unregistering service worker:', error);
      });
  }
}
