from rest_framework import serializers
from .models import Book, Author, Category, User,Favorite,BorrowTransaction, Photo

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name']

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'cover', 'rating', 'category', 'publish_date', 'available', 'description', 'publisher']

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        # instance.cover = validated_data.get('cover', instance.cover)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.publish_date = validated_data.get('publish_date', instance.publish_date)
        instance.available = validated_data.get('available', instance.available)
        instance.description = validated_data.get('description', instance.description)
        # instance.publisher = validated_data.get('publisher', instance.publisher)
        
        author_id = validated_data.get('author')
        if author_id:
            try:
                author = Author.objects.get(id=author_id)
                instance.author = author
            except Author.DoesNotExist:
                raise serializers.ValidationError({'author': 'Author not found'})

        category_id = validated_data.get('category')
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                instance.category = category
            except Category.DoesNotExist:
                raise serializers.ValidationError({'category': 'Category not found'})
        
        cover_id = validated_data.get('cover')
        if cover_id:
            try:
                cover = Photo.objects.get(id=cover_id)
                instance.cover = cover
            except Photo.DoesNotExist:
                raise serializers.ValidationError({'cover': 'Photo not found'})
            
        publisher_id = validated_data.get('publisher')
        if publisher_id:
            try:
                publisher = User.objects.get(id=publisher_id)
                instance.publisher = publisher
            except User.DoesNotExist:
                raise serializers.ValidationError({'publisher': 'User not found'})
        
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'firstName', 'secondName', 'email', 'phoneNumber', 'photo', 'isAdmin']

    def update(self, instance, validated_data):
        instance.password = validated_data.get('password', instance.password)
        instance.firstName = validated_data.get('firstName', instance.firstName)  # Corrected field name
        instance.secondName = validated_data.get('secondName', instance.secondName)
        instance.email = validated_data.get('email', instance.email)
        instance.phoneNumber = validated_data.get('phoneNumber', instance.phoneNumber)
        
        # Handle the photo field separately
        photo_id = validated_data.get('photo')
        if photo_id is not None:
            try:
                photo_instance = Photo.objects.get(id=photo_id)
                instance.photo = photo_instance
            except Photo.DoesNotExist:
                raise serializers.ValidationError("Photo instance with given id does not exist")

        instance.save()
        return instance      


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'book']


class BorrowTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowTransaction
        fields = ['id', 'user', 'book', 'borrow_date']