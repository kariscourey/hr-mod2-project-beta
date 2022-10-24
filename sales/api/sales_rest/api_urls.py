from django.urls import path

from .api_views import (
    api_sales,
    api_sale,
)

urlpatterns = [
    path("sales/", api_sales, name="api_sales"),
    path("sales/<int:pk>/", api_sale, name="api_sale"),
]