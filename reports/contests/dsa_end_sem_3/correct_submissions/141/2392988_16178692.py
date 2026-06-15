'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if head.next==None:
        return head
    prev = head
    y = head.next
    prev.next = None
    while y.next!=None:
        temp = y.next
        y.next = prev
        prev = y
        y = temp
    y.next = prev
    return y