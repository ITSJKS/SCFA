'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    prev = None
    nxt = None
    curr = head
    while curr:
        nxt = curr.next.next
        curr.next.next = prev
        prev = curr
        curr = nxt
    p1 = None
    n1 = None
    c1 = prev
    while c1:
        n1= c1.next
        c1.next = p1
        p1 = c1
        c1 = n1
    return p1