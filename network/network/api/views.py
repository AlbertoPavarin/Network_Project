import json
from django.http import HttpResponseRedirect, JsonResponse
from rest_framework import generics
from django.contrib.auth import authenticate, login
from .models import *
from rest_framework import status
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
class UserView(generics.CreateAPIView):
    querySet = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, format=None):
        serializer = UserSerializer(self.querySet, many=True)
        return Response({'detail': serializer.data})

def isLoggedIn(request):
    if request.method == 'GET':
        if len(request.user.username) > 0:
            return JsonResponse({'Success': f'{request.user.username}'}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'Not ok': 'Not logged in'}, status=status.HTTP_404_NOT_FOUND)

class CreateUserView(APIView):
    serializerClass = CreateUserSerializer
    
    def post(self, request, format=None):
        serializer = self.serializerClass(data=request.data) # dati
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@csrf_exempt
def login_view(request):
        if request.method == 'POST':
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            user = User.objects.filter(username=username)
            if len(user) > 0:
                if user[0].is_superuser == True:
                    userA = authenticate(request, username=username, password=password)
                    if userA is not None:
                        login(request, userA)
                        return JsonResponse({'ok':'ok'})
            
                if user[0].password == password:
                    login(request, user[0])
                    return JsonResponse({'ok':'ok'})
                else:
                    return JsonResponse({'Bad request':'Bad request'}, status=status.HTTP_400_BAD_REQUEST )       
            return JsonResponse({'Bad request':'Bad request'}, status=status.HTTP_400_BAD_REQUEST)

        return HttpResponseRedirect('/login')
        
            
class GetUserByID(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id is not None:
            user = User.objects.filter(pk=id)
            if len(user) > 0:
                data = UserSerializer(user[0]).data
                return Response(data, status=200)
            return Response({'User not found': 'Invalid id'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad request': 'No id passed'}, status=status.HTTP_400_BAD_REQUEST)


class GetUser(APIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = 'username'

    def get(self, request, format=None):
        username = request.GET.get(self.lookup_url_kwarg)
        if username is not None:
            user = User.objects.filter(username=username)
            if len(user) > 0:
                data = UserSerializer(user[0]).data
                return Response(data, status=200)
            return Response({'User not found': 'Invalid username'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad request': 'No username passed'}, status=status.HTTP_400_BAD_REQUEST)

class PostView(generics.CreateAPIView):
    serializer_class = PostSerializer

    def get(self, request, format=None):
        query_set = Post.objects.all().order_by('-timestamp')
        serializer = PostSerializer(query_set, many=True)
        return Response({'detail': serializer.data})

class GetPost(APIView):
    serializer_class = PostSerializer
    lookup_url_karg = 'id'

    def get(self, request, format=None):
        postId = request.GET.get(self.lookup_url_karg)
        if postId is not None:
            post = Post.objects.filter(pk=postId)
            if len(post) > 0:
                return Response(PostSerializer(post[0]).data, status=status.HTTP_200_OK)
            return Response({'Post not found': 'Invalid id'})

        return Response({'Bad request': 'No id passed'}, staus=status.HTTP_400_BAD_REQUEST)


class GetUserPostView(APIView):
    serializer_class = PostSerializer
    lookup_url_karg = 'username'

    def get(self, request, format=None):
        username = request.GET.get(self.lookup_url_karg)
        if username is not None:
            user = User.objects.filter(username=username)
            if len(user) > 0:
                userPosts = Post.objects.filter(owner=user[0]).order_by('-timestamp')
                data = PostSerializer(userPosts, many=True)
                return Response({'detail': data.data})
            return Response({'User not found': 'Invalid username'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad request': 'No username passed'}, status=status.HTTP_400_BAD_REQUEST)


class CreatePostView(APIView):
    serializer_class = CreatePostSerializer

    #@login_required
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            content = serializer.data.get('content')
            post = Post(owner=request.user, content=content)
            post.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentView(APIView): 
    serializer_class = CommentSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        post_id = request.GET.get(self.lookup_url_kwarg)
        if post_id is not None:
            post = Post.objects.filter(pk = post_id)
            if len(post) > 0:
                comments = post[0].post.all()
                serializer = CommentSerializer(comments, many=True)
                return Response({'detail':serializer.data}, status=status.HTTP_200_OK)
            return Response({'Not found': 'Post Not Found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad request': 'No id passed'}, status=status.HTTP_400_BAD_REQUEST)    

class CreateCommentView(APIView):
    serializer_class = CreateCommentSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            content = serializer.data.get('content')
            postId = serializer.data.get('post')
            post = Post.objects.filter(pk = postId)
            if len(post) > 0:
                comment = Comment(commentator=request.user, content=content, post=post[0])
                comment.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditBio(APIView):
    serializer_class = BioSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            firstName = serializer.data.get('first_name')
            lastName = serializer.data.get('last_name')
            info = serializer.data.get('info')
            user = User.objects.filter(pk=request.user.id)
            if len(user) > 0:
                user.update(last_name=lastName, first_name=firstName, info=info)
                    
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class FollowView(APIView):
    serializer_class = FollowSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            following = serializer.data.get('following')
            user = User.objects.filter(pk=following)
            if len(user) > 0:
                follow = Follower(follower=request.user, following=user[0])
                follow.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'Bad request': 'No user'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IsFollowing(APIView):
    serializer_class = FollowSerializer
    lookup_url_kwarg = 'username'

    def get(self, request, format=None):
        username = request.GET.get(self.lookup_url_kwarg) # User to control if he is followed by the current user
        if username is not None:
            user = User.objects.filter(id=request.user.id)
            for user in user[0].follower.all():
                if username == str(user):
                    return Response({'Found': True}, status=status.HTTP_200_OK)
            return Response({'Not Found': 'User not found beetween the followers'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad request': 'No username passed'}, status=status.HTTP_400_BAD_REQUEST)

class UnfollowView(APIView):
    serializer_class = FollowSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            following = serializer.data.get('following')
            follow = Follower.objects.filter(follower=request.user.id).filter(following=following)
            if len(follow) > 0:
                follow.delete()
                return Response({'Unfollowed': 'User Unfollowed'}, status=status.HTTP_200_OK)
            return Response({'Not Found': 'Follow not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Invalid':'Invalid'}, status=status.HTTP_400_BAD_REQUEST)

class GetFollowerNumberView(APIView):
    serializer_class = FollowerSerializer

    def get(self, request, format=None):
        followerNumber = Follower.objects.filter(follower=request.user).count()
        return Response({'Count': followerNumber})

class GetFollowingNumberView(APIView):
    serializer_class = FollowSerializer
    lookup_url_kwarg = 'username'

    def get(self, request, format=None):
        username = request.GET.get(self.lookup_url_kwarg)
        if username is not None:
            user = User.objects,filter(username=username)
            if len(user) > 0:
                followingNumber = Follower.objects.filter(following=user[0]).count()
                return Response({'Count': followingNumber})
            return Response({'Not Found': 'User passed not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request': 'No username passed'}, status=status.HTTP_400_BAD_REQUEST)
