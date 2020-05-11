# MemeGen

## Dependencies
1. Python 3.6
2. Django v3.0.5
    - django-cors-headers v3.2.1 (https://github.com/adamchainz/django-cors-headers)
        - pip install django-cors-headers
    - django-crispy-forms v1.9.0 (https://github.com/django-crispy-forms/django-crispy-forms)
        - pip install django-crispy-forms
3. Flickr API v2.4.0 (https://stuvel.eu/flickrapi)
    - pip install flickrapi
4. JavaScript
    - JQuery v3.4.1 (https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js)
        - Referenced in source code via the CDN source above
    - Konva v5.0.3 (https://unpkg.com/konva@5.0.3/konva.min.js)
        - Referenced in source code via the link above
    - Bootstrap v4.4.1 (https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css)
        - Referenced in source code via the CDN source above

### Tested on the Following Web Browsers: Google Chrome (v81.0.4044.129 on Windows 10) and Firefox (v75.0 on Windows 10)

## How to Run
Currently, the application runs on a local web server provided by Django. To run the webserver, go to ../memegen/mysite/ and execute the following command:

> python manage.py runserver

Go to http://127.0.0.1:8000/memegen/ to start the app.

## Features to be Added
- Support for adding multiple text objects
- Support for rotation of the text object
