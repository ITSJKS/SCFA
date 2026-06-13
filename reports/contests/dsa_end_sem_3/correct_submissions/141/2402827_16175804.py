'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    curr=head
    
    arr=[]
    while curr:
        arr.append(curr.data)
        curr=curr.next
        
    for i in range(len(arr)-1,-1,-1):
        print(arr[i],end=" ")