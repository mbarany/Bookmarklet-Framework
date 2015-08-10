window['com.michaelbarany.bookmarklet'].execute({
    css: [
        'http://localhost:8080/bookmarklets/sample/main.css'
    ],
    js: [
        'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min.js',
        'http://localhost:8080/bookmarklets/sample/libs/js.cookie-2.0.3.min.js'
    ],
    templates: [
        'http://localhost:8080/bookmarklets/sample/templates/main.hbs'
    ]
}, function ($, Handlebars, Cookies, template) {
    /**
     * Callback triggers after all the scripts and templates are loaded
     * First dependency is jQuery followed by JS and then Raw Templates
     */
     $.ajax({
        url: 'https://api.github.com/users'
     }).then(function (data) {
        var compiledTemplate = Handlebars.compile(template);
        var templateData = {
            title: 'Some Github Users',
            list: data
        };

        // Inject a Cookie
        Cookies.set('my_cookie', 'injected');

        // Build floating window from template
        $('body').append(compiledTemplate(templateData));
        
        var $outerContainer = $('.bookmarklet-demo');
        $outerContainer.find('.close').on('click', function (e) {
            e.preventDefault();
            $outerContainer.remove();
        });
     });
});
