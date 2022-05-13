from django.urls import path
from .views import *

urlpatterns = [
    path('create-user', CreateUserView.as_view()),
    path('isLoggedIn', isLoggedIn),
    path('users', UserView.as_view()),
    path('get-user/', GetUser.as_view()),
    path('create-post', CreatePostView.as_view()),
    path('login', login_view),
    path('posts', PostView.as_view()),
    path('get-user-id/', GetUserByID.as_view()),
    path('get-user-posts/', GetUserPostView.as_view()),
    path('get-comments/', CommentView.as_view()),
    path('create-comment', CreateCommentView.as_view()),
    path('get-post/', GetPost.as_view()),
    path('edit-bio/', EditBio.as_view()),
    path('create-follower', FollowView.as_view()),
    path('isFollowing/', IsFollowing.as_view()),
    path('unfollow', UnfollowView.as_view()),
    path('get-follower-count/', GetFollowerNumberView.as_view()),
    path('get-following-count/', GetFollowingNumberView.as_view()),
]