from django.shortcuts import render
from django.http import JsonResponse
from .serializers import TaskSerializer as ts
from .models import Task
from .CustomApiRes import ApiRes
import json
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token


def csrf_token_view(request):
    return JsonResponse({'csrfToken': get_token(request)})

def index(request):
    return render(request, 'index.html')



def taskView(request):
    if request.method == "GET":     # get request

        data = ts(Task.objects.all(), many=True).data
        res = ApiRes("SUCCESS", "Task details", data).json()
        return JsonResponse(res, safe=False)
    
    elif request.method == "POST":  # post request

        json_data = json.loads(request.body)
        task = ts(data=json_data)
        if task.is_valid():
            task.save()
            return JsonResponse(ApiRes("SUCCESS", "Task added", json_data).json(), safe=True)
        else:
            print(task.errors)
            return JsonResponse(ApiRes("ERROR", "task creation failed", {}).json(), safe=True)
        
    elif request.method == "PUT":   # put request
        
        json_data = json.loads(request.body)
        task = get_object_or_404(Task, id=json_data.get('id'))        
        if task is not None:
            task.isActive = False
            task.save()
            return JsonResponse(ApiRes("SUCCESS", "task updated", {}).json(), safe=True)
        else:
            return JsonResponse(ApiRes("ERROR", "task updated failed", {}).json(), safe=True)


def taskHistory(request):
    if request.method == "GET":
        tasks = Task.objects.filter(isActive=False)
        data = ts(tasks, many=True).data
        return JsonResponse(ApiRes("SUCCESS", "Task details", data).json(), safe=True)
