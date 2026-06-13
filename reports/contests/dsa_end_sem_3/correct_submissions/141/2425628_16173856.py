'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):

    dummy = Node(-1)
    prev = dummy
    temp = head
    
    while temp.next != None:
        
        nextOne = temp.next
        temp.next = prev
        prev = temp
        temp = nextOne

    temp.next = prev
    head.next = None 
    return temp