sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * Fetches the CSRF Token to authenticate with 
         * POST, PUT & DELETE AJAX Requests
         * @param {url} String 
         * @param {self} this        
         */
        fetchCsrfToken: function(url) {
            const tokenHeader = "X-CSRF-TOKEN"
            return new Promise((resolve, reject) => {
                $.ajax({
                    "context": this,
                    "type": "GET",
                    "url": url,
                    beforeSend: xhr => {
                        xhr.setRequestHeader(tokenHeader, "Fetch");
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    },
                    complete: xhr => {
                        let csrf_token = xhr.getResponseHeader(tokenHeader);
                        resolve(csrf_token)
                    },
                    error: err => reject(err)
                }); 
            })
        }
    }
})