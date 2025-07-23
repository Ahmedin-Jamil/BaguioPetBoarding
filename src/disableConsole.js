// Automatically disable most console methods in production builds to prevent sensitive logs
// and reduce noise for end-users. This runs as soon as the bundle loads.
/* eslint-disable no-console */
if (process.env.NODE_ENV === 'production') {
  ['log', 'debug', 'info', 'warn', 'trace'].forEach(method => {
    // Keep a reference to the original in case you really need it for debugging a live issue.
    // Comment out the next line if you ever need to re-enable at runtime.
    console[method] = () => {};
  });
}
