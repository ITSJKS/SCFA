'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    arr = []

    curr = head
    while curr:
        arr.append(curr.data)
        curr = curr.next
    
    arr.reverse()
    print(*arr)