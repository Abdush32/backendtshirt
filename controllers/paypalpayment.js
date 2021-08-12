var braintree = require("braintree");

var gateway =  new braintree.BraintreeGateway({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'qhz7cwjk9pdxnsxt',
    publicKey:    'nd63p9tj89zqr8rt',
    privateKey:   '042a0a68f3a71f2b68cadfedadc387b9'
});





exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  };




exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
  
    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale(
      {
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
  
        options: {
          submitForSettlement: true
        }
      },
      function(err, result) {
        if (err) {
          res.status(500).json(error);
        } else {
          res.json(result);
        }
      }
    );
  };
  