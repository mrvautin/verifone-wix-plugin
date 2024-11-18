import { Permissions, webMethod } from 'wix-web-module';
import { fetch } from 'wix-fetch';

export const createCheckout = webMethod(
  Permissions.Anyone,
  async function (options) {
    const { merchantCredentials, wixTransactionId, totalAmount } = options;

    // Build the payment payload
    const payload = {
      entity_id: merchantCredentials.organisationId,
      currency_code: merchantCredentials.currencyCode,
      amount: totalAmount,
      interaction_type: 'HPP',
      merchant_reference: wixTransactionId,
      shop_url: `${merchantCredentials.websiteUrl}/cart-page`,
      return_url: `${merchantCredentials.websiteUrl}/_functions/checkoutReturn`,
      redirect_method: 'HEADER_REDIRECT',
      configurations: {
        card: {
          shopper_interaction: 'ECOMMERCE',
          payment_contract_id: merchantCredentials.paymentContractId,
        },
      },
    };

    try {
      const response = await fetch(merchantCredentials.environment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(
            `${merchantCredentials.userId}:${merchantCredentials.apiKey}`
          )}`,
        },
        body: JSON.stringify(payload),
      });
      const res = await response.json();
      return {
        id: res.id,
        url: res.url,
      };
    } catch (ex) {
      console.log('Verifone payment exception - Check logs:', ex);
      return;
    }
  }
);