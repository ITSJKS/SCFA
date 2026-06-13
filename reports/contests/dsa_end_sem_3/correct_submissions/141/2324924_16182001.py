'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    pre=None
    cur=head
    while cur:
        nextnode=cur.next
        cur.next=pre
        pre = cur
        cur=nextnode
    return pre