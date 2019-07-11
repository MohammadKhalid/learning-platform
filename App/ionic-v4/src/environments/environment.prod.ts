export const environment = {
    production: true
  };
  
  export const SERVER_URL = 'https://api.thrive19.com/v1/';
  export const SOCKET_URL = 'https://api.thrive19.com/';
export const IMAGE_URL = 'https://api.thrive19.com/';
  export const RTC_SIGNALLING_SERVER_URL = 'https://thrive19.com:9001/';
  export const ICE_SERVERS = {
    stun: {
      urls: 'stun:thrive19.com'
    },
    turn: {
      urls: 'turn:thrive19.com',
      credential: 'fadqyvnijwu8Tubnyc',
      username: 'thrive19'
    },
    candidates: { turn: true, stun: false, host: false },
    transportPolicy: 'relay'
  };
  export const PREFIX_LGT = 'LGT';
  export const DEFAULT_TIMEZONE = 'Australia/Sydney';