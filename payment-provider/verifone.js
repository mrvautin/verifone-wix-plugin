import { createCheckout } from 'backend/verifone.web';
import { secrets } from 'wix-secrets-backend.v2';
import { elevate } from 'wix-auth';

export const connectAccount = async (options, context) => {
  const { credentials } = options;

  // Setup the secrets
  const elevatedListSecretInfo = elevate(secrets.listSecretInfo);
  const elevatedCreateSecret = elevate(secrets.createSecret);
  const elevatedUpdateSecretValue = elevate(secrets.updateSecret);

  // Get existing secrets
  const secretList = await elevatedListSecretInfo();
  const existingSecrets = {};
  for (const secret of secretList.secrets) {
    existingSecrets[secret.name] = secret;
  }

  // If secret doesn't exist
  if (!existingSecrets['VERIFONE_ENVIRONMENT']) {
    const environmentSecret = {
      name: 'VERIFONE_ENVIRONMENT',
      value: credentials.environment,
      description: 'Verifone Environment',
    };
    await elevatedCreateSecret(environmentSecret);
  } else {
    // Update existing secret
    await elevatedUpdateSecretValue(
      existingSecrets['VERIFONE_ENVIRONMENT']._id,
      {
        value: credentials.environment,
      }
    );
  }
  if (!existingSecrets['WEBSITE_URL']) {
    const websiteurlSecret = {
      name: 'WEBSITE_URL',
      value: credentials.websiteUrl,
      description: 'Website URL',
    };
    await elevatedCreateSecret(websiteurlSecret);
  } else {
    // Update existing secret
    await elevatedUpdateSecretValue(existingSecrets['WEBSITE_URL']._id, {
      value: credentials.websiteUrl,
    });
  }
  if (!existingSecrets['VERIFONE_APIKEY']) {
    const apiKeySecret = {
      name: 'VERIFONE_APIKEY',
      value: credentials.apiKey,
      description: 'Verifone API key',
    };
    await elevatedCreateSecret(apiKeySecret);
  } else {
    // Update existing secret
    await elevatedUpdateSecretValue(existingSecrets['VERIFONE_APIKEY']._id, {
      value: credentials.apiKey,
    });
  }
  if (!existingSecrets['VERIFONE_USERID']) {
    const userIdSecret = {
      name: 'VERIFONE_USERID',
      value: credentials.userId,
      description: 'Verifone User Id',
    };
    await elevatedCreateSecret(userIdSecret);
  } else {
    // Update existing secret
    await elevatedUpdateSecretValue(existingSecrets['VERIFONE_USERID']._id, {
      value: credentials.userId,
    });
  }

  return {
    credentials,
  };
};

export const createTransaction = async (options, context) => {
  const { merchantCredentials, order, wixTransactionId } = options;
  const totalAmount = order.description.totalAmount;

  const checkout = await createCheckout({
    merchantCredentials,
    wixTransactionId,
    totalAmount,
  });

  return {
    pluginTransactionId: checkout.id,
    redirectUrl: checkout.url,
  };
};

export const refundTransaction = async (options, context) => {};