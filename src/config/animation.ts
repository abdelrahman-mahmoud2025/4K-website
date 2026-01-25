export const ANIMATION_CONFIG = {
  // Set to true to enable animation, false to disable
  default: true, // Default behavior for unspecified routes
  routes: {
    "/": true,
    "/shop": true,
    "/about": true,
    "/branches": true, // Example: Disable animation for branches
    "/patcher": true,  // Example: Disable animation for patcher
    // Add other routes here...
    "/cart": true,
  } as Record<string, boolean>
};

export const shouldAnimate = (pathname: string): boolean => {
  // Handle exact matches
  if (pathname in ANIMATION_CONFIG.routes) {
    return ANIMATION_CONFIG.routes[pathname];
  }
  
  // Handle dynamic routes (e.g., /product/123)
  // You can add custom logic here if needed, for now we check if any key is a prefix
  // or just return default.
  // Simple prefix check for configured routes:
  // const configKey = Object.keys(ANIMATION_CONFIG.routes).find(key => pathname.startsWith(key));
  // if (configKey) return ANIMATION_CONFIG.routes[configKey];

  return ANIMATION_CONFIG.default;
};
