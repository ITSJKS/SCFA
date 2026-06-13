'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def reverse(head):
    prev = None
    curr = head
    count = 0

    while curr!=None and count<2:
        temp = curr.next
        curr.next = prev
        prev = curr
        curr = temp
        count+=1

    return prev,curr

def swapPairs(head):
    if head==None:
        return head

    temp = head
    count = 0

    while temp!=None and count<2:
        temp = temp.next
        count+=1

    if count<2:
        return head

    prev, curr = reverse(head)

    head.next = swapPairs(curr)

    return prev