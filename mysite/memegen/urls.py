from django.urls import path
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('search/', views.search, name='search'),
	path('search-photos/', views.search_photos, name='search-photos'),
	path('<str:photo_url>/', views.edit_photo, name='edit-photo'),
]