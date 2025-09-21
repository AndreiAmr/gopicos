import mixpanel from 'mixpanel-browser';

// Near entry of your product, init Mixpanel
mixpanel.init('3adaa9bc6696daed4ad17d3c0ff36027', {
  debug: true,
  track_pageview: true,
  persistence: 'localStorage',
});
