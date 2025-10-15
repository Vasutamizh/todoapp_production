"""
URL configuration for todoapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.views.static import serve
from django.conf import settings
from app import views as view

urlpatterns = [
    path('csrf/', view.csrf_token_view),
    path('api', view.taskView),
    path('api/history', view.taskHistory),
    path('', view.index),
    re_path(r'^(?P<path>manifest\.json)$', serve, {'document_root': settings.BASE_DIR / 'pwa'}),
    re_path(r'^(?P<path>service-worker\.js)$', serve, {'document_root': settings.BASE_DIR / 'pwa'}),
    re_path(r'^icons/(?P<path>.*)$', serve, {'document_root': settings.BASE_DIR / 'pwa' / 'icons'}),
    re_path(r'^.*$', view.index, name='index'), 
]
