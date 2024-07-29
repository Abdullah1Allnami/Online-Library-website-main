from django.db import models
import os
from django.core.management.base import BaseCommand
from django.db import connection


class Photo(models.Model):
    image = models.ImageField(upload_to='photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    
    
class User(models.Model):
    username = models.CharField(max_length= 255,null=True)
    password = models.CharField(max_length=255,null=True)
    firstName = models.CharField(max_length=255,null=True)
    secondName = models.CharField(max_length=255,null=True)
    email = models.CharField(max_length=255,null=True)
    phoneNumber = models.CharField(max_length=11,null=True)
    photo = models.ForeignKey(Photo, on_delete=models.SET_NULL, null=True, default=11)
    isAdmin = models.BooleanField(null=True)
    
    def __str__(self):
        return self.username



class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class Author(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Book(models.Model):
    title = models.CharField(max_length=255,null=True)
    author = models.ForeignKey(Author, related_name='books', on_delete=models.SET_NULL, null=True)
    cover = models.ForeignKey(Photo, on_delete=models.SET_DEFAULT, null=True, default=20)
    rating = models.IntegerField(null=True)
    category = models.ForeignKey(Category, related_name='books', on_delete=models.SET_NULL, null=True)
    publish_date = models.DateField(null=True)
    available = models.BooleanField(default=True)
    description = models.TextField(null=False)
    publisher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title

class BorrowTransaction(models.Model):
    user = models.ForeignKey(User, related_name='borrows', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='borrows', on_delete=models.CASCADE)
    borrow_date = models.DateField(auto_now_add=True)
    def __str__(self):
        return f'{self.book.title} - {self.user.username}'
    class Meta:
        unique_together = ('user', 'book')
    
class Favorite(models.Model):
    user = models.ForeignKey(User, related_name='favorites', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='favorites', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.book.title} - {self.user.username}'
    class Meta:
        unique_together = ('user', 'book')