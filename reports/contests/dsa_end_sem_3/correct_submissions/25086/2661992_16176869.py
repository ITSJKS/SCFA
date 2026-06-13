'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    dummy=Node(-1)
    ans=dummy
    curr=head
    def rev(head):
        prev=None
        curr=head
        while curr:
            nxt=curr.next
            curr.next=prev
            prev=curr
            curr=nxt
        return prev
    while curr:
        farthest=curr.next.next
        curr.next.next=None
        refined=rev(curr)
        dummy.next=refined
        dummy=dummy.next.next
        dummy.next=farthest
        curr=dummy.next
    return ans.next