from django.conf import settings
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.shortcuts import render

from .forms import SearchForm

import flickrapi
import urllib.parse

flickr = flickrapi.FlickrAPI(settings.API_KEY, settings.API_SECRET, format='parsed-json')
images = []
PAGE_SIZE = 10
MAX_ENTRIES = '100' # can be changed to pull more pictures from flickr, for demo purposes 100 suffices

# Create your views here.
def index(request):
	return render(request, 'memegen/index.html', {})

# Call to render search.html
def search(request):
    form = SearchForm()
    return render(request, 'memegen/index.html', { 'form': form })

# Searches for photos using requested query
def search_photos(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        
        if form.is_valid():
            search_query = form.cleaned_data['search_query']

            ret = flickr.photos.search(text=search_query, media='photos', sort='relevance', per_page=MAX_ENTRIES, extras='original_format')

            # @TODO: error handling

            global images
            images = []
            for img in ret['photos']['photo']:
                img_url = 'https://farm' + str(img['farm']) + '.staticflickr.com/' + img['server'] + '/' + img['id'] + '_'
                img_ext = '.jpg'
                if 'originalformat' in img:
                    img_ext = '.' + img['originalformat']
                    img_url = img_url + img['originalsecret'] + img_ext
                else:
                    img_url = img_url + img['secret'] + img_ext
            
                # @TODO: look into more secure ways of passing in url?

                encoded_url = urllib.parse.quote(img_url, safe='') # must encode to remove / and : => django misinterprets those chars
                images.append({'url': img_url, 'encoded': encoded_url, 'id': img['id'], 'title': img['title']})

        else:

            # @TODO: error handling

            return HttpResponse("Something is WRONG!")

    paginator = Paginator(images, PAGE_SIZE)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'memegen/display-search.html', {'page_obj': page_obj})

def edit_photo(request, photo_url):
    decoded_url = urllib.parse.unquote(photo_url)
    return render(request, 'memegen/edit-photo.html', {'img_url': decoded_url})