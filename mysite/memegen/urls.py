from django.urls import path
from . import views

urlpatterns = [
	path('', views.search, name='search'),
	path('search/', views.search, name='search'),
	path('search/search-photos/', views.search_photos, name='search-photos'),
	path('search/<str:photo_url>/', views.edit_photo, name='edit-photo'),
]