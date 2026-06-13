'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if head==None:
        return head
    curr=head
    temp=None
    while curr!=None:
        front=curr.next
        curr.next=temp
        temp=curr
        curr=front
    return temp