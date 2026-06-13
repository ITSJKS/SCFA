'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    curr = head 
    for _ in range(2):
        if not curr:
            return head 
        curr = curr.next
    
    prev = None 
    curr = head 
    for _ in range(2):
        front = curr.next 
        curr.next = prev 
        prev = curr
        curr =front 
    
    head.next = swapPairs(curr)
    return prev