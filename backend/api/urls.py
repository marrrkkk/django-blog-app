from django.urls import path
from .views import (
    get_messages,
    register_user,
    login_user,
    blog,
    blog_details,
    CommentListCreateView,
    CommentRetrieveUpdateDestroyView,
    toggle_like,
    UserProfileView,
    user_blogs,
    user_comments
)

urlpatterns = [
    path('messages/', get_messages),
    path('register/', register_user),
    path('login/', login_user),
    path('blogs/', blog, name='blog'),
    path('blogs/<int:pk>/', blog_details, name='blog_details'),

    # List and create comments for a blog
    path('blogs/<int:blog_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),

    # Retrieve, update, or delete a single comment by ID
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroyView.as_view(), name='comment-detail'),
    path('blogs/<int:blog_id>/like/', toggle_like),
    # Profile detail by username
    path('accounts/profile/<str:username>/', UserProfileView.as_view(), name='profile-detail'),

    # Blogs by username
    path('blogs/user/<str:username>/', user_blogs, name='user-blogs'),

    # Comments by username
    path('comments/user/<str:username>/', user_comments, name='user-comments'),

]
