'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    temp = head
    prev = None
    while temp!=None:
        fwd = temp.next
        temp.next = prev
        prev = temp
        temp = fwd
    return prev