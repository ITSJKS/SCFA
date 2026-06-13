'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head,k=2):
    curr = head
    count = 0
    while curr and count<k:
        curr = curr.next
        count+=1
    if count <k:
        return head
    curr = head
    prev = None
    count = 0
    while curr and count<k:
        nst = curr.next
        curr.next = prev
        prev = curr
        curr = nst
        count+=1
    head.next = swapPairs(curr,2)
    return prev