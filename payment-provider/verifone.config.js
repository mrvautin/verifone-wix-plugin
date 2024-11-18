export function getConfig() {
  return {
    title: 'Verifone Payments',
    paymentMethods: [
      {
        hostedPage: {
          title: 'Verifone Payments',
          logos: {},
        },
      },
    ],
    credentialsFields: [
      {
        dropdownField: {
          name: 'environment',
          label: 'Environment',
          options: [
            {
              value: 'EMEA',
              key: 'https://emea.gsc.verifone.cloud/oidc/checkout-service/v2/checkout',
            },
            {
              value: 'Americas',
              key: 'https://us.gsc.verifone.cloud/oidc/checkout-service/v2/checkout',
            },
            {
              value: 'Australia',
              key: 'https://au.gsc.verifone.cloud/oidc/checkout-service/v2/checkout',
            },
            {
              value: 'New Zealand',
              key: 'https://nz.gsc.verifone.cloud/oidc/checkout-service/v2/checkout',
            },
            {
              value: 'Sandbox / Dev',
              key: 'https://cst.test-gsc.vfims.com/oidc/checkout-service/v2/checkout',
            },
          ],
        },
      },
      {
        simpleField: {
          name: 'websiteUrl',
          label: 'Site URL (no trailing slash). Eg: https://example.com',
        },
      },
      {
        simpleField: {
          name: 'userId',
          label: 'Verifone User Id',
        },
      },
      {
        simpleField: {
          name: 'apiKey',
          label: 'Verifone API key',
        },
      },
      {
        simpleField: {
          name: 'organisationId',
          label: 'Verifone Organisation Id',
        },
      },
      {
        simpleField: {
          name: 'paymentContractId',
          label: 'Verifone Payment Contract Id',
        },
      },
      {
        simpleField: {
          name: 'currencyCode',
          label: 'Currency code (3 characters - Eg: USD)',
        },
      },
    ],
  };
}