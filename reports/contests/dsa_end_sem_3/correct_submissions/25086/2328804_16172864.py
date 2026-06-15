'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    def f(head,k):
        def r(start,end):
            prev=None
            while start!=end:
                temp=start.next
                start.next=prev
                prev=start
                start=temp
            return prev
        
        x=Node(-1)
        x.next=head
        pre=x
        while True:
            kth=pre
            for i in range(k):
                kth=kth.next
                if not kth: 
                    return x.next
            nxt=kth.next
            start=pre.next
            pre.next=r(start,nxt)
            start.next=nxt
            pre=start
    return f(head,2)