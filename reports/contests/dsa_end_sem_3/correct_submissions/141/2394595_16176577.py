'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    curr = head
    prev = None
    while curr!= None:
        next = curr.next
        curr.next = prev
        prev=curr
        curr = next
    return prev
   
       
        









        
    return prev