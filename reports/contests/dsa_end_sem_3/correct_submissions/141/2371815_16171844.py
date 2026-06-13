'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    temp=head
    pre=None
    curr=None
    while(temp):
        curr=temp.next
        temp.next=pre
        pre=temp
        temp=curr
    return pre