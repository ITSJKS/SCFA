'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''


# abc



def swapPairs(head):
    new_head= head.next
    i = head
    while i:
        j = i.next.next
        i.next.next = i
        if j:
            i.next = j.next
        else:
            i.next = None    
        i = j
        # j = i.next.next
    return new_head