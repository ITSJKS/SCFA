'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    def count(curr):
        c=0
        while curr and c<2:
            curr=curr.next
        return c==2
    def rev(curr):
        prev=None
        c=0
        while curr and c<2:
            nn=curr.next
            curr.next=prev
            prev=curr
            curr=nn
            c+=1
        return curr,prev
    d=Node(-1)
    d.next=head
    curr=head
    prev=d
    while curr:
        ns,nh=rev(curr)
        prev.next=nh
        curr.next=ns
        prev=curr
        curr=ns
    return d.next