/**
 * Google Tag Manager Loader
 * Loads GTM script dynamically
 */

(function() {
    'use strict';

    const GTM_ID = 'GTM-T7NGQDC2';

    // Load GTM script
    function loadGTM() {
        // GTM script
        (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),
            dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',GTM_ID);

        // GTM noscript iframe
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);

        // Insert noscript at the beginning of body
        if (document.body.firstChild) {
            document.body.insertBefore(noscript, document.body.firstChild);
        } else {
            document.body.appendChild(noscript);
        }
    }

    // Execute on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadGTM);
    } else {
        loadGTM();
    }
})();
