from django.contrib import admin
from .models import Book, User, Favorite, Author, BorrowTransaction, Category, Photo

admin.site.register(Book)
admin.site.register(User)
admin.site.register(Favorite)
admin.site.register(Author)
admin.site.register(BorrowTransaction)
admin.site.register(Category)
admin.site.register(Photo)