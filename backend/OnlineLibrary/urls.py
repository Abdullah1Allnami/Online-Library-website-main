from django.contrib import admin
from django.urls import path
from OnlineLibrary import views
from OnlineLibrary.serializers import PhotoSerializer

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api.books/',views.book_list),
    path('api.books/<int:id>/',views.book_detail),
    path('api.authors/',views.author_list),
    path('api.authors/<int:id>/',views.author_detail),
    path('api.categories/',views.category_list),
    path('api.categories/<int:id>/',views.category_detail),
    path('api.users/',views.users_list),
    path('api.users/<int:id>/',views.user_detail),
    path('api.favorites/',views.favorite_list),
    path('api.favorites/<int:id>/',views.favorite_detail),
    path('api.BorrowTransaction/',views.BorrowTransaction_list),
    path('api.BorrowTransaction/<int:id>/',views.borrow_transaction_detail),
    path('photo/', views.photo_view, name='photo-upload'),
    path('photo/<int:pk>/', views.photo_view, name='photo-detail'),
]
