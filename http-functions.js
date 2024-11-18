import { getSecret } from 'wix-secrets-backend';
import wixPaymentProviderBackend from 'wix-payment-provider-backend';
import { fetch } from 'wix-fetch';
import { response } from 'wix-http-functions';

export async function get_checkoutReturn(request) {
  const transaction_id = request.query.transaction_id;
  const checkout_id = request.query.checkout_id;

  // Check the result
  try {
    const verifoneApiKey = await getSecret('VERIFONE_APIKEY');
    const verifoneUserid = await getSecret('VERIFONE_USERID');
    const verifoneEnvironment = await getSecret('VERIFONE_ENVIRONMENT');
    const paymentResponse = await fetch(`${verifoneEnvironment}/${checkout_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${verifoneUserid}:${verifoneApiKey}`)}`,
      },
    });
    const paymentJson = await paymentResponse.json();

    console.log('Payment response', paymentJson);

    // If approved
    if (paymentJson.status === 'COMPLETED') {
      await wixPaymentProviderBackend.submitEvent({
        event: {
          transaction: {
            wixTransactionId: paymentJson.merchant_reference,
            pluginTransactionId: transaction_id,
          },
        },
      });
    } else {
      // If declined
      await wixPaymentProviderBackend.submitEvent({
        event: {
          transaction: {
            wixTransactionId: paymentJson.merchant_reference,
            pluginTransactionId: transaction_id,
            reasonCode: 3012,
            errorCode: 'TRANSACTION_DECLINED',
            errorMessage: 'Transaction declined',
          },
        },
      });
    }
    return response({
      status: 302,
      headers: {
        location: `${request.headers['x-wix-code-public-url']}thank-you-page/${paymentJson.merchant_reference}`,
      },
    });
  } catch (ex) {
    console.log('Verifone payment exception - Check logs:', ex);
    return response({
      status: 302,
      headers: {
        location: `${request.headers['x-wix-code-public-url']}cart-page`,
      },
    });
  }
}