from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
    text = models.CharField(max_length=255)

class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)  # Optional: link blog to user
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='liked_blogs', blank=True)

    def __str__(self):
        return self.title

    @property
    def like_count(self):
        return self.likes.count()

    
class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_reply(self):
        return self.parent is not None

    def __str__(self):
        return f'{self.author.username}: {self.content[:20]}'