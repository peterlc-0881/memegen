from django.http import HttpResponse
from django.shortcuts import render

from .forms import SearchForm

import flickrapi

api_key = u'15b099664d1b449d2b840930dc0797c4'
api_secret = u'4eb2308d474ccfd6'
flickr = flickrapi.FlickrAPI(api_key, api_secret, format='parsed-json')

# Create your views here.
def index(request):
	return render(request, 'memegen/index.html', {})

# Call to render search.html
def search(request):
    form = SearchForm()
    return render(request, 'memegen/search.html', { 'form': form })

# Searches for photos using requested query
def search_photos(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        
        if form.is_valid():
            search_query = form.cleaned_data['search_query']
            ret = flickr.photos.search(text=search_query, media='photos', sort='relevance', per_page='10', extras='original_format')
            # @TODO: error handling
            context = dict(img_urls=[])

            for img in ret['photos']['photo']:

                img_url = 'https://farm' + str(img['farm']) + '.staticflickr.com/' + img['server'] + '/' + img['id'] + '_'
                img_ext = '.jpg'
                if 'originalformat' in img:
                    img_ext = '.' + img['originalformat']
                    img_url = img_url + img['originalsecret'] + img_ext
                else:
                    img_url = img_url + img['secret'] + img_ext
                    
                context['img_urls'].append(img_url)

            return render(request, 'memegen/display-search.html', context) 
        else:
            # @TODO: error handling
            return HttpResponse("Something is wrong!")

    else:
        # @TODO: error handling
        return HttpResponse("Something is wrong!")	