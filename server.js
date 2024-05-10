const express = require('express');
const app = express();
var { createHandler } = require("graphql-http/lib/use/express")
const schema = require('./graphql/schemas');
const root = require('./graphql/resolvers');

app.use('/graphql', createHandler({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});