from django.db import models


class Task(models.Model):
    taskName = models.CharField(max_length=250)
    dueTime = models.DateTimeField()
    priority = models.CharField(max_length=200)
    status = models.CharField(max_length=200)
    isActive = models.BooleanField()


    def __str__(self):
        return self.taskName
    


    

