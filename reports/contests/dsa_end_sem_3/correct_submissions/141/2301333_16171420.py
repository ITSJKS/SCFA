'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev = None
    temp = head
    while temp:
        hello = temp.next
        temp.next = prev
        prev = temp
        temp = hello
    return prev