import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: false,
      copy: [
        {
          src: "cmi5.xml",
          warn: true
        },
        {
          src: "components/game-trex-runner/images/100-percent",
          dest: "images/100-percent"
        },
        {
          src: "components/game-trex-runner/images/200-percent",
          dest: "images/200-percent"
        },
        {
          src: "components/game-trex-runner/sounds",
          dest: "sounds"
        },
        {
          src: "../node_modules/leaflet/dist/images",
          dest: "images"
        }
      ]
    }
  ]
};
