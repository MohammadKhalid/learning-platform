// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

//  export const SERVER_URL = 'https://thrive19.eastus.cloudapp.azure.com/v1/';
export const SERVER_URL = 'http://localhost:3000/v1/';
export const IMAGE_URL = 'http://localhost:3000/';
//  export const SOCKET_URL = 'https://thrive19.eastus.cloudapp.azure.com/';
export const SOCKET_URL = 'http://localhost:3000/';
export const RTC_SIGNALLING_SERVER_URL = 'https://thrive19.com:9001/';
//export const RTC_SIGNALLING_SERVER_URL = 'https://rtcmulticonnection.herokuapp.com:443/';
export const ICE_SERVERS = null;
export const PREFIX_LGT = 'LGT';
export const DEFAULT_TIMEZONE = 'Australia/Sydney';