from rest_framework import serializers
from .models import Message
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import Blog
from .models import Comment

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("Username already in use.")
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance.username = validated_data.get('username', instance.username)

        if password:
            instance.password = make_password(password)

        instance.save()
        return instance
    
class BlogSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    like_count = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ['id', 'title', 'description', 'author', 'like_count', 'liked_by_user']

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_liked_by_user(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        return obj.likes.filter(id=user.id).exists() if user and user.is_authenticated else False

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'blog', 'author', 'author_username', 'content',
            'parent', 'created_at', 'updated_at', 'replies'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at', 'replies']

    def get_replies(self, obj):
        children = obj.replies.all()
        return CommentSerializer(children, many=True).data if children else []