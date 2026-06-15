'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    k = 2
    c = head
    for _ in range(k):
        if c is None:
            return head
        c = c.next
    
    curr = head
    prev = None
    front = head


    for _ in range(k):
        front = front.next
        curr.next = prev
        prev = curr
        curr = front 
    
    if curr is not None:
        head.next = swapPairs(curr)
    return prev

    # l1 = []
    # k = 2
    # l = []
    
    # curr = head


    # while curr.next:
    #     l1.append(curr.data)
    #     curr = curr.next
    # l1.append(curr.data)

    # i = 0

    # j = 1

    # while i <= len(l1):
    #     l.append(j)
    #     l.append(i)
    #     i += 1
    #     j += 1
    # print(l)
    

    
        


    # k = 2
    # curr = head
    # prev = None
    # front = head
    # c = head
    # for _ in range(k):
    #     if c == c.next:
    #         c = c.next

    # for _ in range(k):
    #     front = curr.next
    #     prev.next = curr
    #     curr = front
    # curr = swapPairs(curr)
    # return prev