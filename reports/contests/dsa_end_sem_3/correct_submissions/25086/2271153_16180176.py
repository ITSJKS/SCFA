'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    dummy = Node(0)
    dummy.next = head
    grpprev = dummy
    kth = grpprev.next.next
    while kth is not None and kth.next is not None:
        grpnxt = kth.next
        init = grpprev.next
        grpprev.next.next = grpnxt
        kth.next = init
        grpprev.next=kth
        grpprev=init
        grpnxt=grpnxt.next.next
        kth = grpprev.next.next
    init = grpprev.next
    grpprev.next = kth
    kth.next = init
    init.next = None
    # print(grpprev.data,kth.data,init.data,grpnxt)
    return dummy.next