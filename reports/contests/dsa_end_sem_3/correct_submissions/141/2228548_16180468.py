'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    arr =[]

    while head!= None:
        arr.append(head.data)
        head = head.next
    for i in range(len(arr)-1,-1,-1):
        print(arr[i],end =" ")