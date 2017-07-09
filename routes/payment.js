
var Iyzipay = require('iyzipay');
var config = require('config');

module.exports = function (app) {

    var conversationId;
    var token;

    app.post('/paymentResult', isLoggedIn, function (req, res) {
        var rows = req.params;
        var iyzipay = new Iyzipay(
            config.get("iyzico_client.api")
        );

        iyzipay.checkoutForm.retrieve({
            locale: Iyzipay.LOCALE.EN,
            conversationId: conversationId,
            token: token
        }, function (err, result) {
            console.log(err, result);
            var status=result.status;
            var errorCode=result.errorCode;
            var errorMessage=result.errorMessage;

            var message;
            if(result.status=='success') {
                message = "Ödemeniz Başarıyla Gerçekleştirildi!";
                req.getConnection(function (err, connection) {
                    connection.query("UPDATE translation_session set is_paid = 1 WHERE id = ? ", [conversationId], function (err, rows) {
                        if (err)
                            console.log("Error Updating : %s ", err);
                    });

                });
            }else {
                message = errorMessage;
            }

            res.render('paymentResult',{
                page_title: "Payment result",
                data: rows, result:result.status, message:message});

        });


    });

    app.get('/payment/:price/:currency/:sessionId', isLoggedIn, function (req, res) {

        var iyzipay = new Iyzipay(
            config.get("iyzico_client.api")
        );

          function paymentForm(done) {
            var price=req.params.price;
            var currency=req.params.currency;
            var sessionId=req.params.sessionId;

            var request = {
                locale: Iyzipay.LOCALE.EN,
                conversationId: sessionId,
                price: price,
                paidPrice: price,
              //  currency: Iyzipay.CURRENCY.TRY,
                currency: currency,
                basketId: 'B67832',
                paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
                callbackUrl: config.get("iyzico_client.callbackUrl"),
                enabledInstallments: [2, 3, 6, 9],
                buyer: {
                    id: 'BY789',
                    name: 'John',
                    surname: 'Doe',
                    gsmNumber: '+905350000000',
                    email: 'email@email.com',
                    identityNumber: '74300864791',
                    lastLoginDate: '2015-10-05 12:43:35',
                    registrationDate: '2013-04-21 15:12:09',
                    registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    ip: '85.34.78.112',
                    city: 'Istanbul',
                    country: 'Turkey',
                    zipCode: '34732'
                },
                shippingAddress: {
                    contactName: 'Jane Doe',
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    zipCode: '34742'
                },
                billingAddress: {
                    contactName: 'Jane Doe',
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                    zipCode: '34742'
                },
                basketItems: [
                    {
                        id: 'BI101',
                        name: 'Binocular',
                        category1: 'Collectibles',
                        category2: 'Accessories',
                        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                        price: '0.2'
                    },
                    {
                        id: 'BI102',
                        name: 'Game code',
                        category1: 'Game',
                        category2: 'Online Game Items',
                        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                        price: '125'
                    },
                    {
                        id: 'BI103',
                        name: 'Usb',
                        category1: 'Electronics',
                        category2: 'Usb / Cable',
                        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                        price: '24.8'
                    }
                ]
            };

            iyzipay.checkoutFormInitialize.create(request, function (err, result) {
                console.log(err, result);
                conversationId = result.conversationId;
                token = result.token;
                done(result);
            });
        }

        paymentForm(function (result) {
            console.log('awqwaw');
            res.redirect(result.paymentPageUrl);
        })

    });


    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }

}
