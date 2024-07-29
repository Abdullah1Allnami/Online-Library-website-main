from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from .models import Book, Author, Category, User, Favorite, BorrowTransaction, Photo
from .serializers import BookSerializer,AuthorSerializer, UserSerializer , FavoriteSerializer, BorrowTransactionSerializer, CategorySerializer, PhotoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.conf import settings
import os

@api_view(['GET', 'POST', 'DELETE', 'PUT']) 
def photo_view(request, pk=None):
    if request.method == 'POST':
        image = request.FILES.get('image')
        if image:
            photo = Photo(image=image)
            photo.save()
            return JsonResponse({'id': photo.id, 'image': photo.image.url})
        
    elif request.method == 'GET' and pk:
        try:
            photo = Photo.objects.get(pk=pk)
            with open(photo.image.path, 'rb') as f:
                return HttpResponse(f.read(), content_type='image/jpeg')
        except Photo.DoesNotExist:
            return JsonResponse({'error': 'Photo not found'}, status=404)
    
    elif request.method == 'PUT' and pk:
        photo = get_object_or_404(Photo, pk=pk)
        old_image_path = photo.image.path
        data = request.data
        if 'image' in data:
            new_image = request.FILES.get('image')
            if new_image:
                # Update the image field
                photo.image = new_image
        serializer = PhotoSerializer(photo, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Delete the old image file if the new image is saved
            if 'image' in data and os.path.exists(old_image_path):
                os.remove(old_image_path)
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
    elif request.method == 'DELETE' and pk:
        photo = get_object_or_404(Photo, pk=pk)
        image_path = photo.image.path
        if os.path.exists(image_path):
            os.remove(image_path)
        photo.delete()
        return JsonResponse({}, status=status.HTTP_204_NO_CONTENT)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

@api_view(['GET', 'POST']) 
def book_list(request):

    if request.method == 'GET':    
        books = Book.objects.all()
        serializer = BookSerializer(books, many = True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)


@api_view(['GET', 'PUT', 'DELETE']) 
def book_detail(request, id):

    book = Book.objects.get(pk = id)

    if request.method == 'GET':
        serializer = BookSerializer(book)
        return JsonResponse(serializer.data, safe=False)
        
    
    if request.method == 'PUT':
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.update(book, request.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST']) 
def author_list(request):
    if request.method == 'GET':
        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many = True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)

def author_detail(request, id):
    book = Author.objects.get(pk = id)
    serializer = AuthorSerializer(book)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET', 'POST']) 
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = AuthorSerializer(categories, many = True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)

def category_detail(request, id):
    category = Category.objects.get(pk = id)
    serializer = CategorySerializer(category)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST', 'GET']) 
def users_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many = True)
        return JsonResponse(serializer.data, safe=False)
    
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)


@api_view(['GET', 'PUT']) 
def user_detail(request, id):
    
    user = User.objects.get(pk = id)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data, safe=False)
    
    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.update(user, request.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def favorite_list(request):
    

    if request.method == 'GET':
        favorites = Favorite.objects.all()
        serializer = FavoriteSerializer(favorites, many = True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)

@api_view(['GET', 'DELETE']) 
def favorite_detail(request, id):

    favorite = Favorite.objects.get(pk = id)

    if request.method == 'GET':
        serializer = FavoriteSerializer(favorite)
        return JsonResponse(serializer.data, safe=False)
        

    if request.method == 'DELETE':
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def BorrowTransaction_list(request):
    
    if request.method == 'GET':
        transactions = BorrowTransaction.objects.all()
        serializer = BorrowTransactionSerializer(transactions, many = True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        serializer = BorrowTransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)
        
@api_view(['GET', 'DELETE']) 
def borrow_transaction_detail(request, id):

    borrowID = BorrowTransaction.objects.get(pk = id)

    if request.method == 'GET':
        serializer = BorrowTransactionSerializer(borrowID)
        return JsonResponse(serializer.data, safe=False)
        

    if request.method == 'DELETE':
        borrowID.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)