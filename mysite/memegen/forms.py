from django import forms

class SearchForm(forms.Form):
	search_query = forms.CharField(label='Search Query ', max_length=100)
	# @TODO: Add parameters for user to narrow search