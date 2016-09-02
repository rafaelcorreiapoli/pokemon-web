import { ServiceConfiguration } from 'meteor/service-configuration'

ServiceConfiguration.configurations.upsert(
  { service: 'facebook' },
  {
    $set: {
      appId: '580886965453350',
      secret: '67e4ddb72bea847c79905afdd24b077c',
      loginStyle: 'popup',
    },
  },
);
