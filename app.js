require('dotenv').config();
const emailFunction = require('./pitneybowes/identifyEmail.js').identifyEmail;
const identifyAddress = require('./pitneybowes/identifyAddress.js').identifyAddress;
const restify = require('restify');
const builder = require('botbuilder');
const ASK_ADDRESS_DIALOG_NAME = "askAddress";
const ASK_EMAIL_DIALOG_NAME = 'askEmail';
const items = [{
    name: 'Item 1',
    image: "https://cdn.pixabay.com/photo/2013/09/12/08/06/cat-181608_1280.jpg"
},
{
    name: 'Item 2',
    image: "https://cdn.pixabay.com/photo/2015/11/16/22/14/cat-1046544_1280.jpg"
}, {
    name: 'Item 3',
    image: "https://cdn.pixabay.com/photo/2013/09/07/08/29/cat-179842_1280.jpg"
}];
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    (session, result, next) => {
        session.send('Hi! I\'m the Pitney bot and I can help you create an order or support ticket.');
        var choices = ['Make an order', 'Create a support ticket'];
        builder.Prompts.choice(session, 'What do you want to do?', choices, { listStyle: builder.ListStyle.button });
    },
    (session, result, next) => {
        session.privateConversationData.issueType = result.response.entity;
        if (session.privateConversationData.issueType == "Make an order") {
            session.beginDialog('order');
        }
        else {
            session.beginDialog('support');
        }
    }
]);
bot.dialog(ASK_EMAIL_DIALOG_NAME, [
    (session) => {
        builder.Prompts.text(session, 'Please, enter your email');
    },
    (session, result, next) => {
        session.privateConversationData.email = result.response;
        emailFunction(session.privateConversationData.email, (comment, errorResponse) => {
            if (comment == "V") { session.endDialog(); }
            else {
                session.send(errorResponse);
                session.beginDialog(ASK_EMAIL_DIALOG_NAME);
            }
        });
    },

    (session, result, next) => {
        session.endDialog();
    }
]);

bot.dialog(ASK_ADDRESS_DIALOG_NAME, [
    (session, result, next) => {
        var choices = ['USA', 'Canada', 'Mexico'];
        builder.Prompts.choice(session, 'Choose your country', choices, { listStyle: builder.ListStyle.button });
    },
    (session, result, next) => {
        session.privateConversationData.country = result.response.entity;
        builder.Prompts.text(session, 'Please enter your postal code');
    },
    (session, result, next) => {
        session.privateConversationData.postalCode = result.response;
        builder.Prompts.text(session, 'Please enter your city');
    },
    (session, result, next) => {
        session.privateConversationData.city = result.response;
        builder.Prompts.text(session, 'Please enter your adress');
    },
    (session, result, next) => {
        session.privateConversationData.addressLine1 = result.response;
        identifyAddress(session.privateConversationData.addressLine1, session.privateConversationData.city,
            session.privateConversationData.country, session.privateConversationData.postalCode, function (blockAddress, status, statusCode) {
                if (status == "F") { session.send(statusCode); session.beginDialog(ASK_ADDRESS_DIALOG_NAME); }
                else { session.privateConversationData.blockAddress = blockAddress; next(); }
            })
    },
    (session, result, next) => {
        session.endDialog();
    }
]);

bot.dialog('order', [
    (session, result, next) => {
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel);
        msg.attachments(
            items.map((item, i) => {
                return new builder.HeroCard(session)
                    .title(item.name)
                    .text(`Awesome ${item.name} `)
                    .images([builder.CardImage.create(session, item.image)])
                    .buttons([builder.CardAction.postBack(session, `Buy ${item.name}`, "Buy")])
            })
        );
        builder.Prompts.choice(session, msg, items.map(function (item) { return item.name; }))

    },
    (session, result, next) => {
        session.privateConversationData.item = result.response.entity;
        next();
    },
    (session, result, next) => {
        session.beginDialog(ASK_EMAIL_DIALOG_NAME);
    },
    (session, result, next) => {
        session.beginDialog(ASK_ADDRESS_DIALOG_NAME);
    },
    (session, result, next) => {
        var message = new builder.Message(session);
        const item = items.find((item, i) => {
            return session.privateConversationData.item === item.name;
        });
        message.attachments([
            new builder.HeroCard(session)
                .title(item.name)
                .text(session.privateConversationData.email)
                .subtitle(session.privateConversationData.blockAddress)
                .images([builder.CardImage.create(session, item.image)]),
        ]);
        session.send(message);
        next();
    },
    (session, result, next) => {
        var message = `Is this order correct?`;
        builder.Prompts.confirm(session, message, { listStyle: builder.ListStyle.button });
    },
    (session, result, next) => {
        if (result.response) {
            session.send('Awesome! Your order has been created.')
            session.endDialog();
        } else {
            session.endDialog('Ok. The order was not created. You can start again if you want.');
        }
    }
]);

bot.dialog('support', [
    (session, args, next) => {
        session.beginDialog(ASK_EMAIL_DIALOG_NAME);
    },
    (session, args, next) => {
        // session.send('Hi! I\'m the Pitney bot and I can help you create an order or support ticket.');
        builder.Prompts.text(session, 'Please briefly describe your problem to me.');
    },
    (session, result, next) => {
        session.privateConversationData.description = result.response;
        var choices = ['high', 'normal', 'low'];
        builder.Prompts.choice(session, 'Which is the severity of this problem?', choices, { listStyle: builder.ListStyle.button });
    },
    (session, result, next) => {
        session.privateConversationData.severity = result.response.entity;
        builder.Prompts.text(session, 'Which would be the category for this ticket (software, hardware, networking, security or other)?');
    },
    (session, result, next) => {
        session.privateConversationData.category = result.response;
        var message = `Great! I'm going to create a "${session.privateConversationData.severity}" severity ticket in the "${session.privateConversationData.category}" category. ` +
            `The description I will use is "${session.privateConversationData.description}". Can you please confirm that this information is correct?`;
        builder.Prompts.confirm(session, message, { listStyle: builder.ListStyle.button });
    },
    (session, result, next) => {
        if (result.response) {
            session.send('Awesome! Your ticked has been created.')
            session.endDialog();
        } else {
            session.endDialog('Ok. The ticket was not created. You can start again if you want.');
        }
    }
]);