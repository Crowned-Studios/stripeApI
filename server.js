// secret key: sk_test_51PIhpkIiDQteqCyiXVnySYfT0huH8yksS6QGi5abjcLyOgpSMEh9w1STAtIHq3Y4JNuvV30eZpF4M3ghIGKOUZg700M42zBjh3
// SubPrice: price_1PIhyoIiDQteqCyiUKasuUvq

const express = require('express');
var cors = require('cors'); //allows any IP address to access the express server to avoid any weird errors.
const stripe = require('stripe')('sk_test_51PIhpkIiDQteqCyiXVnySYfT0huH8yksS6QGi5abjcLyOgpSMEh9w1STAtIHq3Y4JNuvV30eZpF4M3ghIGKOUZg700M42zBjh3') //initializes a stripe client

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());



app.post("/checkout", async (req,res) => {
    /*
    req.body.items
    [
        {
            id: 1,
            quantity: 3
        }
    ]


    stripe wants
    [
        {
            price: 1,
            quantity: 3
        }
    ]
    */

    const items = req.body.items;
    console.log("Received items:", items);
    let lineItems = [];
    items.forEach((item) => {
        lineItems.push(
            {
                price:item.id,
                quantity: item.quantity
            }
        );
    });


    console.log("Line items for Stripe:", lineItems);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'subscription',
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        });
        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(4000, () => console.log("Listening on port 4000"))
