const app = require('express')();
const cds = require('@sap/cds');

const PORT = process.env.PORT || 4004;

const checkForScope = req => {
    /**
     * checks whether the incoming request required scope
     * if not, then it rejects the request
     * @{param} req
     */
    if (!req.user.is('mtcallback')) {
        const e = new Error('Forbidden');
        e.code = 403;
        return req.reject(e);
    }	
}
const main = async () => {
await cds.connect.to('db');
await cds.mtx.in(app);

const provisioning = await cds.connect.to('ProvisioningService');
provisioning.before(['UPDATE', 'DELETE', 'READ'], 'tenant', async (req) => {
        /**
         * checking for scope for all types of events
         * before invoking the api logic
         */
        checkForScope(req)
    });

    // running express server for the sidecar
    app.listen(PORT);
}

main();