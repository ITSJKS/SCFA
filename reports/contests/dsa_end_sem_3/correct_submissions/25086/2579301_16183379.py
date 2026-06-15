'''
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
'''

def swapPairs(head):

    if head == None or head.next == None:
        return head

    prev = None
    curr = head
    head = head.next

    while curr != None and curr.next != None:

        front = curr.next

        # swapping links
        curr.next = front.next
        front.next = curr

        # connect previous pair
        if prev != None:
            prev.next = front

        # move prev and curr
        prev = curr
        curr = curr.next

    return head