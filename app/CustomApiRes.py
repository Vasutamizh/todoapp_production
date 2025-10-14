class ApiRes:
    
    status = ""
    message = "" 
    data = None

    def __init__(self, status, message, data):
        self.status = status
        self.message = message
        self.data = data

    
    def json(self):
        return {"status":self.status, "message":self.message ,"data":self.data}
        
