'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if head.next is not None:
        prev = head
        curr = head.next
        nxt = curr.next
        head.next=None
        while curr is not None:
            curr.next = prev
            prev = curr
            curr = nxt
            if nxt is not None:
                nxt = curr.next
        # print(curr.val,nxt.val,prev.val)
        return prev
    else:
        return head