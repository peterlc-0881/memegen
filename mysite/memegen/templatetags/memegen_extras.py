from django import template

register = template.Library()

@register.filter(name='index', is_safe=True)
def index(value, arg):
	return value[arg]