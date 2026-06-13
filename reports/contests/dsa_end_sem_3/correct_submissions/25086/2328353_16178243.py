'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    dummy = Node(0)
    dummy.next = head
    prev = dummy
    curr = head
    while curr:
        temp = curr
        curr = curr.next
        prev.next = curr
        temp.next = curr.next
        curr.next = temp
        prev = temp
        curr = temp.next
    
    return dummy.next