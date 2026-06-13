'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    def findkthNode(curr, k):
        k -= 1
        while k>0 and curr is not None:
            k-=1
            curr = curr.next
        return curr
    def reverse(head):
        prev = None
        curr = head
        agla = None
        while curr is not None:
            agla = curr.next
            curr.next = prev
            prev = curr
            curr = agla
        # return prev
    # return findkthNode(head, 2)
    temp = head 
    prevNode = None
    while temp is not None:
        kthNode = findkthNode(temp, 2)
        if kthNode is None:
            if prevNode:
                prevNode.next = temp
                break
        nextNode = kthNode.next
        kthNode.next = None
        reverse(temp)
        if temp == head:
            head = kthNode
        else:
            prevNode.next = kthNode
        prevNode = temp
        temp = nextNode
    return head