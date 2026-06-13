'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if(head==None):
        return None
    if(head.next==None):
        return head
    prev=None
    newnode=None
    while(head!=None):
        newnode=head.next
        head.next=prev
        prev=head
        head=newnode
    return prev