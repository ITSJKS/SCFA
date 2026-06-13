'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    prev = head
    cur = head.next
    x = cur
    prev.next = None
    while cur.next!=None:
        temp = cur.next
        cur.next = prev
        prev.next = temp.next
        cur = temp.next
        prev = temp
    cur.next  = prev
    prev.next = None
    
    return x