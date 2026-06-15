'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    p1 = None
    n1 = None
    c1= head
    while c1:
        n1 = c1.next.next
        c1.next.next = p1
        p1 = c1
        c1 = n1

    p2= None
    n2 = None
    c2 = p1
    while c2:
        n2 = c2.next
        c2.next = p2
        p2 = c2
        c2 = n2
    return p2