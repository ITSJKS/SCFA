'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    prev = None
    curr = head
    if curr==None:
        return head
    for i in range(2):
        front = curr.next
        curr.next = prev
        prev = curr
        curr = front
    head.next = swapPairs(curr)
    return prev