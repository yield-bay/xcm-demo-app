/* Google Analytics related functions */

/**
 * The functions are used in  src/_app.js to log pageviews by subscribing to the Next router and listening for the routeChangeComplete event.
 * @param {*} url
 */
export const pageview = (url) => {
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  });
};

/**
 * Currently no custom event is tracked besides pageviews, but default events are available at:
 * https://developers.google.com/analytics/devguides/collection/gtagjs/events#default_google_analytics_events
 * @param {*} param0
 */
// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag('event', action, params);
};
