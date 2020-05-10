from django import forms

class SearchForm(forms.Form):
	search_query = forms.CharField(label="", widget=forms.TextInput(attrs={'placeholder': 'Search'}), max_length=100)
	# @TODO: Add parameters for user to narrow search