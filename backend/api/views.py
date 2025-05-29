from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework import status, generics, permissions
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from .models import Message, Blog, Comment
from .serializers import (
    MessageSerializer,
    RegisterSerializer,
    BlogSerializer,
    CommentSerializer,
    UserProfileSerializer
)

@api_view(['GET'])
def get_messages(request):
    messages = Message.objects.all()
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    else:
        print("Register serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username})
    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        username = self.kwargs['username']
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound("User not found")

        # Only allow the logged-in user to update their own profile
        if self.request.method in ['PUT', 'PATCH'] and user != self.request.user:
            raise PermissionDenied("You cannot update someone else's profile")

        return user

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def blog(request):
    if request.method == 'GET':
        blogs = Blog.objects.all().order_by('-id')
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def blog_details(request, pk):
    try:
        blog = Blog.objects.get(pk=pk)
    except Blog.DoesNotExist:
        return Response({'error': 'Blog not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BlogSerializer(blog)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if blog.author != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = BlogSerializer(blog, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if blog.author != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        blog_id = self.kwargs['blog_id']
        return Comment.objects.filter(blog_id=blog_id, parent=None).order_by('-created_at')

    def perform_create(self, serializer):
        blog_id = self.kwargs['blog_id']
        serializer.save(author=self.request.user, blog_id=blog_id)

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.all()

    def perform_update(self, serializer):
        comment = self.get_object()
        if self.request.user != comment.author:
            raise PermissionDenied("You do not have permission to edit this comment.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.author and self.request.user != instance.blog.author:
            raise PermissionDenied("You do not have permission to delete this comment.")
        instance.delete()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, blog_id):
    blog = Blog.objects.get(id=blog_id)
    user = request.user
    if user in blog.likes.all():
        blog.likes.remove(user)
        liked = False
    else:
        blog.likes.add(user)
        liked = True
    return Response({'liked': liked, 'like_count': blog.like_count})

@api_view(["GET"])
def user_blogs(request, username):
    try:
        user = User.objects.get(username=username)
        blogs = Blog.objects.filter(author=user)
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    
@api_view(["GET"])
def user_comments(request, username):
    try:
        user = User.objects.get(username=username)
        comments = Comment.objects.filter(author=user).select_related("blog")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)